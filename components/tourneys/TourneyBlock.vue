<template>
  <div class="m-tourney-item m-universal-block">
    <div class="tourney-header ub-dark-top">
      <div class="logo">
        <img
          :src="`/organisators/${tourney.organisator.toLowerCase()}.png`"
          :alt="`Турниры от ${tourney.organisator}`"
        >
      </div>
      <div class="short-info">
        <h4 class="game">{{ tourney.game }}</h4>
        <p class="t-mode">{{ tourney.teamMode }}</p>
        <p class="g-mode">{{ tourney.matchMode }}</p>
        <p class="players">
          <i class="fas fa-user" v-for="i in tourney.players" :key="i"></i>
        </p>
        <p class="date">{{ getCalendar(tourney.date) }}</p>
      </div>
    </div>
    <div class="tourney-content ub-content">
      <h3 class="title">{{ tourney.title }}</h3>
      <p
        class="charge"
      >{{ (!tourney.price) ? ('Бесплатное участие') : (tourney.price + ' от игрока') }}</p>

      <div class="low-row">
        <p class="reward">{{ tourney.prize }}</p>
        <a @click="goToTourney(tourney.id)" class="button">
          <span>Подробнее</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/ru'

export default {
  props: {
    tourney: {
      type: Object,
      required: true
    },
    link: {
      type: Boolean,
      required: false
    }
  },
  created() {
    moment.locale('ru')
  },
  mounted() {},
  methods: {
    getCalendar(date) {
      return moment(date).calendar()
    },
    async goToTourney(id) {
      if (this.link) {
        return this.$router.push({ path: `/tournament/${this.tourney.id}` })
      }
      await this.$store.dispatch('setFullTournament', id)
      this.$parent.$emit('goToTourney', id)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.m-tourney-item
  position: relative
  display: grid
  .tourney-header
    position: relative
    display: grid
    grid-template-columns: 45% 55%
    align-items: center
    .logo
      display: grid
      justify-content: center
      width: 100%
      background-size: contain
      background-position: center center
      background-repeat: no-repeat
      padding: 0 10px
      img
        width: 100%
    .short-info
      text-align: center
      color: $lightBlue
      p
        margin: 0
      .t-mode
        font-size: 2rem
        margin: 0
        line-height: 1
        color: #fff
        text-transform: uppercase
        font-weight: 600
        transform: translateX(-2px)
      .game
        font-weight: 400
        margin: 0
        font-size: 1rem
        text-transform: uppercase
      .g-mode
        font-size: .9rem
        text-transform: uppercase
        font-weight: 400
      .players
        font-size: .9rem
        margin-top: 5px
        letter-spacing: 2px
        font-weight: 400
      .date
        font-size: 1.2rem
        margin-top: 5px
        font-weight: 400
  .tourney-content
    display: grid
    .low-row
      display: grid
      justify-content: space-between
      grid-auto-flow: column
      align-items: center 
    .title
      font-size: 1.8rem
      font-weight: 400
      margin: 0
      line-height: 1
    .charge
      margin: 0
      font-size: 1rem
      font-weight: 400
      color: $paleBlue
    .reward
      margin-top: 10px
      font-weight: 400
      font-size: 2.2rem
      margin-bottom: 0
    .button
      justify-self: flex-start
    @include respond-to(xl)
      .title
        font-size: 1.6rem
</style>
