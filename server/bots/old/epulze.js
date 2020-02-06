const { Tourney } = require('../../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async options => {
  async function loadTourneys(options) {
    // because one less
    const maxPages = 40 - 1
    const url = 'https://epulze.com/dota2/tournaments'

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    })

    const page = await browser.newPage()
    console.log('Connected to the page.')

    await page.goto(url, { timeout: 0 })

    let tournamentsList = []

    for (let i = 0; i <= maxPages; i++) {
      console.log('Scanning page', i + 1)
      await page.waitForSelector('.content .tournament-item')
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
            // coverts '0d 0h 0m 0s' to date format:
            let tourneys = []
            let tourneysCode = await document.querySelectorAll(
              '.content .tournament-item'
            )

            for (let tourCode of tourneysCode) {
              let title = await tourCode.querySelector(
                '.tournament-item-headline .truncate'
              ).innerHTML

              let link = await tourCode.querySelector('a').attributes[0].value

              let date = await tourCode.querySelector(
                '.tournament-item-headline span'
              )

              let mode = await tourCode.querySelectorAll(
                '.tournament-item-content .text-white'
              )[4].innerHTML

              let server = await tourCode.querySelectorAll(
                '.tournament-item-content .text-white'
              )[5].innerHTML

              let prize = await tourCode.querySelectorAll(
                '.tournament-item-content .text-white'
              )[1].innerHTML

              let price = await tourCode.querySelectorAll(
                '.tournament-item-content .text-white'
              )[2].innerHTML

              if (date) {
                date.removeChild(date.querySelector('span'))
                date = date.innerText
              } else {
                continue
              }

              tourneys.push({
                title,
                link,
                date,
                mode,
                server,
                prize,
                price
              })
            }

            return tourneys
          })
          .catch(err => console.log(err)))
      )

      // console.log(tournamentsList, i)

      if (
        i == maxPages ||
        (await page.$$eval('.pagination li', selected => {
          if (selected[selected.length - 2])
            return selected[selected.length - 2].classList.contains('disabled')
          return false
        }))
      ) {
        break // if this is the last page
      }

      let length = await page.$$eval('.pagination li', async selected => {
        return selected.length
      })

      console.log('Loading next page...')
      await page.click('.pagination li:nth-child(' + (length - 1) + ')')
    }

    await browser.close()
    return tournamentsList
  }

  function timeLeftToDate(timeLeft) {
    let now = new Date()
    let then = new Date()

    timeLeft = timeLeft.split(' ').reverse()

    timeLeft.forEach((item, index) => {
      timeLeft[index] = item.slice(0, -1)
    })

    if (timeLeft[2]) then.setDate(now.getDate() + timeLeft[2] * 1)
    if (timeLeft[1]) then.setHours(now.getHours() + timeLeft[1] * 1)
    if (timeLeft[0]) then.setMinutes(now.getMinutes() + timeLeft[0] * 1)
    // if (timeLeft[0]) then.setSeconds(now.getSeconds() + timeLeft[0] * 1)
    // correct date (sometimes returns 59s instead of 00)
    if ([14, 29, 44, 59].includes(then.getMinutes()))
      then.setMinutes(then.getMinutes() + 1)

    let yyyy = then.getFullYear()
    let mm =
      then.getMonth() < 10 ? '0' + (then.getMonth() + 1) : then.getMonth() + 1
    let dd = then.getDate() < 9 ? '0' + then.getDate() : then.getDate()
    let hh = then.getHours() < 10 ? '0' + then.getHours() : then.getHours()
    let min =
      then.getMinutes() < 10 ? '0' + then.getMinutes() : then.getMinutes()
    // let ss =
    //   then.getSeconds() < 10 ? '0' + then.getSeconds() : then.getSeconds()

    let result = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00' //ss

    return result
  }

  async function dataToTourneys(dataArray) {
    console.log('Preparing tourneys...')
    if (dataArray.length == 0) return { success: true, count: 0 }
    // remove existing tourneys by link
    let existingTourneys = await Tourney.find({
      organisator: 'Epulze',
      date: { $gt: new Date() },
      game: 'Dota 2'
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
      let link = `https://epulze.com/ru${tourneyData.link}`

      // remove repeated
      if (existingTourneys.filter(i => i.link == link)[0]) continue

      let date = new Date(timeLeftToDate(tourneyData.date))
      date = date - date.getTimezoneOffset() * 60 * 1000
      if (date < new Date()) continue

      id += 1

      let modeFromTitle = /\b\dv\d\b/i.exec(tourneyData.title)
      let teamMode = modeFromTitle ? modeFromTitle[0] : ''
      let matchMode = teamMode
        ? tourneyData.mode.replace(/\b\dv\d\b/i, '').trim()
        : tourneyData.mode
      let players = teamMode ? teamMode[0] : 0
      let block1 =
        '<p><strong>Сервер:</strong> Europe</p><p><strong>Режим:</strong> ' +
        matchMode +
        ' ' +
        teamMode +
        "</p><p>Правила турнира описаны на <a href='" +
        link +
        "/rules' target='_blank' rel='noreferrer noopener'>сайте организатора</a></p>"

      let block2 = tourneyData.prize
        ? tourneyData.prize + ' стороне-победителю'
        : null

      let prize =
        tourneyData.prize.length < 10 && /[0-9]/.test ? tourneyData.prize : null

      tourneysArray.push({
        id: id,
        title: tourneyData.title,
        game: 'Dota 2',
        matchMode: matchMode,
        teamMode: teamMode,
        players: players,
        prize: prize,
        date: date,
        dateAdded: new Date(),
        link: link,
        block1: block1,
        block2: block2 || '<i>Информация отсутствует</i>',
        organisator: 'Epulze',
        addedby: 'EpulzeBot',
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
