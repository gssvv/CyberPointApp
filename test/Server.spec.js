const request = require('supertest')
const app = require('./../server/app')
const cookie = require('cookie')

describe('Test the root path', () => {
  it('should response the GET method', async () => {
    const res = await request(app).get('/users')

    expect(res.statusCode).toBe(200)
  })

  it('should return cookie with useranem', async () => {
    const username = 'Gusev'

    const res = await request(app)
      .post('/users/add')
      .send({ username })

    let cookies = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : ''

    let cookiesParsed = cookie.parse(cookies)

    expect(res.statusCode).toBe(200)
    expect(cookiesParsed.username).toBe(username)
  })
})
