<template>
  <div>
    <!-- set game for banner -->
    <tourneys-banner :gameInfo="gameInfo"/>
    <tourneys-filters/>
    <tourneys-list/>
    <!-- <tourney-popup/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TourneysBanner from '@/components/tourneys/TourneysBanner'
import TourneysFilters from '@/components/tourneys/TourneysFilters'
import TourneysList from '@/components/tourneys/TourneysList'
import TourneyPopup from '@/components/tourneys/TourneyPopup'

export default {
  components: {
    TourneysBanner,
    TourneysFilters,
    TourneysList,
    TourneyPopup
  },
  middleware: 'gameTounreys',
  computed: {
    ...mapGetters({
      gameInfo: 'getCurrentGameInfo'
    })
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

</style>
