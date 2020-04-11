const Joi = require('joi')
const mongoose = require('../databaseInit')
const _ = require('lodash')

const tourneySchema = new mongoose.Schema({
  id: {
    type: Number,
    minlength: 1,
    maxlength: 50,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  game: {
    type: String,
    minlength: 1,
    maxlength: 20,
    required: true
  },
  matchMode: {
    type: String,
    minlength: 0,
    maxlength: 20,
    required: false
  },
  teamMode: {
    type: String,
    minlength: 0,
    maxlength: 20,
    required: false
  },
  players: {
    type: Number,
    maxlength: 3,
    required: false
  },
  prize: {
    type: String,
    maxlength: 20,
    required: false
  },
  price: {
    type: String,
    maxlength: 20,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  dateAdded: {
    type: Date,
    default: new Date(),
    required: true
  },
  link: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  block1: {
    type: String,
    minlength: 10,
    maxlength: 3000,
    required: true
  },
  block2: {
    type: String,
    minlength: 3,
    maxlength: 3000,
    required: true
  },
  organisator: {
    type: String,
    maxlength: 50,
    required: true
  },
  addedby: {
    type: String,
    maxlength: 50,
    required: true
  },
  views: {
    type: Number,
    default: 0,
    required: false
  },
  followings: {
    type: Number,
    default: 0,
    required: false
  },
  status: {
    type: Number,
    required: true
  },
  applications: {
    type: Array,
    default: [],
    required: false
  },
  history: {
    type: Array,
    default: [],
    required: false
  }
})

exports.Tourney = mongoose.model('Tourney', tourneySchema)

exports.validate = function validateTourney(tourney) {
  const schema = {
    id: Joi.number()
      .min(1)
      .required(),
    title: Joi.string()
      .min(3)
      .max(100)
      .required(),
    game: Joi.string()
      .min(1)
      .max(20)
      .required(),
    matchMode: Joi.string()
      .min(0)
      .max(20)
      .empty(''),
    teamMode: Joi.string()
      .min(0)
      .max(20)
      .empty(''),
    players: Joi.number()
      .min(1)
      .max(20)
      .empty(''),
    prize: Joi.string()
      .min(1)
      .max(20)
      .empty(''),
    price: Joi.string()
      .min(1)
      .max(20)
      .empty(''),
    date: Joi.date().required(),
    dateAdded: Joi.date().empty(),
    link: Joi.string()
      .min(5)
      .max(255)
      .required(),
    block1: Joi.string()
      .min(10)
      .max(3000)
      .required(),
    block2: Joi.string()
      .min(3)
      .max(3000)
      .required(),
    organisator: Joi.string()
      .min(1)
      .max(50)
      .required(),
    addedby: Joi.string()
      .min(1)
      .max(50)
      .required(),
    views: Joi.number().empty(),
    followings: Joi.number().empty(),
    status: Joi.number().required(),
    applications: Joi.array().empty(),
    history: Joi.array().empty()
  }

  return Joi.validate(tourney, schema)
}
