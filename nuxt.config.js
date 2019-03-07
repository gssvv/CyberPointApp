const pkg = require('./package')

module.exports = {
  mode: 'universal',
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  manifest: {
    name: 'CyperPoint',
    lang: 'ru'
  },
  head: {
    title: 'CyberPoint – поиск киберспортивных онлайн-турниров',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'CyberPoint собирает информацию о киберспортивных онлайн-турнирах в одном месте для того, чтобы игроки могли узнавать о них одними из первых и могли принять в них участие. Турниры собираются с сайтов-организаторов, и отображаются все вместе на одной странице по каждой из игр, среди которых есть Dota 2, PUBG, CS:GO и Hearthstone.'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: `CyberPoint – поиск киберспортивных онлайн-турниров`
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: `CyberPoint собирает информацию о киберспортивных онлайн-турнирах в одном месте для того, чтобы игроки могли узнавать о них одними из первых и могли принять в них участие. Турниры собираются с сайтов-организаторов, и отображаются все вместе на одной странице по каждой из игр, среди которых есть Dota 2, PUBG, CS:GO и Hearthstone.`
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `/icon.png`
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || 'jwtPriVateKey'
    // DB_PASS
    // PORT
  },
  loading: {
    color: '#fff'
  },
  css: [
    '@/assets/style/main.sass',
    '@/assets/style/fa.all.min.css',
    '@/assets/transition.css'
  ],
  plugins: [
    '@/plugins/click-outside.js',
    '@/plugins/v-tooltip.js',
    '@/plugins/scroll.js'
  ],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  },

  build: {
    extend(config, ctx) {}
  }
}
