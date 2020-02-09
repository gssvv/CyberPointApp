const jwt = require('jsonwebtoken')
const env = require('../../nuxt.config.js').env
const { User } = require('../models/users')

console.log(env)

module.exports = async function(req, res, next) {
  const token = req.cookies.auth_token
  if (!token)
    return res.status(401).send('Access denied. User is not authenticated.')

  try {
    const { _id } = await jwt.verify(token, env.jwtPrivateKey)
    let user = await User.findOne({ _id, active: true })
    if (!user) {
      res.clearCookie('auth_token')
      return res
        .status(400)
        .send(
          'Access denied: user does not exist or disabled. Cookie have been cleared.'
        )
    }
    res.locals.user = user
    next()
  } catch (ex) {
    return res.status(400).send('Invalid token.')
  }
}
