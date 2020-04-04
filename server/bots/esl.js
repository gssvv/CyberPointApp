const dayjs = require('dayjs')
const Bot = require('./Bot')

class ESLBot extends Bot {}

let inputPages = [
  {
    name: 'Dota 2',
    link: 'https://play.eslgaming.com/dota2/europe/tournaments'
  },
  {
    name: 'CS:GO',
    link: 'https://play.eslgaming.com/counterstrike/csgo/tournaments'
  },
  {
    name: 'PUBG',
    link: 'https://play.eslgaming.com/playerunknownsbattlegrounds/europe'
  },
  {
    name: 'Hearthstone',
    link: 'https://play.eslgaming.com/hearthstone/europe/tournaments'
  }
]

let selectorToWaitOnPage = 'league-information .c-league-information__wrapper'

let linksParser = {
  linkSelector: '.panel-pane.pane-league-list .league-list.cups a',
  handler: async val => {
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
    browserFormatter: val => val[0].innerText.split(', ').splice(1).join(' '),
    serverFormatter(field) {
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

module.exports = new ESLBot({
  selectorToWaitOnPage,
  inputPages,
  linksParser,
  handlers,
  organisator: 'ESL',
  botName: 'ESLBot',
  // debug: true,
})

// module.exports.start(false)