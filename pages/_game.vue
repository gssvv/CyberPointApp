<template>
  <div>
    <!-- set game for banner -->
    <tourneys-banner :gameInfo="gameInfo"/>
    <tourneys-filters
      :game="gameInfo.title"
      @updateParams="setParams"
      :paramsTemplate="paramsTemplate"
    />
    <tourneys-list :tourneysArray="tourneysArray"/>

    <div class="container" v-if="loading">
      <div class="l-content">
        <div class="loading-tourneys">
          <i class="fas fa-circle-notch fa-spin"></i>
        </div>
      </div>
    </div>
    <div class="offset-counter" v-scroll="scroll" ref="offsetCounter"></div>

    <tourney-popup :active="activePopup"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TourneysBanner from '@/components/tourneys/TourneysBanner'
import TourneysFilters from '@/components/tourneys/TourneysFilters'
import TourneysList from '@/components/tourneys/TourneysList'
import TourneyPopup from '@/components/tourneys/TourneyPopup'
import _ from 'lodash'

export default {
  components: {
    TourneysBanner,
    TourneysFilters,
    TourneysList,
    TourneyPopup
  },
  data() {
    return {
      scrollEnabled: false,
      pagination: 0,
      params: {},
      loading: false,
      paramsTemplate: {},
      activePopup: false
    }
  },
  async asyncData(context) {
    let { data: tourneysArray } =
      (await context.$axios
        .post('/api/tourneys/list', {
          game: context.store.getters.getCurrentGameInfo.title
        })
        .catch(err => console.log(err))) || []
    //                          if crashed ^^^

    return { tourneysArray }
  },
  watch: {
    activePopup: function(val) {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  },
  created() {
    this.scrollEnabled = true
    this.pagination = this.tourneysArray.length || 1
    this.paramsTemplate = this.gameInfo.paramsTemplate
    this.$on('goToTourney', id => {
      this.activePopup = true
    })
  },
  mounted() {},
  middleware: 'gameTourneys',
  computed: {
    ...mapGetters({
      gameInfo: 'getCurrentGameInfo'
    })
  },
  methods: {
    scroll() {
      if (!this.scrollEnabled) return
      let { offsetCounter } = this.$refs

      if (
        window.innerHeight >
          offsetCounter.getBoundingClientRect().top + window.pageXOffset &&
        !this.loading
      )
        this.addTourneys()
    },
    async addTourneys() {
      if (this.pagination == null || this.tourneysArray.length < 6) return

      this.loading = true

      let { data: tourneysArray } = await this.$axios
        .post('/api/tourneys/list', {
          offset: this.pagination,
          game: this.$store.getters.getCurrentGameInfo.title,
          params: this.params
        })
        .catch(err => console.log(err))

      if (tourneysArray.length < 6) {
        this.pagination = null
      } else {
        this.pagination += tourneysArray.length
      }

      for (let item of tourneysArray) {
        this.tourneysArray.push(item)
      }

      this.loading = false
    },
    async setParams(params) {
      this.params = params
      this.loading = true
      let tourneysArray = await this.$axios
        .post('/api/tourneys/list', {
          offeset: this.pagination,
          game: this.$store.getters.getCurrentGameInfo.title,
          params: this.params
        })
        .catch(err => console.log(err))

      this.tourneysArray = tourneysArray.data
      this.pagination = this.tourneysArray.length
      this.loading = false
    }
  },
  destroyed() {
    this.scrollEnabled = false
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.loading-tourneys
  width: 100%
  display: grid
  justify-content: center
  align-items: center
  font-size: 3rem
  padding: 45px 0 75px 0
  color: $paleBlue
  opacity: .5
.offset-counter
  visibility: hidden
</style>
