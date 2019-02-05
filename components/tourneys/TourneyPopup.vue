<template>
  <div class="l-tourney popup">
    <div class="container">
      <div class="l-row header">
        <div class="arrow-back">
          <!-- Arrow too thick -->
          <i class="fas fa-angle-left"></i>
        </div>

        <a href="#" class="to-full">
          <i class="fas fa-external-link-alt"></i>
          Открыть на новой странице
        </a>
      </div>
      <tourney-hat/>
      <div class="l-content content">
        <tourney-columns/>
      </div>
    </div>
  </div>
</template>

<script>
import TourneyHat from './TourneyHat'
import TourneyColumns from './TourneyColumns'

export default {
  components: {
    TourneyHat,
    TourneyColumns
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-tourney
  &.popup
    max-width: 100%
    position: fixed
    top: 0
    right: 0
    background-color: $darkBlue2
    height: 100%
    overflow-x: auto
    z-index: 6
    @include shadow(3)
    &:before
      content: ""
      position: fixed
      height: 100%
      width: 100%
      background-color: #222
      opacity: .75
      top: 0
      left: 0
      z-index: -1
  .hat.bg
    background-image: url(../../static/tourneys-page/dota-tourney-banner.jpg)
    background-position: center center
    background-size: cover
  .container
    z-index: 1
    background-color: $darkBlue3
    .header
      background-color: $darkBlue3
      padding: 0px 30px
      display: grid
      justify-content: space-between
      grid-auto-flow: column
      align-items: center
      @include respond-to(sm)
        padding-left: 15px
        padding-right: 15px
      .arrow-back
        cursor: pointer
        transition: .25s ease
        font-size: 2.5rem
        &:hover
          color: $paleBlue
      .to-full
        text-transform: uppercase
        font-size: .9rem
        text-decoration: none
        font-weight: 400
        .fas
          margin-right: 5px
        &:hover
          color: $paleBlue
  .content
    padding: 30px 0
    display: grid
    grid-auto-flow: row
    grid-template-columns: 4fr 3fr 3fr
    grid-template-rows: auto auto
    grid-gap: 20px
    align-items: flex-start
    @include respond-to(lg)
      grid-template-columns: 1fr 1fr
    @include respond-to(md)
      grid-template-columns: 1fr
</style>
