const express = require('express')
const router = express.Router()
const mongoose = require('../databaseInit')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validateFull, validateBase } = require('../models/users')
const env = require('../../nuxt.config.js').env
const auth = require('../middleware/auth')

// SIGN IN
router.post('/auth', async (req, res) => {
  if (req.cookies.auth_token) {
    let decoded
    try {
      decoded = await jwt.verify(req.cookies.auth_token, env.jwtPrivateKey)
    } catch (err) {
      decoded = false
    }
    if (decoded) return res.status(300).send('You are already logged in')
  }

  // validation
  let { error } = validateBase(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  // check if the user exists
  let user = await User.findOne({ username: req.body.username, active: true })
  if (!user)
    return res
      .status(401)
      .send('User with such username and password is not found or disabled.')

  // password verification
  let verifyPassword = await bcrypt.compare(req.body.password, user.password)
  if (!verifyPassword)
    return res
      .status(401)
      .send('User with such username and password is not found or disabled.')

  res.cookie('auth_token', user.generateAuthToken(), {
    maxAge: 1000 * 60 * 60 * 24 * 1
  })

  res.status(200).send('User was successfully authorized.')
})

router.get('/me', auth, async (req, res) => {
  res.send(_.pick(res.locals.user, ['username', 'email', 'privilege', '_id']))
})

router.get('/list', auth, async (req, res) => {
  if (res.locals.user.privilege !== 'admin')
    return res.status(400).send('Access denied.')

  let list = await User.find({ privilege: { $ne: 'admin' } })
    .select({ _id: 1, username: 1 })
    .catch(err => res.status(400).send(err))

  if (!list) return res.status(400)

  res.send(list)
})

router.post('/register', auth, async (req, res) => {
  if (res.locals.user.privilege !== 'admin')
    return res.status(400).send('Access denied.')

  req.body.status = parseInt(req.body.status)

  const { error } = validateFull(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  let { username, password, privilege, email } = req.body

  let user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  })
  if (user) return res.status(400).send('User is already registered.')

  password = await bcrypt.hash(password, 10)

  user = await User.create({
    username,
    password,
    email,
    privilege,
    active: true
  }).catch(err => res.status(400).send('Unable to insert user.'))

  // ADD: SEND EMEAIL
  res.status(200).send('User has been successfully registered.')
})

router.post('/edit', auth, async (req, res) => {
  if (res.locals.user.privilege !== 'admin')
    return res.status(400).send('Access denied.')

  if (!req.body.username)
    return res.status(400).send('Username was not provided')

  let newUser = _.pick(req.body, [
    'username',
    'password',
    'email',
    'privilege',
    'active'
  ])

  let user = await User.findOne({ username: newUser.username })
  if (!user) return res.status(400).send('User not found.')

  if (user.privilege == 'admin')
    return res.status(400).send('Unable to edit users with admin status.')

  newUser = Object.assign(user, newUser)
  // clean for validation
  delete newUser._id
  delete newUser.__v

  const { error } = validateFull(newUser)
  if (error) return res.status(404).send(error.details[0].message)

  newUser.password = await bcrypt.hash(newUser.password, 10)

  let result = await User.updateOne(
    { username: newUser.username },
    newUser
  ).catch(err => res.status(400).send(err))

  if (result.ok) return res.send('User successfully updated.')
})

module.exports = router
// const Card = mongoose.model("Card", cardSchema);
