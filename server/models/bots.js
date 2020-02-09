const Joi = require('joi')
const mongoose = require('../databaseInit')
const _ = require('lodash')

const botSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organisator: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
    unique: true
  },
  site: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 256,
    unique: true
  },
  games: {
    type: Array,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

exports.Bot = mongoose.model('Bot', botSchema)

// exports.User = User

exports.validate = function validateBot(bot) {
  const schema = {
    id: Joi.string().required(),
    organisator: Joi.string()
      .min(1)
      .max(50)
      .required(),
    site: Joi.string()
      .min(5)
      .max(256)
      .required(),
    games: Joi.array().required(),
    lastUpdate: Joi.date().required(),
    active: Joi.boolean().required()
  }

  return Joi.validate(user, schema)
}
