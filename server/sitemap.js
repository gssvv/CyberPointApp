const express = require('express')
const router = express.Router()
const { Tourney } = require('./models/tourneys')
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')

let sitemap

router.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml')
  res.header('Content-Encoding', 'gzip')

  let tourneys = await Tourney.find({ status: 1 })
    .sort({ date: -1 })
    .select({
      id: 500
    })
    .limit(2000)

  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap)
    return
  }
  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`
    })
    const pipeline = smStream.pipe(createGzip())

    smStream.write({ url: '/', changefreq: 'monthly', priority: 0.9 })
    smStream.write({ url: '/dota', changefreq: 'daily', priority: 0.7 })
    smStream.write({ url: '/pubg', changefreq: 'daily', priority: 0.7 })
    smStream.write({ url: '/csgo', changefreq: 'daily', priority: 0.7 })
    smStream.write({ url: '/hs', changefreq: 'daily', priority: 0.7 })
    tourneys.forEach(({ id }) => {
      smStream.write({
        url: `/tournament/${id}`,
        changefreq: 'daily',
        priority: 0.3
      })
    })
    smStream.end()

    // cache the response
    streamToPromise(pipeline).then(sm => (sitemap = sm))
    // stream the response
    pipeline.pipe(res).on('error', e => {
      throw e
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

module.exports = router
