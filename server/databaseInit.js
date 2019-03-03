const mongoose = require('mongoose')

mongoose
  .connect(
    'mongodb://localhost:27017/cybpoint',
    {
      useNewUrlParser: true
      // user: "",
      // pass: "",
      // auth: {
      //   authSource: 'admin'
      // }
    }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Error occured connecting to MongoDB:', err))

module.exports = mongoose