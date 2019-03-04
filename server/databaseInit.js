const mongoose = require('mongoose')

mongoose
  .connect(
    'mongodb://46.101.24.197:27017/cybpoint',
    {
      useNewUrlParser: true,
      user: 'Cybpoint',
      pass: 'KfH0UkQLzGCl1',
      auth: {
        authSource: 'admin'
      }
    }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Error occured connecting to MongoDB:', err))

module.exports = mongoose
