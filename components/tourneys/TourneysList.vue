<template>
  <div class="l-tourneys-list">
    <div class="container">
      <div class="l-content wrapper">
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
        <tourney-block/>
      </div>
      <div class="l-content">
        <div class="loading-tourneys">
          <i class="fas fa-circle-notch fa-spin"></i>
        </div>
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

.l-tourneys-list
  padding: 15px 0 15px 0
  .container
    .wrapper
      display: grid
      grid-template-columns: repeat(3, 1fr) 
      grid-gap: 20px 15px
      @include respond-to(lg)
        grid-template-columns: repeat(2, 1fr)
      @include respond-to(md)
        grid-template-columns: repeat(1, 1fr)  
    .loading-tourneys
      width: 100%
      display: grid
      justify-content: center
      align-items: center
      font-size: 3rem
      padding: 45px 0 30px 0

</style>
