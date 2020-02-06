const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const tourneys = require('./routes/tourneys')
const users = require('./routes/users')
const games = require('./routes/games')
const botsScheduler = require('./bots/botScheduler')
// const bots = require('./routes/bots')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(cookieParser())

app.use('/api/tourneys', tourneys)
app.use('/api/users', users)
app.use('/api/games', games)
// app.use('/api/bots', bots)

module.exports = app
