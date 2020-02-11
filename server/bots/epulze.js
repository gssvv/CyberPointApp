const dayjs = require('dayjs')
const Bot = require('./Bot')

class EpulzeBot extends Bot {
  async getInputPages() {
    const page = await this.browser.newPage()
    await page.goto(this.inputPages[0].link)
    await page.waitForSelector('.main-container ul li.pagination-last')
    await page.click('.main-container ul li.pagination-last')
    let match = page.url().match(/page=(\d*)/)
    let totalPages = Number(match && match[1])

    if (totalPages || totalPages < 2)
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        let pageId = pageNum + 1
        this.inputPages.push({
          name: `Dota 2 – ${pageId}`,
          link: `https://epulze.com/dota2/tournaments?page=${pageId}`
        })
      }

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

  async beforeParsingLinks(page) {
    const bodyHandle = await page.$('body')
    const { height } = await bodyHandle.boundingBox()
    await bodyHandle.dispose()

    const viewportHeight = page.viewport().height
    let viewportIncr = 0
    while (viewportIncr + viewportHeight < height) {
      await page.evaluate(_viewportHeight => {
        window.scrollBy(0, _viewportHeight)
      }, viewportHeight)
      await page.waitFor(50)
      viewportIncr = viewportIncr + viewportHeight
    }
  }
}

let inputPages = [
  {
    name: 'Dota 2 – 1',
    link: 'https://epulze.com/dota2/tournaments'
  }
]

let linksParser = {
  linkSelector: '.main-container .tournament-item > a',
  handler: async val => {
    let list = [...val]
    return list.map(link => {
      let status = link.querySelector('.tournament-item-image .small-box')
      let isOpen = status.innerText == 'OPEN'

      if (isOpen) return `https://epulze.com${link.attributes.href.value}`
    })
  }
}

let selectorToWaitOnPage = '.page-top-center h1'

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
    selector: '.page-top-center h1',
    browserFormatter: val => val[0].innerText
  },
  game: {
    serverFormatter: () => 'Dota 2'
  },
  teamMode: {
    selector: `.tournament-info .tournament-label`,
    browserFormatter: val => {
      let teamMode
      val.forEach(el => {
        if (el.innerText == 'MODE') teamMode = el.nextSibling.innerText
      })
      return teamMode
    }
  },
  prize: {
    selector: '.content-item.data-table .vertical-align.text-white',
    browserFormatter: val => {
      let prize
      val.forEach(el => {
        if (el.innerText == 'Prize pool') prize = el.nextSibling.innerText
      })

      return prize
    }
  },
  date: {
    selector: `.tournament-info .tournament-label`,
    browserFormatter: val => {
      let date
      val.forEach(el => {
        if (el.innerText == 'STARTS AT') date = el.nextSibling.innerText
      })
      return date
    },
    serverFormatter(field) {
      return dayjs(field).$d
    }
  },
  dateAdded: { serverFormatter: () => new Date() },
  price: {
    selector: `.tournament-info .tournament-label`,
    browserFormatter: val => {
      let price
      val.forEach(el => {
        if (el.innerText == 'ENTRY FEE') {
          let fee = el.nextSibling.innerText
          let amount = fee.match(/(\d*)/)
          price = amount[1] ? '$' + amount[1] : null
        }
      })
      return price
    }
  },
  block1: {
    selector: `.tournament-info .tournament-label`,
    browserFormatter: val => {
      let server = 'не указано'
      val.forEach(el => {
        if (el.innerText == 'SERVER') server = el.nextSibling.innerText
      })
      return { server }
    },
    serverFormatter(field, { teamMode, link, price }) {
      return `<p><strong>Регион:</strong> ${field.server}</p>
              <p><strong>Режим:</strong> ${teamMode}</p>
              <p><strong>Стоимость участия:</strong> ${price || 'бесплатно'}</p>
              <p>Правила турнира описаны на <a href='${link}/rules' 
              target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>`
    }
  },
  block2: {
    serverFormatter: (field, tourney) =>
      tourney.prize
        ? `Призовой фонд: ${tourney.prize}`
        : '<i>Информация отсутствует</i>'
  }
}
module.exports = new EpulzeBot({
  selectorToWaitOnPage,
  inputPages,
  linksParser,
  handlers,
  organisator: 'Epulze',
  botName: 'EpulzeBot'
})
