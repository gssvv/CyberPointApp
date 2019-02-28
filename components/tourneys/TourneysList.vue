<template>
  <div class="l-tourneys-list">
    <div class="container">
      <div class="l-content wrapper">
        <tourney-block v-for="tourney in tourneysArray" :key="tourney.id" :tourney="tourney"/>
        <div class="message" v-if="!tourneysArray.length && !$parent.loading">
          Ничего не найдено
          <i class="fas fa-frown-open"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TourneyBlock from './TourneyBlock'
import { setTimeout } from 'timers'

export default {
  props: {
    tourneysArray: {
      type: Array,
      required: true
    }
  },
  components: {
    TourneyBlock
  },
  created() {
    this.$on('goToTourney', id => {
      this.$parent.$emit('goToTourney', id)
    })
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
    .message
      color: $paleBlue
      opacity: .5
      margin: auto
      font-size: 1.2rem
      font-weight: 100
      grid-area: 1 / 1 / 2 / 4
      padding: 30px 0
      .fas
        display: block
        margin: auto
        text-align: center
        font-size: 2.4rem
        margin: 10px 0


</style>
