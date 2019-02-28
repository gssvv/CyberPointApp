const express = require('express')
const router = express.Router()
const mongoose = require('../databaseInit')
const { Game } = require('../models/games')

router.get('/', async (req, res) => {
  let games = await Game.find()
    .limit(10)
    .catch(err => res.status(400).send(err))

  if (games) res.send(games)
})

module.exports = router
