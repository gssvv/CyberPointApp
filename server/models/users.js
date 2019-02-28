const Joi = require('joi')
const jwt = require('jsonwebtoken')
const env = require('../../nuxt.config.js').env
const mongoose = require('../databaseInit')
const _ = require('lodash')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 256,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  privilege: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id
    },
    env.jwtPrivateKey
  )

  return token
}

exports.User = mongoose.model('User', userSchema)

// exports.User = User

exports.validateBase = function validateUserBase(req) {
  // usually accepts req.body
  let user = _.pick(req, ['username', 'password'])

  const schema = {
    username: Joi.string()
      .min(3)
      .max(50)
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  }

  return Joi.validate(user, schema)
}

exports.validateFull = function validateUserFull(req) {
  // usually accepts req.body
  let user = _.pick(req, ['username', 'email', 'password', 'privilege'])

  const schema = {
    username: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
    privilege: Joi.string().required()
  }

  return Joi.validate(user, schema)
}
