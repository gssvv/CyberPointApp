<template>
  <div class="l-header">
    <div class="container">
      <div class="l-content">
        <div class="wrapper">
          <nuxt-link class="logo" to="/">
            <img src="/logo.png" alt="Киберспортивные турниры" />
          </nuxt-link>
          <div class="menu" v-click-outside="hideMenu">
            <ul ref="menu">
              <li>
                <nuxt-link to="/">Главная</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="`/${currentGameInfo.link}`">Турниры</nuxt-link>
              </li>
              <!-- <li>
                <nuxt-link to="/faq">FAQ</nuxt-link>
              </li>-->
              <li @mouseleave="gamesList(0)" class="game-picker">
                <a :class="currentGameInfo.link" @mouseover="gamesList(1)">
                  <!-- ADD GAME LOGO HERE -->
                  <span>{{ currentGameInfo.title }}</span>
                  <!-- THIN ANGLE NEEDED -->
                  <i class="fas fa-angle-down"></i>
                </a>
                <keep-alive>
                  <div class="games-list" ref="gamesList">
                    <nuxt-link
                      v-for="game in gamesMenu"
                      :key="game.link"
                      :to="'/'+game.link"
                      :class="game.link"
                    >{{ game.shortTitle || game.title }}</nuxt-link>
                  </div>
                </keep-alive>
              </li>
              <li>
                <a href="https://vk.com/cybpoint" target="_blank">
                  <i class="fab fa-vk"></i>
                </a>
              </li>
            </ul>
            <div class="open-menu-mobile" @mouseover.stop="showMenu()">
              <div class="fas fa-bars"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TweenMax } from 'gsap'

export default {
  data() {
    return {
      showedMenu: false
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters({
      currentGameInfo: 'getCurrentGameInfo',
      gamesMenu: 'getOtherGames'
    })
  },
  watch: {
    $route(to, from) {
      this.hideMenu()
      this.gamesList(0)
    }
  },
  methods: {
    gamesList(action) {
      const { gamesList } = this.$refs

      if (action === 1) {
        TweenMax.to(gamesList, 0.25, {
          display: 'block',
          opacity: '1'
        })
      } else {
        TweenMax.to(gamesList, 0, { display: 'none', opacity: '0' })
      }
    },
    showMenu() {
      this.showedMenu = true
      const { menu } = this.$refs

      TweenMax.to(menu, 0.25, {
        display: 'block',
        opacity: '1'
      })
    },
    hideMenu() {
      if (!this.showedMenu) return
      const { menu } = this.$refs

      TweenMax.to(menu, 0.25, { display: 'none', opacity: '0' })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-header
  @include shadow(1)
  background-color: $darkBlue3
  color: #fff
  .wrapper
    display: grid
    justify-content: space-between
    grid-template-rows: 50px
    grid-auto-flow: column
    align-items: stretch
    .logo
      text-decoration: none
      img
        padding: 5px 0
        height: 100%
    .menu
      position: relative
      ul
        z-index: 3
        letter-spacing: -5px
        margin: 0
        min-height: 100%
        padding: 0
        @include respond-to(md)
          opacity: 0
          display: none
          position: absolute
          right: -15px
          top: 50px
          background-color: $darkBlue3
          @include shadow(1)
          li
            width: 100%
        li
          letter-spacing: normal
          height: 100%
          max-height: 100%
          display: inline-block
          a
            width: 100%
            height: 100%
            text-decoration: none
            font-size: 1.1rem
            display: block
            padding: 0 15px
            line-height: 50px
            &:hover
              background-color: $darkBlue1
            @include respond-to(md)
              padding: 0 30px
          &.game-picker
            text-transform: uppercase
            position: relative
            z-index: 5
            .fas
              margin-left: 15px
              vertical-align: middle
            a
              background-size: cover
              background-position: center center
              white-space: nowrap
              cursor: default
              transition: .25s
              background-color: $darkBlue3
              &:hover
                background-color: $darkBlue1
              &.dota
                background-image: url(../static/common/game-button-bg/dota.png)
                background-color: $dotaPrimary
                &:hover 
                  background-color: $dotaColorful
              &.pubg
                background-image: url(../static/common/game-button-bg/pubg.png)
                background-color: $pubgPrimary
                &:hover
                  background-color: $pubgColorful
              &.csgo
                background-image: url(../static/common/game-button-bg/csgo.png)
                background-color: $csgoPrimary
                &:hover
                  background-color: $csgoColorful
              &.hs
                background-image: url(../static/common/game-button-bg/hs.png)
                background-color: $hsPrimary
                &:hover
                  background-color: $hsColorful
            .games-list
              @include shadow(2)
              display: none
              opacity: 0
              min-width: 100%
              position: absolute
              a
                cursor: pointer
      .open-menu-mobile
        display: none
        @include respond-to(md)
          display: grid
          height: 100%
          justify-content: center
          align-items: center
          font-size: 2rem
          cursor: pointer
</style>

