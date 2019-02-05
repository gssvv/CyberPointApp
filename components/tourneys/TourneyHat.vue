<template>
  <div class="l-row hat bg">
    <div class="short-info">
      <h1 class="title">Weplay CS:GO Cup (1x1 pistols) #148</h1>
      <div class="attributes">
        <div class="item">Best of 3</div>
        <div class="item">Бесплатно</div>
        <div class="item">SQUAD FPP</div>
      </div>
      <div class="price-and-reg">
        <div class="price">
          <span class="num">200$</span>
          <span class="label">Призовой фонд</span>
        </div>
        <button-element>Участвовать</button-element>
      </div>
    </div>
    <div class="timer">
      <div class="item">
        <div class="num">20</div>
        <div class="label">Дня</div>
      </div>
      <div class="item">
        <div class="num">12</div>
        <div class="label">Часов</div>
      </div>
      <div class="item">
        <div class="num">35</div>
        <div class="label">Минут</div>
      </div>
      <div class="item">
        <div class="num">4</div>
        <div class="label">Секунд</div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonElement from '@/components/elements/ButtonElement'

export default {
  components: {
    ButtonElement
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
    .attributes
      display: grid
      grid-auto-flow: column
      justify-content: space-around
      margin-top: 5px  
      .item
        font-size: 1.1rem
        text-transform: uppercase
    .price-and-reg
      margin-top: 15px
      display: grid
      grid-auto-flow: column
      align-items: center
      justify-content: space-around
      .price
        font-size: 3rem
        font-weight: 400
        span
          display: block
          line-height: 1
          text-align: center
          &.label
            font-size: .8rem
            font-weight: 100
            text-transform: uppercase
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
        justify-content: space-between
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
