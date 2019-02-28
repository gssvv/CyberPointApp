<template>
  <a :href="href" class="button" :class="{ round, class: true }">
    <span>
      <slot/>
    </span>
  </a>
</template>
<script>
export default {
  props: {
    round: {
      type: Boolean,
      required: false
    },
    href: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.button
  @include shadow(1)
  display: inline-block
  margin-top: 10px
  background: $colorfulBlue
  color: #fff
  text-decoration: none
  text-transform: uppercase
  border-radius: 5px
  transition: .25s ease
  padding: 10px 20px
  font-weight: 400
  position: relative
  z-index: 1
  cursor: pointer
  span, i
    z-index: 1
    position: relative
  &:after
    content: ""
    position: absolute
    background: linear-gradient(-45deg, rgba(63,206,146, .9), rgba(52,123,187, .5))
    width: 100%
    height: 100%
    top: 0
    left: 0
    z-index: 0
    opacity: 0
    border-radius: 5px
    transition: .4s ease
  &:hover:after
    opacity: 1
  &.round
    margin-top: 0
    border-radius: 50%
    padding: 0
    height: 40px
    width: 40px
    font-size: 0.9rem
    display: grid
    justify-content: center
    align-items: center
    cursor: pointer
    &:after
      border-radius: 50%
</style>
