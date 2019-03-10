const express = require('express')
const router = express.Router()
const mongoose = require('../databaseInit')
const env = require('../../nuxt.config.js').env
const auth = require('../middleware/auth')
const { Bot } = require('../models/bots')

router.get('/all', auth, async (req, res) => {
  if (
    res.locals.user.privilege !== 'admin' &&
    res.locals.user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied.')

  let bots = await Bot.find({ active: true })

  if (!bots) return res.status(400).send('Bots are not found.')

  await Bot.updateMany({ active: true }, { lastUpdate: new Date() })

  let botFunction = []
  let count = 0

  for (let bot in bots) {
    // run, saving to the result array
    let result = await require(`../bots/${bots[bot].id}`)()
    if (result) count += result.count
  }

  console.log(`All bots have been run. ` + 'Added ' + count + ' tourneys.')
  res.send('Added ' + count + ' tourneys.')
})

router.get('/list', auth, async (req, res) => {
  if (
    res.locals.user.privilege !== 'admin' &&
    res.locals.user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied.')

  let game = req.body.game || null

  let bots = await Bot.find({ active: true }).catch(err =>
    res.status(400).send('Error occured')
  )

  if (!res.headersSent) res.send(bots)
})

router.post('/:bot', auth, async (req, res) => {
  if (
    res.locals.user.privilege !== 'admin' &&
    res.locals.user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied.')

  let game = req.body.game || null

  let bot = await Bot.findOneAndUpdate(
    { active: true, id: req.params.bot },
    { lastUpdate: new Date() }
  )

  if (!bot) return res.status(400).send('Bot is not found.')

  if (game && !bot.games.find(e => e == game))
    return res.status(400).send('No such game in this bot.')

  let botFunction = require(`../bots/${bot.id}`)
  let result = await botFunction({ game })
  // must save to database and return how many added
  console.log(`Bot has been run: ${bot.organisator} ${game}`)
  if (result.success) return res.send(String(result.count))

  return res.status(400)
})

module.exports = router
