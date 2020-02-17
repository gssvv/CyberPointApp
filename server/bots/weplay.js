const dayjs = require('dayjs')
const Bot = require('./Bot')
let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

class EpulzeBot extends Bot {
  async getInputPages() {
    const page = await this.browser.newPage()
    let newPages = []

    for (let inputPage of inputPages) {
      await page.goto(inputPage.link)
      await page.waitForSelector('.PaginationInput--item__3U:last-child')
      await page.click('.PaginationInput--item__3U:last-child')
      let game = inputPage.name.match(/(.*) –/)[1]
      let match = page.url().match(/page-offset=(\d*)/)
      let totalPages = Number(match && match[1]) / 10 + 1

      if (totalPages || totalPages < 2)
        for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
          let offset = pageNum * 10 - 10

          newPages.push({
            name: `${game} – (${offset}-${offset + 10})`,
            link: `${inputPage.link}?page-offset=${offset}`
          })
        }
    }

    this.inputPages.push(...newPages)
    console.log(this.inputPages)

    await page.close()
  }
  async start(headless = true) {
    try {
      await this.openBrowser(headless)
      await this.getInputPages()
      await this.getLinks()
      await this.excludeExistingTourneys()
      await this.parseTourneysUsingLinks()
    } catch (e) {
      console.log(`Error on start(): ${e.message}`)
      this.report.message = 'Error occured'
    }
    return this.report
  }
}

let inputPages = [
  {
    name: 'Dota 2 – (1-10)',
    link: 'https://weplay.tv/tournaments/dota2'
  },
  {
    name: 'CS:GO – (1-10)',
    link: 'https://weplay.tv/tournaments/cs-go'
  }
]

let linksParser = {
  linkSelector:
    '.TournamentsListing--body__3G .TournamentCard--headerText__1r a',
  handler: async val => {
    let list = [...val]
    return list.map(link => {
      let status = link
        .closest('.TournamentCard--block__3E')
        .querySelector('.TournamentCard--status__1c').innerText
      let publicAccess = link
        .closest('.TournamentCard--block__3E')
        .querySelector('[title="Public access"]')

      if (status == 'Upcoming' && publicAccess)
        return `https://weplay.tv${link.attributes.href.value}`
    })
  }
}

let selectorToWaitOnPage = '.TournamentPage--header__2s'

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
    selector: '.TournamentPage--header__2s',
    browserFormatter: val => val[0].innerText
  },
  game: {
    serverFormatter: (field, { title }) => {
      return title.match(/(Dota 2)|(CS:GO)/i)[0]
    }
  },
  teamMode: {
    selector: `.Tip--block__3m`,
    browserFormatter: val => val[0].innerText
  },
  matchMode: {
    selector: `.TableRowTwoColumns--value__nw`,
    browserFormatter: val => val[3].innerText
  },
  prize: {
    selector:
      '.ShortTournamentInfo--isNotDynamicPrize__3u .ShortTournamentInfo--smallText__1s',
    browserFormatter: val => {
      let text = val[0].innerText
      let match = text.match(/(skins)|(gift cards)/i)
      let string = match[0].charAt(0).toUpperCase() + match[0].slice(1)

      return string
    }
  },
  date: {
    selector: `.TableRowTwoColumns--value__nw`,
    browserFormatter: val => val[4].innerText,
    serverFormatter: val => dayjs(val, 'DD.MM.YYYY (HH:mm)').$d
  },
  dateAdded: { serverFormatter: () => new Date() },
  block1: {
    selector: `.tournament-info .tournament-label`,
    browserFormatter: val => {
      return
    },
    serverFormatter(field, { teamMode, link, price }) {
      return `<p><strong>Режим:</strong> ${teamMode}</p>
              <p><strong>Стоимость участия:</strong> ${price || 'бесплатно'}</p>
              <p>Правила турнира описаны на <a href='${link}' 
              target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>`
    }
  },
  block2: {
    selector: `.DescriptionTournament--container__3n`,
    browserFormatter: val => {
      return val[0].innerHTML
    }
  }
}
module.exports = new EpulzeBot({
  selectorToWaitOnPage,
  inputPages,
  linksParser,
  handlers,
  organisator: 'Weplay',
  botName: 'WeplayBot',
  debugMode: false // false
})

// module.exports.start(false)
