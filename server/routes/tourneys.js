const auth = require('../middleware/auth')
const { Tourney, validate } = require('../models/tourneys')
const { User } = require('../models/users')
const express = require('express')
const router = express.Router()
const _ = require('lodash')

router.post('/list', async (req, res) => {
  // recieves game and offset
  if (!req.body.game) return res.status(400).send('Game was not privided.')

  let params = {}

  if (req.body.params) {
    if (req.body.params.free) {
      // free
      params.price = ''
    }
    if (req.body.params.organisator) {
      // organisator
      if (req.body.params.organisator.not) {
        params.organisator = {
          $ne: req.body.params.organisator.title
        }
      } else {
        params.organisator = req.body.params.organisator
      }
    }
    params.$or = []
    params.$and = []
    if (req.body.params.v1) {
      params.$or.push({ teamMode: '1v1' })
    }
    if (req.body.params.v5) {
      if (req.body.params.v5) {
        params.$or.push({ teamMode: '5v5' })
      } else {
        params.$and.push({ teamMode: '5v5' })
      }
    }
    if (req.body.params.fpp) {
      params.$or.push({ teamMode: new RegExp('(.*)?' + 'fpp' + '(.*)?', 'i') })
    }
    if (req.body.params.tpp) {
      if (req.body.params.fpp) {
        params.$or.push({
          teamMode: new RegExp('(.*)?' + 'tpp' + '(.*)?', 'i')
        })
      } else {
        params.$and.push({
          teamMode: new RegExp('(.*)?' + 'tpp' + '(.*)?', 'i')
        })
      }
    }
    if (req.body.params.solo) {
      params.$or.push({
        teamMode: new RegExp('(.*)?' + 'solo' + '(.*)?', 'i')
      })
    }
    if (req.body.params.duo) {
      if (req.body.params.solo) {
        params.$or.push({
          teamMode: new RegExp('(.*)?' + 'duo' + '(.*)?', 'i')
        })
      } else {
        params.$and.push({
          teamMode: new RegExp('(.*)?' + 'duo' + '(.*)?', 'i')
        })
      }
    }
    if (req.body.params.squad) {
      if (req.body.params.solo || req.body.params.duo) {
        params.$or.push({
          teamMode: new RegExp('(.*)?' + 'squad' + '(.*)?', 'i')
        })
      } else {
        params.$and.push({
          teamMode: new RegExp('(.*)?' + 'squad' + '(.*)?', 'i')
        })
      }
    }

    if (params.$or.length == 0) delete params.$or
    if (params.$and.length == 0) delete params.$and
  }

  let offset = req.body.offset || 0

  let tourneys = await Tourney.find({
    status: 1,
    // date: { $gt: new Date() },
    game: req.body.game,
    ...params
  })
    .sort({ date: 1 })
    .select({
      id: 1,
      title: 1,
      game: 1,
      matchMode: 1,
      teamMode: 1,
      players: 1,
      prize: 1,
      date: 1,
      price: 1,
      link: 1,
      organisator: 1
    })
    .skip(offset)
    .limit(6)

  res.send(tourneys)
})

