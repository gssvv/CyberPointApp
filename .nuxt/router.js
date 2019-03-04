import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _2b8cc06e = () => interopDefault(import('..\\pages\\panel\\index.vue' /* webpackChunkName: "pages_panel_index" */))
const _5859ba36 = () => interopDefault(import('..\\pages\\panel\\bots.vue' /* webpackChunkName: "pages_panel_bots" */))
const _7ec5ee82 = () => interopDefault(import('..\\pages\\panel\\edit\\index.vue' /* webpackChunkName: "pages_panel_edit_index" */))
const _983d7a40 = () => interopDefault(import('..\\pages\\panel\\login.vue' /* webpackChunkName: "pages_panel_login" */))
const _054071c2 = () => interopDefault(import('..\\pages\\panel\\tourneys.vue' /* webpackChunkName: "pages_panel_tourneys" */))
const _2fa379ff = () => interopDefault(import('..\\pages\\panel\\users.vue' /* webpackChunkName: "pages_panel_users" */))
const _36dd0bc6 = () => interopDefault(import('..\\pages\\tournament\\_id.vue' /* webpackChunkName: "pages_tournament__id" */))
const _f9066332 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))
const _4f9092e6 = () => interopDefault(import('..\\pages\\_game.vue' /* webpackChunkName: "pages__game" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/panel",
      component: _2b8cc06e,
      name: "panel"
    }, {
      path: "/panel/bots",
      component: _5859ba36,
      name: "panel-bots"
    }, {
      path: "/panel/edit",
      component: _7ec5ee82,
      name: "panel-edit"
    }, {
      path: "/panel/login",
      component: _983d7a40,
      name: "panel-login"
    }, {
      path: "/panel/tourneys",
      component: _054071c2,
      name: "panel-tourneys"
    }, {
      path: "/panel/users",
      component: _2fa379ff,
      name: "panel-users"
    }, {
      path: "/tournament/:id?",
      component: _36dd0bc6,
      name: "tournament-id"
    }, {
      path: "/",
      component: _f9066332,
      name: "index"
    }, {
      path: "/:game",
      component: _4f9092e6,
      name: "game"
    }],

    fallback: false
  })
}
