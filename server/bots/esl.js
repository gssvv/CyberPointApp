const { DateTime } = require('luxon')
const { Tourney } = require('../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async options => {
  async function loadTourneys(options = {}) {
    let gamesList = [
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
    if (options.game) {
      gamesList = [gamesList.find(i => i.game == options.game)]
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    })

    const page = await browser.newPage()
    console.log('Connected to the page')
    let linksList = []

    for (currentGame of gamesList) {
      if (!currentGame) continue
      console.log('Loading links for ' + currentGame.game + '...')

      let url = currentGame.link

      await page.goto(url, { timeout: 0 })
      await page.waitForSelector(
        '.panel-pane.pane-league-list .league-list.cups'
      )

      linksList.push(
        ...(await page.evaluate(async () => {
          let linksBlock = await document.querySelector(
            '.panel-pane.pane-league-list .league-list.cups'
          )
          if (!linksBlock) return []

          let links = await linksBlock.querySelectorAll('a')

          let linksList = []

          for (let link of links) {
            // chech if tourney hasn't begun
            let inProgress = !!link.querySelector(
              '.date[ng-if="ctrl.leagueIsInProgress(league)"]'
            )
            //check whether it is premium
            let title = link.attributes.title.value
            let premium = /premium/i.test(title)

            if (!inProgress && !premium)
              linksList.push(
                'https://play.eslgaming.com' + link.attributes[0].value
              )
          }

          return linksList
        }))
      )
    }

    if (linksList.length == 0) return console.log('0 links')

    // linksList.length = 10
    // REMOVE EXISTING
    let tourneysList = []

    // load existing
    let existingTourneys = await Tourney.find({
      organisator: 'ESL',
      date: { $gt: new Date() }
    })
      .select({ link: 1 })
      .limit(1000)
      .catch(err => console.log('Bot error:', err))

    // processing every page
    console.log('Processing each page...')
    for (link of linksList) {
      //remove repeated

      if (existingTourneys.filter(i => i.link == link)[0]) {
        console.log('Already exists: ' + link)
        continue
      }
      console.log('Parsing ' + link)

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

    await browser.close()

    return tourneysList
  }

  async function dataToTourneys(dataArray) {
    console.log('Preparing tourneys...')
    if (!dataArray || dataArray.length == 0) return { success: true, count: 0 }

    // last id
    let id = await Tourney.find()
      .select({ id: 1 })
      .sort({ id: -1 })
      .limit(1)
      .catch(err => console.log('Bot error:', err))
    id = id[0] ? id[0].id : 0

    let tourneysArray = []

    for (let tourneyData of dataArray) {
      let { link } = tourneyData

      // process date
      let date = tourneyData.date.match(/\d\d \w{3} \d{4} \d\d:\d\d/)[0]
      date = new Date(
        DateTime.fromFormat(date, 'dd MMM yyyy HH:mm', { zone: 0 }).ts
      )

      // fuigure out the game
      let game
      if (/hearthstone/i.test(link)) {
        game = 'Hearthstone'
      } else if (/playerunknownsbattlegrounds/i.test(link)) {
        game = 'PUBG'
      } else if (/dota2/i.test(link)) {
        game = 'Dota 2'
      } else if (/counterstrike/i.test(link)) {
        game = 'CS:GO'
      }

      let prize, prizeInfo
      if (tourneyData.prize)
        if (tourneyData.prize.length < 10 && /[0-9]/.test(tourneyData.prize)) {
          prize = tourneyData.prize
        } else {
          prizeInfo = tourneyData.prize
        }

      id += 1
      let teamMode = tourneyData.mode

      let block1 =
        '<p><strong>Регион:</strong> Europe</p>' +
        '<p><strong>Режим:</strong>  ' +
        teamMode +
        "</p><p>Правила турнира описаны на <a href='" +
        link +
        "/rules' target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>" +
        '<p><i>Имейте в виду, что многие турниры от ESL проводятся только среди жителей определенных стран или регионов (однако не все игроки стараются соблюдать это).</i></p>'

      tourneysArray.push({
        id: id,
        title: tourneyData.title,
        game: game,
        teamMode: teamMode,
        prize: prize || '',
        date: date,
        dateAdded: new Date(),
        link: link,
        block1: block1,
        block2: prizeInfo || '<i>Информация отсутствует</i>',
        organisator: 'ESL',
        addedby: 'ESLBot',
        status: 0
      })
    }

    let result = 0

    console.log('Loading to database')

    if (tourneysArray.length > 0)
      result = await Tourney.insertMany(tourneysArray).catch(err =>
        console.log('Bot error:', err)
      )

    if (result) return { success: true, count: tourneysArray.length }
    if (result === 0) return { success: true, count: 0 }

    return false
  }

  return await dataToTourneys(
    await loadTourneys(options).catch(err => {
      console.log('Error occured loading tourneys: ', err, 'Keep going...')
      return undefined
    })
  ).catch(err => {
    console.log('Error occured processing data: ', err, 'Keep going...')
    return { success: false, count: 0 }
  })
}
