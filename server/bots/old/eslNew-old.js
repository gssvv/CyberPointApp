const { Tourney } = require('../../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

let months = {
  янв: 'Jan',
  фев: 'Feb',
  мар: 'Mar',
  апр: 'Apr',
  май: 'May',
  июн: 'Jun',
  июл: 'Jul',
  авг: 'Aug',
  сен: 'Sep',
  окт: 'Oct',
  ноя: 'Nov',
  дек: 'Dec'
}

class ESLBot {
  constructor(options = {}) {
    this.games = [
      {
        game: 'Dota 2',
        link: 'https://play.eslgaming.com/dota2/europe/tournaments'
      },
      {
        game: 'CS:GO',
        link: 'https://play.eslgaming.com/counterstrike/csgo/tournaments'
      },
      {
        game: 'PUBG',
        link: 'https://play.eslgaming.com/playerunknownsbattlegrounds/europe'
      },
      {
        game: 'Hearthstone',
        link: 'https://play.eslgaming.com/hearthstone/europe/tournaments'
      }
    ]
    this.validate(options)

    this.links = []
    this.tourneysParsed = []
    this.handlers = options.handlers
    this.organisator = options.organisator
    this.botName = options.botName
    this.report = { added: 0, failed: 0 }

    if (options.games)
      this.games = this.games.filter(game => options.games.includes(game.game))
  }

  async start() {
    await this.openBrowser()
    await this.getLinks()
    await this.excludeExistingTourneys()
    await this.parseTourneysUsingLinks()
    console.log(this.report)
    // await this.insertTourneys()
  }

  validate(options) {
    if (!options.handlers) throw Error('Handlers must be provided')

    if (!options.organisator) throw Error('Organisator name must be specified')

    if (!options.botName) throw Error('Bot name must be specified')
  }

  async openBrowser(headless) {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless
    })
  }

  async insertSingleTourney(tourney) {
    try {
      tourney.id = (await this.getLastTourneyId()) + 1
      const result = await Tourney.insertMany(tourney).catch(err =>
        console.log('Error inserting tourney:', err.message)
      )
      console.log('Successfully inserted:', result[0].id)
      this.report.added++
    } catch {
      console.log(`Error inserting tourney ${tourney.id}`)
      this.report.failed++
    }
  }

  async insertTourneys() {
    if (this.tourneysParsed.length == 0)
      return console.log('insertTourneys: no tourneys provided')

    let id = (await this.getLastTourneyId()) + 1
    this.tourneysParsed = this.tourneysParsed.map(val => ({
      ...val,
      ...{ id: id++ }
    }))
    console.log(this.tourneysParsed)

    const result = await Tourney.insertMany(this.tourneysParsed).catch(err =>
      console.log('Error inserting tourneys:', err.message)
    )

    if (result) {
      console.log(`Successfully added ${this.tourneysParsed.length} tourneys`)
      return { success: true, count: this.tourneysParsed.length }
    }
    if (result === 0) return { success: true, count: 0 }
  }

  /**
   * Collecting URLs on particular pages
   */
  async getLinks() {
    const page = await this.browser.newPage()

    for (let game of this.games) {
      console.log(`Parsing ${game.game} tourneys...`)

      await page.goto(game.link)

      try {
        await page.waitForSelector(
          '.panel-pane.pane-league-list .league-list.cups a'
        )
      } catch (err) {
        console.log('Timeout. Skipping ', url)
        return false
      }

      let gameLinksList = await page.$$eval(
        '.panel-pane.pane-league-list .league-list.cups a',
        async val => {
          let list = [...val]
          return list.map(link => {
            let inProgress = !!link.querySelector(
              '.date[ng-if="ctrl.leagueIsInProgress(league)"]'
            )
            let title = link.attributes.title.value
            let premium = /premium/i.test(title)

            let finished = /finished/i.test(link.innerText)

            if (!inProgress && !premium && !finished)
              return `https://play.eslgaming.com${link.attributes.href.value}`
          })
        }
      )
      gameLinksList = gameLinksList.filter(val => !!val)

      this.links.push(...gameLinksList)
    }

    console.log(`Loaded ${this.links.length} links`)

    await page.close()
  }

  /**
   * Parsing tourneys using URLs from this.links
   */
  async parseTourneysUsingLinks() {
    const page = await this.browser.newPage()

    for (let link of this.links) {
      console.log(`Visiting ${link}`)

      await page.goto(link, { timeout: 0 })
      await page.waitForSelector(
        'league-information .c-league-information__wrapper'
      )

      // objects that keeps data of how to process fields

      let tourney = {
        link: link,
        organisator: this.organisator,
        addedby: this.botName,
        status: 0
      }

      try {
        for (let field in this.handlers) {
          if (this.handlers[field].selector) {
            tourney[field] = await page.$$eval(
              this.handlers[field].selector,
              this.handlers[field].browserFormatter || undefined
            )
          }

          if (this.handlers[field].serverFormatter)
            tourney[field] = this.handlers[field].serverFormatter(
              tourney[field],
              tourney,
              this.handlers
            )
        }
      } catch {
        console.log('Error on tourney ' + link)
        this.report.failed++
        continue
      }
      await this.insertSingleTourney(tourney)
      // this.tourneysParsed.push(tourney)
    }

    await page.close()
  }

  /**
   * Excludes existing tourneys URLs from this.links
   */
  async excludeExistingTourneys() {
    let linksInitially = this.links.length
    let existingTourneys = await Tourney.find({
      organisator: 'ESL',
      date: { $gt: new Date() }
    })
      .select({ link: 1 })
      .limit(1000)
      .catch(err => console.log('Bot error: ', err))

    this.links = this.links.filter(link => {
      let exists = existingTourneys.find(tourney => tourney.link == link)
      return !exists
    })

    console.log(
      `Excluded ${linksInitially -
        this.links
          .length} existing tourneys links out of ${linksInitially} links.`
    )
  }

  /**
   * @returns {number} – id of the last tourney published
   */
  async getLastTourneyId() {
    let id = await Tourney.find()
      .select({ id: 1 })
      .sort({ id: -1 })
      .limit(1)
      .catch(err => console.log('Bot error:', err))
    id = id[0] ? id[0].id : 0
    return id
  }
}

