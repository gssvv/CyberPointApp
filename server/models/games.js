const Joi = require('joi')
const mongoose = require('../databaseInit')
const _ = require('lodash')

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    maxlength: 30,
    required: true,
    unique: true
  },
  shortTitle: {
    type: String,
    maxlength: 30,
    required: false
  },
  description: {
    type: String,
    minlength: 20,
    maxlength: 300,
    required: true
  },
  paramsTemplate: {
    type: Object,
    required: false
  }
})

exports.Game = mongoose.model('Game', gameSchema)
