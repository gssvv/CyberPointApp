<template>
  <div class="recommended">
    <div class="m-universal-block section light" v-if="list.this[0]">
      <div class="ub-dark-top block-header">
        <a>
          Еще турниры
          <span class="unactive">от {{ list.this[0].organisator }}</span>
        </a>
      </div>

      <div class="ub-content block-content">
        <tourney-block
          v-for="tourney in list.this"
          :key="tourney.id"
          :tourney="tourney"
          :link="true"
        />
      </div>
    </div>

    <div class="m-universal-block section light" v-if="list.other[0]">
      <div class="ub-dark-top block-header">
        <a>Прочие</a>
      </div>

      <div class="ub-content block-content">
        <tourney-block
          v-for="tourney in list.other"
          :key="tourney.id"
          :tourney="tourney"
          :link="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TourneyBlock from './TourneyBlock'
export default {
  props: {
    list: {
      type: Object,
      required: true
    }
  },
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
      grid-template-columns: 1fr
      grid-gap: 20px 15px
</style>
