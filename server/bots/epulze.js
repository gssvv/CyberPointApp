const { Tourney } = require('../models/tourneys')
const puppeteer = require('puppeteer')
const fs = require('fs')

module.exports = async options => {
  async function loadTourneys(options) {
    // because one less
    const maxPages = 20 - 1
    const url = 'https://epulze.com/dota2/tournaments'

    const browser = await puppeteer.launch({
      // headless: false
    })

    const page = await browser.newPage()
    console.log('Connected to the page.')

    await page.goto(url, { timeout: 0 })

    let tournamentsList = []

    for (let i = 0; i <= maxPages; i++) {
      console.log('Scanning page', i + 1)
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
                '.small-box.float-right.text-white span'
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
                date = date.innerHTML
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
      await page.waitFor(1000)
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

    if (timeLeft[3]) then.setDate(now.getDate() + timeLeft[3] * 1)
    if (timeLeft[2]) then.setHours(now.getHours() + timeLeft[2] * 1)
    if (timeLeft[1]) then.setMinutes(now.getMinutes() + timeLeft[1] * 1)
    if (timeLeft[0]) then.setSeconds(now.getSeconds() + timeLeft[0] * 1)
    // correct date (sometimes returns 59s instead of 00)
    if (then.getSeconds() == 59) then.setSeconds(then.getSeconds() + 1)

    let yyyy = then.getFullYear()
    let mm =
      then.getMonth() < 10 ? '0' + (then.getMonth() + 1) : then.getMonth() + 1
    let dd = then.getDate() < 9 ? '0' + then.getDate() : then.getDate()
    let hh = then.getHours() < 10 ? '0' + then.getHours() : then.getHours()
    let min =
      then.getMinutes() < 10 ? '0' + then.getMinutes() : then.getMinutes()
    let ss =
      then.getSeconds() < 10 ? '0' + then.getSeconds() : then.getSeconds()

    let result = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss

    return result
  }

  async function dataToTourneys(dataArray) {
    // remove existing tourneys by link
    let existingTourneys = await Tourney.find({
      organisator: 'Epulze',
      date: { $gt: new Date() },
      game: 'Dota 2'
    })
      .select({ link: 1 })
      .limit(150)
      .catch(err => console.log('Bot error:', err))

    // last id
    let id = await Tourney.find()
      .select({ id: 1 })
      .sort({ id: -1 })
      .limit(1)
      .catch(err => console.log('Bot error:', err))
    id = id[0].id

    let tourneysArray = []

    for (let tourneyData of dataArray) {
      let link = `https://epulze.com/ru${tourneyData.link}`

      // remove repeated
      if (existingTourneys.filter(i => i.link == link)[0]) continue

      id += 1
      let teamMode = /\b\dv\d\b/i.exec(tourneyData.title)[0]
      let matchMode = teamMode
        ? tourneyData.mode.replace(/\b\dv\d\b/i, '').trim()
        : tourneyData.mode
      let players = teamMode[0]
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
        date: new Date(timeLeftToDate(tourneyData.date)),
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
