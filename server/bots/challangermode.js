const dayjs = require('dayjs')
const Bot = require('./Bot')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

class ChallangermodeBot extends Bot {
  async start(headless = true) {
    try {
      await this.openBrowser(headless)
      await this.getLinks()
      await this.excludeExistingTourneys()
      await this.parseTourneysUsingLinks()
    } catch (e) {
      console.log(`Error on start(): ${e.message}`)
      this.report.message = 'Error occured'
    }
    this.browser.close()
    return this.report
  }

  async beforeSearchingLinkSelector(page) {
    const selector =
      '#content > div.dis--flx.flx--1-1-auto.flx-dir--col.pos--rel > div > div'
    await page.waitForSelector(selector)

    await page.waitFor(500)
    const elHandle = await page.$('#arena-wrap')
    const { height } = await elHandle.boundingBox()
    await elHandle.dispose()

    const viewportHeight = page.viewport().height
    let viewportIncr = 0
    await page.evaluate(sel => {
      document.querySelector(sel).scrollTo(0, 0)
    }, selector)

    while (viewportIncr + viewportHeight < height) {
      await page.evaluate(
        e => {
          document.querySelector(e.selector).scrollBy(0, e.viewportHeight / 2)
        },
        { viewportHeight, selector }
      )
      await page.waitFor(50)
      viewportIncr = viewportIncr + viewportHeight / 2
    }
  }

  async beforeParsingLinks(page) {
    const loadMore = async () => {
      await this.beforeSearchingLinkSelector(page)
      let btnSelector =
        '#arena-wrap .dis--flx.dis--blk--tablet.ali-ite--stretch.w--100 > .flx--1-1-auto.dis--blk.min-h--25rem.p-l--medium.p-l--none--tablet > .m-t--medium.ta--center > button > div > span'
      await page
        .waitForSelector(btnSelector, { timeout: 3000 })
        .then(async () => {
          let loadMoreBtn = await page.$(btnSelector)
          if (!loadMoreBtn) return

          await loadMoreBtn.click()
          // await page.waitFor(2000)
          await loadMore()
        })
        .catch(() => {})
    }
    await loadMore()
  }
}

let inputPages = [
  // {
  //   name: 'Dota 2',
  //   link: 'https://www.challengermode.com/dota2/tournaments'
  // },
  // {
  //   name: 'CS:GO',
  //   link: 'https://www.challengermode.com/csgo/tournaments'
  // },
  {
    name: 'PUBG',
    link: 'https://www.challengermode.com/pubg/tournaments'
  }
]

let linksParser = {
  linkSelector:
    '#arena-wrap .dis--flx.dis--blk--tablet.ali-ite--stretch.w--100 > div.flx--1-1-auto.dis--blk.min-h--25rem.p-l--medium.p-l--none--tablet .pos--rel > a',
  handler: async val => {
    let list = [...val]
    return list.map(link => {
      let subsOnly = link.innerText.match(/Subscribers Only/i)
      let inviteOnly = link.innerText.match(/Invite Only/i)
      let payToEnter = link.innerText.match(/pay-to-enter/i)
      let badge = link.parentElement.querySelector('.badge')

      let isOpen = badge && badge.innerText.match(/open/i)

      if (!subsOnly && isOpen && !inviteOnly && !payToEnter)
        return `https://www.challengermode.com${link.attributes.href.value}`
    })
  }
}

const formatSelector =
  '#arena-wrap .m-h--auto.max-w--95rem.max-w--90rem--full-hd.w--100.p-h--base.p-h--small--mobile .col-8--tablet .m-t--base.m-t--small--mobile .dis--inl-blk.m-r--base'
const dateSelector =
  '#arena-wrap > div > div.m-h--auto.max-w--95rem.max-w--90rem--full-hd.w--100.p-h--base.p-h--small--mobile .col-8--tablet .m-t--base.m-t--small--mobile .bor--bot.bor--gray.bor--2px.pos--rel.flx--0-0-auto > div.pos--abs.left--0.z--99'

let selectorToWaitOnPage = formatSelector

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
      '#arena-wrap .cm-text-shadow .m-b--medium.m-b--base--mobile .link-pure-white',
    browserFormatter: val => val[0].innerText
  },
  game: {
    selector: formatSelector,
    browserFormatter: val =>
      val[0]
        .querySelector('.dis--blk.lh--copy.ellipsis')
        .innerText.split(', ')[0]
  },
  teamMode: {
    selector: formatSelector,
    browserFormatter: val =>
      val[1].querySelector('.dis--blk.lh--copy.ellipsis').innerText
  },
  prize: {
    selector: formatSelector,
    browserFormatter: val => {
      let match = val[3]
        .querySelector('.dis--blk.lh--copy.ellipsis')
        .innerText.match(/(€\d+).*/i)
      return match && match[1]
    }
  },
  date: {
    selector: dateSelector,
    browserFormatter: val => val[0].innerText.replace('\n', ' '),
    serverFormatter: val => dayjs(val, 'HH:mm MMM D').$d
  },
  dateAdded: { serverFormatter: () => new Date() },
  // price: {},
  block1: {
    selector: formatSelector,
    browserFormatter: val => {
      let server = val[0]
        .querySelector('.dis--blk.lh--copy.ellipsis')
        .innerText.split(', ')[1]
      return { server }
    },
    serverFormatter(field, { teamMode, link }) {
      return `<p><strong>Регион:</strong> ${field.server}</p>
              <p><strong>Режим:</strong> ${teamMode}</p>
              <br>
              <p>Детали турнира и регистрация доступны на <a href='${link}' target='_blank' rel='noreferrer noopener'>сайте организатора</a>:</p>`
    }
  },
  block2: {
    serverFormatter: (field, { link }) => {
      return `<a href='${link}' target='_blank' rel='noreferrer noopener'>Подробнее о призовых на странице турнира</a>`
    }
  }
}
module.exports = new ChallangermodeBot({
  selectorToWaitOnPage,
  inputPages,
  linksParser,
  handlers,
  organisator: 'Challangermode',
  botName: 'ChallangermodeBot'
  // debugMode: true
})

// module.exports.start(false)
