<template>
  <div class="m-tourney-item m-universal-block">
    <div class="tourney-header ub-dark-top">
      <div class="logo">
        <img src="/tourneys-page/tourney-logo.png" alt>
      </div>
      <div class="short-info">
        <p class="t-mode">Best of 3</p>
        <h4 class="game">Dota 2</h4>
        <p class="g-mode">5v5</p>
        <p class="players">
          <i class="fas fa-user"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-user"></i>
        </p>
        <p class="date">Сегодня в 20:00</p>
      </div>
    </div>
    <div class="tourney-content ub-content">
      <h3 class="title">Chicken Breakfast for 1</h3>
      <p class="charge">Бесплатное участие</p>

      <div class="low-row">
        <p class="reward">200$</p>
        <a href class="button">
          <span>Подробнее</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.m-tourney-item
  position: relative
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
        font-size: .8rem
        text-transform: uppercase
      .game
        font-size: 2rem
        margin: 0
        line-height: 1
        color: #fff
        text-transform: uppercase
        font-weight: 600
        transform: translateX(-2px)
      .g-mode
        font-size: .9rem
        text-transform: uppercase
      .players
        font-size: .9rem
        margin-top: 5px
      .date
        font-size: 1.2rem
        margin-top: 5px
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
      font-weight: 100
      color: $paleBlue
    .reward
      margin-top: 5px
      font-weight: 400
      font-size: 2.2rem
      margin-bottom: 0
    .button
      justify-self: flex-start
    @include respond-to(xl)
      .title
        font-size: 1.6rem
</style>