router.post('/admin-list', auth, async (req, res) => {
  let { user } = res.locals

  if (
    user.privilege !== 'admin' &&
    user.privilege !== 'organisator' &&
    user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied.')

  let conditions = {
    id: req.body.id || { $ne: 0 }
  }

  if (user.privilege == 'organisator') {
    conditions.$or = [
      { addedby: user.username },
      { organisator: user.username }
    ]
  }

  let offset = req.body.offset || 0
  // when loads via scrolling
  let limit = req.body.offset ? 10 : 25
  // when the full tourney is needed
  let select = !req.body.full
    ? {
        id: 1,
        status: 1,
        title: 1,
        addedby: 1,
        organisator: 1,
        views: 1,
        followings: 1,
        date: 1,
        dateAdded: 1
      }
    : {}

  let tourneys = await Tourney.find(conditions)
    .sort({ dateAdded: -1 })
    .select(select)
    .skip(offset)
    .limit(limit)

  res.send(tourneys)
})

router.get('/:id', async (req, res) => {
  if (!req.params.id) return res.status(400).send('Id was not privided.')

  let tourneys = await Tourney.findOne({
    status: 1,
    id: req.params.id
  })
    .sort({ date: 1 })
    .select({
      id: 1,
      title: 1,
      game: 1,
      matchMode: 1,
      teamMode: 1,
      players: 1,
      prize: 1,
      date: 1,
      price: 1,
      link: 1,
      organisator: 1,
      block1: 1,
      block2: 1,
      applications: 1
    })
    .catch(err => res.status(400).send(err.message))

  if (!tourneys) return res.status(404).send('Tourney not found.')

  // if (!tourneys) return res.send([])

  res.send(tourneys)
})

router.post('/add', auth, async (req, res) => {
  let user = res.locals.user
  req.body.status = parseInt(req.body.status)

  if (
    user.privilege !== 'admin' &&
    user.privilege !== 'organisator' &&
    user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied: no permisson.')

  if (
    req.body.status == 1 &&
    user.privilege !== 'admin' &&
    user.privilege !== 'moderator'
  )
    return res
      .status(400)
      .send('Access denied: no privilege to set status to 1.')

  // set ADDEDBY to current user
  req.body.addedby = user.username

  // get and set ID
  let { id } = await Tourney.findOne()
    .sort({ id: -1 })
    .select({ id: 1 })

  req.body.id = id + 1

  // Validate tourney
  // req.body includes only tourney data
  let { error } = validate(req.body)

  if (error) return res.status(404).send(error.details[0].message)

  // insert to database
  let result = await Tourney.create(req.body).catch(err => console.log(err))
  if (!result) return res.status(400).send('Error occured')

  res.status(200).send({ id: result.id })
})

router.post('/edit', auth, async (req, res) => {
  if (!req.body.id) return res.status(400).send('Id was not provided.')
  let user = await res.locals.user
  req.body.status = parseInt(req.body.status)
  // pick only editable fields
  let newTourney = _.pick(req.body, [
    'id',
    'title',
    'game',
    'matchMode',
    'teamMode',
    'players',
    'prize',
    'price',
    'date',
    'link',
    'block1',
    'block2',
    'organisator',
    'history',
    'applications',
    'status'
  ])

  if (
    user.privilege !== 'admin' &&
    user.privilege !== 'organisator' &&
    user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied: no permisson.')

  if (
    newTourney.status == 1 &&
    user.privilege !== 'admin' &&
    user.privilege !== 'moderator'
  )
    return res
      .status(400)
      .send('Access denied: no privilege to set status to 1.')

  // get and set ID
  let tourney = await Tourney.findOne({ id: newTourney.id })
  if (!tourney) return res.status(400).send('Tourney is not found.')
  // get content
  tourney = tourney._doc

  // if tounrey is published by another organisator
  if (
    user.privilege !== 'admin' &&
    user.privilege !== 'moderator' &&
    tourney.addedby !== user.username &&
    tourney.organisator !== user.username
  )
    return res
      .status(400)
      .send('Access denied: no permisson. This tourney is not yours.')

  // note in history
  tourney.history.push({
    date: new Date(),
    user: _.pick(res.locals.user, ['username', 'privilege', 'email']),
    type: 'Edit',
    fields: _.keys(newTourney)
  })

  // assign old and new data
  newTourney = Object.assign(tourney, newTourney)
  // remove for validation
  delete newTourney._id
  delete newTourney.__v

  // validation
  let { error } = validate(newTourney)
  if (error) return res.status(404).send(error.details[0].message)

  // insert
  let result = await Tourney.updateOne({ id: newTourney.id }, newTourney).catch(
    err => res.status(400).send(err.message)
  )

  if (result.ok) res.send('Tourney has been successfully updated.')
})

router.post('/delete', auth, async (req, res) => {
  if (!req.body.id) return res.status(400).send('Id was not provided.')

  let user = await res.locals.user
  // pick only editable fields

  if (
    user.privilege !== 'admin' &&
    user.privilege !== 'organisator' &&
    user.privilege !== 'moderator'
  )
    return res.status(400).send('Access denied: no permisson.')

  // get and set ID
  let tourney = await Tourney.findOne(
    { id: req.body.id },
    {
      organisator: 1,
      addedby: 1
    }
  )
  if (!tourney) return res.status(400).send('Tourney is not found.')

  tourney = tourney._doc

  // if tounrey is published by another organisator
  if (
    user.privilege == 'organisator' &&
    tourney.addedby !== user.username &&
    tourney.organisator !== user.username
  )
    return res
      .status(400)
      .send('Access denied: no permisson. This tourney is not yours.')

  // insert
  let result = await Tourney.deleteOne({ id: req.body.id }).catch(err =>
    res.status(400).send(err.message)
  )

  if (result) res.send('Tourney has been successfully deleted.')
})

router.post('/set-status', auth, async (req, res) => {
  let user = await res.locals.user
  // if only particular author or bot
  let addedby = req.body.addedby || { $ne: '' }
  let organisator = req.body.organisator || { $ne: '' }
  let game = req.body.game || { $ne: '' }
  let status = req.body.status === undefined ? 1 : req.body.status

  if (user.privilege !== 'admin' && user.privilege !== 'moderator')
    return res.status(400).send('Access denied: no permisson.')

  // get and set ID
  let tourney = await Tourney.updateMany(
    { status: !status, addedby, game, organisator },
    {
      status: status
    }
  ).catch(err => res.status(400).send(err.message))

  if (!tourney._headerSent)
    return res.send(tourney.n + ' tourneys have been updated.')
})

module.exports = router