/**
 * browserFormatter function
 * @param {nodeList} val – data passed from querySelector
 *
 * serverFormatter function
 * @param {object} field – field value, inherited from browser (after browserFormatter
 * @param {object} tourney – tourney object that has all previously processed values
 * @param {object} handlers - whole handlers object
 */

const handlers = {
  title: {
    selector:
      '#block-te-league-ui-league-header > div > league-header > div > div > div.league--header__information > h4',
    browserFormatter: val => val[0].innerText
  },
  game: {
    serverFormatter(field, { link }) {
      if (/hearthstone/i.test(link)) {
        return 'Hearthstone'
      } else if (/playerunknownsbattlegrounds/i.test(link)) {
        return 'PUBG'
      } else if (/dota2/i.test(link)) {
        return 'Dota 2'
      } else if (/counterstrike/i.test(link)) {
        return 'CS:GO'
      } else {
        throw Error(`URL does not fit any game: ${link}`)
      }
    }
  },
  teamMode: {
    selector: `league-information .c-league-information__wrapper:nth-child(2)`,
    browserFormatter: val => val[0].innerText.split(': ')[1].replace('on', 'v')
  },
  prize: {},
  date: {
    selector:
      'league-information .c-league-information__wrapper--timeline .o-flag__body format-date',
    browserFormatter: val => val[0].innerText.split(', ')[1],
    serverFormatter(field) {
      // field = val.split(' ')
      // field[1] = months[field[1]] // replace month to russian locale
      return dayjs(field).$d
    }
  },
  dateAdded: { serverFormatter: () => new Date() },
  block1: {
    serverFormatter(field, { teamMode, link }) {
      return `<p><strong>Регион:</strong> Europe</p>
              <p><strong>Режим:</strong> ${teamMode}</p>
              <p>Правила турнира описаны на <a href='${link}/rules' 
              target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>
              <p><i>Имейте в виду, что многие турниры от ESL проводятся только среди 
              жителей определенных стран или регионов (однако не все игроки стараются 
              соблюдать это).</i></p>`
    }
  },
  block2: {
    serverFormatter: () => '<i>Информация отсутствует</i>'
  }
}

let bot = new ESLBot({
  games: ['Dota 2'],
  handlers,
  organisator: 'ESL',
  botName: 'ESLBot'
})

bot.start()
