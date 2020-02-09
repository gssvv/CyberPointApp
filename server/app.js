const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const tourneys = require('./routes/tourneys')
const users = require('./routes/users')
const games = require('./routes/games')
const sitemap = require('./sitemap')
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
app.use('/', sitemap)

const redirect = async (req, res) => {
  let params = req.params
  if (!params.game) params.game = 'dota'

  res.redirect(`https://${req.headers.host}/${params.game}`)
}

app.get('/web', redirect)
app.get('/web/:index', redirect)
app.get('/web/:page/:index', redirect)
app.get('/web/:page/:index/:game', redirect)

// app.use('/api/bots', bots)

module.exports = app
