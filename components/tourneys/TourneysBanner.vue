<template>
  <div class="l-banner" :style="bannerStyle">
    <div class="container">
      <div class="l-content wrapper">
        <div class="title">
          <img :src="`icons/${game.link}-logo.svg`" :alt="`Турниры по ${game.title}`">
          <h2>{{ game.shortTitle || game.title }}</h2>
        </div>
        <!-- HERE SHOULD BE SEO STUFF  -->
        <h1>
          <strong>Любительские турниры по {{ game.title }} для начинающих игроков и команд</strong>
        </h1>
        <strong class="description-hidden">{{ game.description }}</strong>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    gameInfo: {
      type: Object,
      required: true
    }
  },
  created() {
    this.game = this.gameInfo
  },
  data() {
    return {
      game: '',
      bannerStyle: {
        backgroundImage: `url(/tourneys-page/${this.gameInfo.link}-banner.jpg)`
      }
    }
  },
}
</script>

<style lang="sass">
@import '@/assets/style/_variables.sass'

.l-banner
  width: 100%
  background-size: cover
  background-position: center center
  position: relative
  &:after
    content: ""
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: $colorfulBlue
    opacity: .65
  .container
    z-index: 1
    .description-hidden
      font-size: 1px
      margin: 0
      padding: 0
      opacity: .01
      pointer-events: none
    .wrapper
      padding: 50px 0
      color: #fff
      h1
        font-size: 1.2rem
        margin: 0
        strong
          font-weight: 100
      .title
        display: grid
        align-items: center
        grid-auto-flow: column
        justify-content: flex-start
        h2
          font-size: 10rem
          font-weight: 100
          text-transform: uppercase
          margin: 0
          line-height: 1
        img
          height: 120px
          margin-right: 15px
          width: 120px
      @include respond-to(md)
        .title
          h2
            font-size: 5rem
          img
            height: 70px
            width: 70px
            margin-right: 5px
        h1
          font-size: 1rem
      @include respond-to(sm)
        .title
          justify-content: center
          h2
            font-size: 4rem
          img
            height: 60px
            margin-right: 5px
            width: 60px
        h1
          margin-top: 10px
          text-align: center
  
</style>

