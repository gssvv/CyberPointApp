<template>
  <div class="l-tourney page">
    <div class="container bg">
      <tourney-hat/>
    </div>
    <div class="container">
      <div class="l-content content">
        <tourney-columns/>
        <recommended-section/>
      </div>
    </div>
  </div>
</template>

<script>
import TourneyHat from '@/components/tourneys/TourneyHat'
import TourneyColumns from '@/components/tourneys/TourneyColumns'
import RecommendedSection from '@/components/tourneys/RecommendedSection'

export default {
  components: {
    TourneyHat,
    TourneyColumns,
    RecommendedSection
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-tourney
  .container.bg
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
