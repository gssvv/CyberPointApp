<template>
  <div class="m-tourney-item" @click="goToTourney(tourney.id)">
    <div class="m-tourney-item__logo">
        <img
          :src="`/organisators/${tourney.organisator.toLowerCase()}.png`"
          :alt="`Турниры от ${tourney.organisator}`"
        >
      </div>
      <div class="m-tourney-item__block title">
        <div class="block__title date" v-text="getCalendar(tourney.date)" />
        <div class="block__content" v-text="tourney.title" />
      </div>

      <div class="m-tourney-item__block" v-if="tourney.prize">
        <div class="block__title">Призовой фонд</div>
        <div class="block__content" v-text="tourney.prize" />
      </div>

      <div class="m-tourney-item__block" v-if="tourney.price">
        <div class="block__title">Взнос</div>
        <div class="block__content" v-text="tourney.price" />
      </div>

      <div class="m-tourney-item__block" v-if="tourney.teamMode">
        <div class="block__title">Режим</div>
        <div class="block__content" v-text="tourney.teamMode" />
      </div>

      <div class="m-tourney-item__link">
        <span class="link-text">Подробнее</span>
        <span class="fas fa-chevron-right"></span>
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
  @include shadow(2)
  position: relative
  display: flex
  flex-wrap: wrap
  background-color: $darkBlue2
  border-radius: 2px
  padding: 16px 56px 24px 136px
  min-height: 120px
  cursor: pointer
  transition: .35s ease
  justify-content: flex-start
  position: relative
  &__logo
    width: 88px
    height: 88px
    display: grid
    justify-content: center
    background-size: contain
    background-position: center center
    background-repeat: no-repeat
    margin-right: 24px
    position: absolute
    left: 24px
    img
      width: 100%
      height: 100%
      object-fit: contain
      object-position: center center
  &__block
    margin-top: 18px
    margin-right: 40px
    &.title
      width: 380px
    .block
      &__title
        font-size: 14px
        margin-bottom: 4px
        color: $lightBlue
        &.date 
          font-size: 16px
          color: $paleBlue
      &__content
        color: #fff
        font-weight: bold
        font-size: 22px
        max-width: 380px
  &__link
    display: grid
    align-items: center
    justify-content: center 
    opacity: .25
    transition: .35s ease
    position: absolute
    top: 0
    right: 32px
    height: 100%
    .link-text
      display: none
  &:hover
    @include shadow(3)
    .m-tourney-item__link
      opacity: 1

  @include respond-to(md)
    &__logo
      top: 32px
    &__block
      &.title 
        width: 100%

  @include respond-to(sm)
    padding: 26px 20px 4px 20px
    &__block
      margin: 0 32px 20px 0
      &.title
        padding-left: 100px
        margin-right: 0
        min-height: 74px
      .block
        &__title
          &.date
            font-size: 14px
        &__content
          font-size: 18px
    &__logo
      top: 20px
      width: 80px
      left: 20px
      height: 80px
    &__link
      position: static
      width: 100%
      opacity: 1
      justify-content: flex-end
      margin: 8px 0 20px 0
      color: $lightBlue
      display: flex
      align-items: center
      .link-text
        display: block
        margin-right: 8px
      
</style>
