<template>
  <div
    class="l-row hat bg"
    :style="popup ? {
    backgroundImage: `url(/tourneys-page/${gameChosen}-tourney-banner.jpg)`
    } : ''"
  >
    <div class="short-info">
      <h1 class="title">
        {{ tourney.title }}
        <nuxt-link :to="mlink" v-if="mlink">
          <i class="fas fa-pen edit-button"></i>
        </nuxt-link>
      </h1>
      <div class="attributes">
        <div class="item" v-if="tourney.matchMode">{{ tourney.matchMode }}</div>
        <div class="item" v-if="tourney.teamMode">{{ tourney.teamMode }}</div>
        <div class="item">{{ (!tourney.price) ? ('Бесплатно') : (tourney.price + ' с игрока') }}</div>
      </div>
      <div class="price-and-reg">
        <div class="price" v-if="tourney.prize" v-tooltip.top-end="'Суммарно'">
          <span class="num">{{ tourney.prize }}</span>
          <span class="label">Награда</span>
        </div>
        <a
          v-if="tourney.link"
          target="_blank"
          :href="tourney.link"
          class="button"
          v-tooltip.top="'Перейти на страницу с турниром для регистрации'"
        >
          <span>Участвовать</span>
        </a>
      </div>
    </div>
    <div class="timer" v-if="!timer.stop">
      <div class="item">
        <div class="num">{{ timer.days }}</div>
        <div class="label">Days</div>
      </div>
      <div class="item">
        <div class="num">{{ timer.hours }}</div>
        <div class="label">Hours</div>
      </div>
      <div class="item">
        <div class="num">{{ timer.minutes }}</div>
        <div class="label">Minutes</div>
      </div>
      <div class="item">
        <div class="num">{{ timer.seconds }}</div>
        <div class="label">Seconds</div>
      </div>
    </div>
    <div class="timer" v-else>
      <div class="item">
        <div class="num small">Турнир начался</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from 'js-cookie'
import { DateTime } from 'luxon'

export default {
  props: {
    tourney: {
      type: Object,
      required: true
    },
    popup: Boolean
  },
  data() {
    return {
      timer: {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        stop: false
      },
      mlink: null
    }
  },
  created() {
    let token = Cookies.get('auth_token')
    if (token) {
      this.$axios
        .get('/api/users/me')
        .then(res => {
          if (res.data.privilege == 'admin' || 'moderator')
            this.mlink = {
              name: `panel-edit`,
              params: { edit: this.tourney.id }
            }
        })
        .catch(err => false)
    }
  },
  computed: {
    ...mapState(['gameChosen'])
  },
  watch: {
    tourney() {
      this.timerFunc()
    }
  },
  mounted() {
    this.timerFunc()
  },
  destroyed() {
    this.timer.stop = true
  },
  methods: {
    timerFunc() {
      if (!this.tourney.date) return
      this.timer.stop = false

      let diff = (new Date(this.tourney.date) - new Date()) / 1000

      if (diff < 0) return (this.timer.stop = true)
      this.updateTimer(diff)
      let refreshTimer = setInterval(() => {
        diff -= 1
        if (diff < 0 || this.timer.stop) {
          this.timer.stop = true
          clearInterval(refreshTimer)
          return
        }
        this.updateTimer(diff)
      }, 1000)
    },
    updateTimer(diff) {
      //days left
      this.timer.days = Math.floor(diff / 60 / 60 / 24)
      //hours left
      this.timer.hours = Math.floor(diff / 60 / 60) - 24 * this.timer.days
      this.timer.minutes =
        Math.floor(diff / 60) - 60 * (24 * this.timer.days + this.timer.hours) //minutes left
      this.timer.seconds =
        Math.floor(diff) -
        60 *
          (this.timer.minutes + 60 * (24 * this.timer.days + this.timer.hours)) //days left

      this.timer.hours =
        this.timer.hours < 10 ? `0${this.timer.hours}` : this.timer.hours
      this.timer.minutes =
        this.timer.minutes < 10 ? `0${this.timer.minutes}` : this.timer.minutes
      this.timer.seconds =
        this.timer.seconds < 10 ? `0${this.timer.seconds}` : this.timer.seconds
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.hat
  padding: 30px
  position: relative
  z-index: 5
  display: grid
  grid-auto-flow: column
  grid-template-columns: 1fr 1fr
  @include respond-to(lg)
    grid-gap: 30px
    grid-auto-flow: row
    grid-template-columns: auto
  @include respond-to(md)
    grid-gap: 20px
  @include respond-to(sm)
    padding-left: 15px
    padding-right: 15px
  &:after
    position: absolute
    content: ""
    height: 100%
    width: 100%
    background-color: $colorfulBlue
    top: 0
    left: 0
    z-index: 0
    opacity: .65
  .short-info
    z-index: 1
    display: grid
    justify-content: center
    h1
      font-size: 2rem
      font-weight: 600
      margin: 0
      text-align: center
      .edit-button 
        font-size: 1.3rem
        transform: translate(10px, -3px)
    .attributes
      display: grid
      grid-auto-flow: column
      justify-content: center
      margin-top: 5px  
      grid-gap: 15px
      .item
        font-size: 1.1rem
        text-transform: uppercase
    .price-and-reg
      margin-top: 15px
      display: grid
      grid-auto-flow: column
      align-items: center
      justify-content: space-around
      grid-gap: 30px
      .price
        font-size: 3rem
        font-weight: 400
        cursor: default
        span
          display: block
          line-height: 1
          text-align: center
          &.label
            font-size: .8rem
            font-weight: 400
            text-transform: uppercase
            opacity: .7
        @include respond-to(sm)
          font-size: 2.4rem
          span
            &.label
              font-size: .7rem 
    .button
      background-color: #fff
      color: #222
      margin-top: 0
      &:hover
        color: #fff
    @include respond-to(md)
      h1
        font-size: 1.8rem  
      .attributes 
        margin-top: 10px 
        .item
          font-size: 1rem  
      .price-and-reg
        margin-top: 10px
  .timer
    z-index: 1
    display: grid
    align-items: center
    grid-auto-flow: column
    grid-auto-columns: 1fr
    max-width: 450px
    margin: auto
    grid-gap: 30px
    .item
      text-align: center
      .num
        font-size: 5rem
        font-weight: 100
        line-height: .9
        &.small
          font-size: 3rem
      .label
        font-size: .9rem
        line-height: 1
    @include respond-to(lg)
      grid-gap: 25px
      .item
        .num
          font-size: 4rem
    @include respond-to(sm)
      grid-gap: 20px
      .item
        .num
          font-size: 3rem

</style>
