const pkg = require('./package')

module.exports = {
  mode: 'universal',
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
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
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || 'jwtKey'
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/style/main.sass',
    '@/assets/style/fa.all.min.css',
    '@/assets/transition.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/click-outside.js',
    '@/plugins/v-tooltip.js',
    '@/plugins/scroll.js'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: 'http://test.alex-card.ru'
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
