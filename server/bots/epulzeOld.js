//https://cheerio.js.org/
const puppeteer = require('puppeteer')
const fs = require('fs')

async function getContent() {
  const browser = await puppeteer.launch({
    // defaultViewport: {
    //   width: 1280,
    //   height: 720
    // },
    headless: false
  })
  const page = await browser.newPage()
  console.log('Connecting to the page...')
  await page.goto('https://epulze.com/dota2/tournaments', { timeout: 0 })

  let tournamentsList = []

  for (let i = 0; i < 2; i++) {
    console.log('Scanning page ', i + 1)
    tournamentsList.push(
      ...(await page.evaluate(() => {
        // coverts '0d 0h 0m 0s' to date format:
        function getDateFromTimeLeft(timeLeft) {
          let now = new Date(),
            then = new Date()

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
            then.getMonth() < 10
              ? '0' + (then.getMonth() + 1)
              : then.getMonth() + 1
          let dd = then.getDate() < 9 ? '0' + then.getDate() : then.getDate()
          let hh =
            then.getHours() < 10 ? '0' + then.getHours() : then.getHours()
          let min =
            then.getMinutes() < 10 ? '0' + then.getMinutes() : then.getMinutes()
          let ss =
            then.getSeconds() < 10 ? '0' + then.getSeconds() : then.getSeconds()

          let result =
            yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss

          return result
        }

        let tourneys = []
        let tourneysCode = document.querySelectorAll(
          '.content .tournament-item'
        )

        for (let tourCode of tourneysCode) {
          let date = tourCode.querySelector(
            '.tablet-text-left.text-right .text-white span'
          )
          // check if the tourney has already begun:
          if (date == null) continue

          let title = tourCode.querySelector('.tournament-item-content h2')
            .innerHTML
          // check if these tourneys are those that should be published:
          if (
            !(
              title.includes('Dota 2 1v1 #') ||
              title.includes('Dota 2 5v5 #') ||
              title.includes('Dota 2 1v1 - Fight Night #') ||
              title.includes('Dota 2 5v5 - Fight Night #')
            )
          )
            continue
          // covert '0d 0h 0m 0s' to date format:
          date = getDateFromTimeLeft(date.innerHTML)
          let link =
            'https://epulze.com/ru' +
            tourCode.querySelector('a').attributes[0].value
          let server = tourCode.querySelector(
            '.grid-2.tablet-hidden .text-white'
          ).innerHTML
          let mode = tourCode.querySelector(
            '.grid-2.tablet-grid-6 .text-white:not(.truncate)'
          ).innerHTML
          let prize = tourCode.querySelector(
            '.grid-2.tablet-grid-6 .text-white.truncate'
          ).innerHTML

          tourneys.push({
            title,
            type: 'virtual',
            text:
              'Epulze бросает вызов традиционной идее ставок. Вместо того, чтоб ставить на профессиональных игроков - ты можешь ставить на себя. Никаких сложностей, просто твой скилл против скилла оппонента. Игра та же, азарт больше!',
            add_info:
              `<p><strong>Режим: </strong><span class="redactor-invisible-space">${mode} bo1</span></p>` +
              `<p><strong>Сервер: </strong>${server}</p>` +
              `<p>Турнир с бесплатным входом, Single Elimination, до одной победы.</p>` +
              `<p>Для старта турнира необходимо, чтоб было заполнена половина слотов, иначе турнир может быть отменен.</p>` +
              `<p><span class="redactor-invisible-space">Подробности и правила турнира можно найти <a href="${link}" target="_blank" rel="noreferrer noopener">на сайте организатора</a>.</span></p>`,
            date_event: date,
            date_last_day_event: date,
            date_last_day_reg: date,
            date_added: new Date(),
            prize_pool: prize,
            reg_link: link,
            organisator: 'Epulze',
            socials: 'https://vk.com/epulzegaming',
            discipline: 'Dota 2',
            team_status: 1,
            image: 'uploaded-files/tourneys/main-id193.jpg',
            rights: 'epulzeBot'
          })
        }

        return tourneys
      }))
    )

    if (
      (await page.$$eval('.pagination li', selected => {
        if (selected[selected.length - 2])
          return selected[selected.length - 2].classList.contains('disabled')
        return false
      })) ||
      i == 20
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

getContent()
  .then(answer => {
    let file =
      'INSERT INTO `u27151_cybpoint`.`tourneys` (`id`, `title`, `type`, `town`, `text`, `add_info`, `date_event`, `date_last_day_event`, `date_last_day_reg`, `date_added`, `compete_cost`, `prise_pool`, `prise_info`, `reg_link`, `organisator`, `socials`, `discipline`, `team_status`, `image`, `twitch_username`, `status`, `rights`) VALUES '
    let lastId = 3527
    for (tour of answer) {
      lastId++
      file += `(${lastId}, '${tour.title}', '${tour.type}', '', '${
        tour.text
      }', '${tour.add_info}', '${tour.date_event}', '${
        tour.date_last_day_event
      }', '${tour.date_last_day_reg}', (CURRENT_TIME()), '', '${
        tour.prize_pool
      }', '', '${tour.reg_link}', '${tour.organisator}', '${tour.socials}', '${
        tour.discipline
      }', ${tour.team_status}, '${tour.image}', '', 0, '${tour.rights}'), `
    }
    let fileName = 'query.sql'
    fs.writeFileSync(__dirname + '/' + fileName, file)
    console.log('File saved as ' + fileName)
  })
  .catch(err => {
    console.log(err)
  })
