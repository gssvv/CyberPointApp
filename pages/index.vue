<template>
  <div class="l-games-links-wrapper">
    <nuxt-link
      tag="div"
      class="item"
      v-for="game in games"
      :key="game.link"
      :to="`/${game.link}`"
      :style="`backgroundImage: url(/tourneys-page/${game.link}-banner.jpg)`"
    >
      <img :src="`icons/${game.link}-logo.svg`" alt class="icon">
    </nuxt-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  created() {},
  computed: {
    ...mapState(['games'])
  }
  // middleware: 'redirectToTourneys'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-games-links-wrapper
  display: grid
  grid-auto-flow: column
  grid-auto-columns: 1fr
  grid-auto-rows: 1fr
  justify-content: center
  align-items: stretch
  height: calc(100vh - 50px)
  overflow: hidden
  @include respond-to(md) 
    grid-auto-flow: row
    overflow: inherit
    height: auto
    min-height: 100vh
  .item
    display: grid
    justify-items: center
    align-content: stretch
    align-items: center
    background-repeat: no-repeat
    background-size: cover
    background-position: center center
    position: relative
    transform: scale(1.25)
    cursor: pointer
    clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)
    @include respond-to(md) 
      transform: inherit
      clip-path: inherit
    &:after
        content: ""
        background: $darkBlue3
        position: absolute
        width: 100%
        height: 100%
        z-index: 0
        opacity: .75
        transition: .25s ease-in
    .icon
      width: 35% 
      z-index: 1
      margin: 50px 30px
    &:hover:after
      opacity: .25

</style>
