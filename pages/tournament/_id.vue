<template>
  <div class="l-tourney page">
    <div
      class="container bg"
      :style="{
    backgroundImage: `url(/tourneys-page/${gameChosen}-tourney-banner.jpg)`
    }"
    >
      <tourney-hat :tourney="tourney"/>
    </div>
    <div class="container">
      <div class="l-content content">
        <tourney-columns :tourney="tourney"/>
        <!-- MAKE LIST FOR DAT -->
        <recommended-section :list="tourneysList"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TourneyHat from '@/components/tourneys/TourneyHat'
import TourneyColumns from '@/components/tourneys/TourneyColumns'
import RecommendedSection from '@/components/tourneys/RecommendedSection'
import _ from 'lodash'

export default {
  computed: {
    ...mapState({
      tourney: 'fullTournament',
      gameChosen: 'gameChosen'
    })
  },
  data() {
    return {
      tourneysList: {
        this: [],
        other: []
      }
    }
  },
  async created() {
    let { data: thatList } = await this.$axios
      .post('/api/tourneys/list', {
        game: this.tourney.game,
        params: {
          organisator: this.tourney.organisator
        }
      })
      .catch(err => console.log(err))

    this.tourneysList.this = thatList

    let { data: otherList } = await this.$axios
      .post('/api/tourneys/list', {
        game: this.tourney.game,
        params: {
          organisator: {
            title: this.tourney.organisator,
            not: true
          }
        }
      })
      .catch(err => console.log(err))

    this.tourneysList.other = otherList
  },
  components: {
    TourneyHat,
    TourneyColumns,
    RecommendedSection
  },
  middleware: 'tournament'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-tourney
  .container.bg
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
