<template>
  <div class="recommended">
    <div class="m-universal-block section light">
      <div class="ub-dark-top block-header">
        <a>
          Еще турниры
          <span class="unactive">от ChallangerMode</span>
        </a>
      </div>

      <div class="ub-content block-content">
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
      </div>
    </div>

    <div class="m-universal-block section light">
      <div class="ub-dark-top block-header">
        <a>Прочие</a>
      </div>

      <div class="ub-content block-content">
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
      </div>
    </div>
  </div>
</template>

<script>
import TourneyBlock from './TourneyBlock'
export default {
  components: {
    TourneyBlock
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.recommended
  grid-column: 1/4
  @include respond-to(lg)
    grid-column: 1/3
  @include respond-to(md)
    grid-column: 1/2
  .section
    .block-header
      .unactive
        font-size: .9rem
        margin-left: 5px
    .block-content
      display: grid
      grid-template-columns: repeat(3,1fr)
      grid-gap: 20px 15px
      @include respond-to(lg)
        grid-template-columns: 1fr 1fr
      @include respond-to(md)
        grid-template-columns: 1fr 
</style>
