const { DateTime } = require('luxon')
const { Tourney } = require('../../models/tourneys')
const puppeteer = require('puppeteer')

// {
//   name: 'Dota 2',
//   link: 'https://play.eslgaming.com/dota2/europe/tournaments'
// },

class Bot {
  constructor(options) {
    this.games = [
      {
        name: 'Dota 2',
        link: 'https://play.eslgaming.com/dota2/europe/tournaments'
      }
    ]
    this.tounreysData = []
    this.links = []
    this.collectLinksOptions = {
      linksBlockSelector: '.panel-pane.pane-league-list .league-list.cups',
      linkSelector: 'a',
      /**
       * Processes the tourney URL.
       * @param {object} link - node with essential data
       * @returns {(string|null)} - final URL
       */
      linkHandler: link => {
        // chech if tourney hasn't begun
        let inProgress = !!link.querySelector(
          '.date[ng-if="ctrl.leagueIsInProgress(league)"]'
        )
        //check whether it is premium
        let title = link.attributes.title.value
        let premium = /premium/i.test(title)

        const result = 'https://play.eslgaming.com' + link.attributes[0].value

        return !inProgress && !premium ? result : null
      }
    }
  }

  async openBrowser(headless = true) {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless
    })
  }

  /**
   * Prevent existing tourneys from being added.
   * Updates `this.links`
   */
  async eliminateExistingLinks() {
    if (this.links.length == 0) return console.log('No links to eliminate')

    // load existing
    let existingTourneys = await Tourney.find({
      organisator: 'ESL',
      date: { $gt: new Date() }
    })
      .select({ link: 1 })
      .limit(1000)
      .catch(err => console.log('Bot error:', err))

    this.links = this.links.filter(link => {
      let exists = existingTourneys.find(tourney => tourney.link == link)
      return !exists
    })
  }

  /**
   * Collects links for future parsing.
   * @param {object} options - options for link parsing
   * @param {string} options.selectorToWait - options for link parsing
   * @example ({ selectorToWait: '.panel-pane.pane-league-list .league-list.cups a' }, )
   */
  async collectLinks(options) {
    const page = await this.browser.newPage()
    console.log('Connected to the page')

    for (let game of this.games) {
      if (!game) continue
      console.log('Loading links for ' + game.name + '...')

      let url = game.link

      await page.goto(url, { timeout: 0 })

      // make sure that the needed data is loaded
      try {
        await page.waitForSelector(selectorToWait)
      } catch (err) {
        console.log('Timeout. Skipping ', url)
        continue
      }

      // load and push links to the list
      this.links.push(
        ...(await page.evaluate(async options => {
          let linksBlock = await document.querySelector(
            options.linksBlockSelector
          )
          if (!linksBlock) return []

          let links = await linksBlock.querySelectorAll(options.linkSelector)

          let linksList = []

          for (let link of links) {
            let result = options.linkHandler(link)
            if (result) linksList.push(result)
          }

          return linksList
        }, this.collectcLinksOptions))
      )
    }
  }

  // should be done
  async parseTourney() {
    await page.goto(link, { timeout: 0 })
    await page.waitForSelector(
      '#block-te-league-ui-league-header > div > league-header > div > div > div.league--header__information > h4'
    )

    let tourneyObject = await page.evaluate(async () => {
      let title = await document.querySelector(
        '#block-te-league-ui-league-header > div > league-header > div > div > div.league--header__information > h4'
      )

      let date = await document.querySelector(
        `league-information div[ng-if="ctrl.league.timeline.inProgress.begin"] .c-league-information__schedule__value`
      )
      // leave only date in format '10 Mar 2019 16:00 MSK'
      if (date) date.innerText = date.innerText.match(/(\w*),\s(.*)/)[2]
      if (!date) return false

      let mode = document.querySelector(
        `league-information div[ng-if="ctrl.league.mode !== null"]`
      )
      if (mode) mode.removeChild(mode.querySelector('span'))
      // convert to the format of '5v5'
      if (mode) mode.innerText = mode.innerText.replace('on', 'v')

      let prize = document.querySelector(
        `league-information div[ng-if="ctrl.league.prizePool !== null && ctrl.league.prizePool !== '' && ctrl.league.prizePool"]`
      )
      if (prize) prize.removeChild(prize.querySelector('a'))
      if (prize) prize.removeChild(prize.querySelector('span'))
      if (prize) prize.innerText = prize.innerText.replace(/\./g, '')

      let result = { title, date, mode, prize }

      // set to text inside of the tag
      for (item in result) {
        if (result[item]) {
          result[item] = result[item].innerText
        }
      }

      return result
    })

    if (tourneyObject) tourneysList.push({ ...tourneyObject, link })
  }
}
