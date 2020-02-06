const mongoose = require('mongoose')

const settings =
  process.env.NODE_ENV === 'production'
    ? {
        useNewUrlParser: true,
        user: 'Cybpoint',
        pass: process.env.DB_PASS || 'ad',
        auth: {
          authSource: 'admin'
        }
      }
    : {
        useNewUrlParser: true
      }

mongoose
  .connect(
    // 'mongodb://46.101.24.197:27017/cybpoint',
    'mongodb://localhost:27017/cybpoint',
    settings
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Error occured connecting to MongoDB:', err))

module.exports = mongoose
