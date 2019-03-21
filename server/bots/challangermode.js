const { DateTime } = require('luxon')
const { Tourney } = require('../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async options => {
  async function loadTourneys(options) {
    // because one less
    const url = 'https://www.challengermode.com/Pubg/Tournaments'

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    })

    const page = await browser.newPage()
    console.log('Connected to the page.')

    await page.goto(url, { timeout: 0 })

    let tournamentsList = []

    await page.waitForSelector('cm-tournament-list-element > div > div > a')
    // get height
    const bodyHandle = await page.$('body')
    const { height } = await bodyHandle.boundingBox()
    await bodyHandle.dispose()

    // Scroll one viewport at a time, pausing to let content load
    const viewportHeight = page.viewport().height
    let viewportIncr = 0
    while (viewportIncr + viewportHeight < height) {
      await page.evaluate(_viewportHeight => {
        window.scrollBy(0, _viewportHeight)
      }, viewportHeight)
      await page.waitFor(50)
      viewportIncr = viewportIncr + viewportHeight
    }

    await tournamentsList.push(
      ...(await page
        .evaluate(async () => {
          let tourneys = []
          // remove tourneys that are already started
          let now = await document.querySelector(
            'cm-arena-section[heading="Now"]'
          )
          if (now)
            now.parentElement.removeChild(
              document.querySelector('cm-arena-section[heading="Now"]')
            )

          let tourneysCode = await document.querySelectorAll(
            'cm-tournament-list-element > div > .dis--flx.dis--blk--sm'
          )

          for (let tourCode of tourneysCode) {
            let title = await tourCode.querySelector(
              '.dis--flx.ali-ite--center .flx--1-1-auto .dis--flx .ali-ite--center.flx-gutter--minimum .flx--1-1-auto.ellipsis'
            ).innerText

            let link = await tourCode.querySelector('a').attributes[0].value

            let time = await tourCode.querySelector(
              '.dis--flx.ali-ite--center .flx--1-1-auto .ellipsis.c--white-dark.f--medium.lh--copy span span span'
            ).innerText
            time = time.match(/\d{1,2}:\d{1,2}/)[0]

            let date = await tourCode.querySelector(
              '.dis--flx.ali-ite--center .flx--0-0-auto.ta--center.m-r--small.p-r--small.bor--r.bor--gray.bor--none--sm'
            ).innerText
            date = date.replace(/\r?\n/g, ' ').toLowerCase()

            let mode = await tourCode
              .querySelectorAll(
                '.bor--top--sm.bor--gray.m-t--small--sm.p-t--small--sm .flx--1-1'
              )[1]
              .querySelectorAll('.ellipsis')[1].innerText

            let server = await tourCode
              .querySelectorAll(
                '.bor--top--sm.bor--gray.m-t--small--sm.p-t--small--sm .flx--1-1'
              )[0]
              .querySelectorAll('.ellipsis')[1].innerText

            let prize = await tourCode
              .querySelectorAll(
                '.bor--top--sm.bor--gray.m-t--small--sm.p-t--small--sm .flx--1-1'
              )[2]
              .querySelectorAll('.ellipsis')[1].innerText

            tourneys.push({
              title,
              link,
              date: date + ' ' + time,
              mode,
              server,
              prize
            })
          }

          return tourneys
        })
        .catch(err => console.log(err)))
    )

    // console.log(tournamentsList)

    await browser.close()
    return tournamentsList
  }

  async function dataToTourneys(dataArray) {
    console.log('Preparing tourneys...')
    if (dataArray.length == 0) return { success: true, count: 0 }
    // remove existing tourneys by link
    let existingTourneys = await Tourney.find({
      organisator: 'ChallangerMode',
      date: { $gt: new Date() },
      game: 'PUBG'
    })
      .select({ link: 1 })
      .limit(1000)
      .catch(err => console.log('Bot error:', err))

    // last id
    let id = await Tourney.find()
      .select({ id: 1 })
      .sort({ id: -1 })
      .limit(1)
      .catch(err => console.log('Bot error:', err))
    id = id[0] ? id[0].id : 0

    let tourneysArray = []

    for (let tourneyData of dataArray) {
      let link = `https://www.challengermode.com${tourneyData.link}`

      // remove repeated
      if (existingTourneys.filter(i => i.link == link)[0]) continue

      let date = new Date(
        DateTime.fromFormat(tourneyData.date, 'MMM dd HH:mm', { zone: 0 }).ts
      )

      id += 1

      let teamMode = ''
      switch (tourneyData.mode[0] * 1) {
        case 1:
          teamMode = 'SOLO'
          break
        case 2:
          teamMode = 'DUO'
          break
        case 4:
          teamMode = 'SQUAD'
          break
      }

      let players = tourneyData.mode ? tourneyData.mode[0] : 0
      let block1 =
        '<p><strong>Регион:</strong> ' +
        tourneyData.server +
        '</p><p><strong>Режим:</strong> ' +
        teamMode +
        "</p><p>Подробная информация о турнире доступна на <a href='" +
        link +
        "' target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>"

      let block2 = tourneyData.prize
        ? tourneyData.prize + ' стороне-победителю'
        : '<i>Информация отсутствует</i>'

      tourneysArray.push({
        id: id,
        title: tourneyData.title,
        game: 'PUBG',
        teamMode: teamMode,
        players: players,
        prize: tourneyData.prize,
        date: date,
        dateAdded: new Date(),
        link: link,
        block1: block1,
        block2: block2,
        organisator: 'ChallangerMode',
        addedby: 'ChallangerModeBot',
        status: 0
      })
    }

    let result = 0

    if (tourneysArray.length > 0)
      result = await Tourney.insertMany(tourneysArray).catch(err =>
        console.log('Bot error:', err)
      )

    if (result) return { success: true, count: tourneysArray.length }
    if (result === 0) return { success: true, count: 0 }

    return false
  }

  return await dataToTourneys(await loadTourneys(options))
}
module.exports()
