<template>
  <label class="m-field tf-field" :class="{unactive: unactive}">
    <div class="label">{{ title }}</div>
    <select
      class="input input-select"
      :class="{success, error}"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :disabled="unactive"
    >
      <option v-for="item in options" :key="item.val" :value="item.val">{{ item.title }}</option>
    </select>
    <i class="fas fa-angle-down select-arrow"></i>
    <span class="error">{{ error }}</span>
  </label>
</template>
<script>
export default {
  props: {
    value: {
      required: false
    },
    unactive: {
      type: Boolean,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    success: {
      type: Boolean,
      required: false
    },
    placeholder: {
      type: String,
      required: false
    },
    error: {
      type: String,
      required: false
    },
    options: {
      type: Array,
      required: false
    }
  }
}
</script>
<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.m-field
  display: grid
  justify-content: inherit
  position: relative
  .label
    font-size: .9rem
    margin: 2px 0
    color: rgba(255,255,255,0.8)
  .error, .info
    font-size: 0.8rem
    margin-left: 0px
    padding-top: 1px
    &:first-letter
      text-transform: uppercase
  .error
    color: $error
  .info
    color: rgba(255, 255, 255, .3)
    cursor: text
  .input
    border: none
    background-color: $darkBlue2
    color: rgba(255, 255, 255, .9)
    padding: 7.5px 7.5px 7.5px 7.5px
    font-size: 1rem
    transition: border .25s ease
    position: relative
    border-left: 3px solid $darkBlue2
    &:focus
      outline: none
      border-color: #fff
      color: #fff
    &::placeholder
      color: rgba(255, 255, 255, .2)
    &.error
      border-color: $error
    &.success
      border-color: $colorfulBlue
    &-select
      position: relative
      cursor: pointer
      font-size: inherit
      padding-right: 30px
      width: 100%
      background-color: $darkBlue2
      padding-top: 6.5px
      padding-bottom: 6.5px
      &:after
        position: absolute
        content: "hello"
        display: block
        background-color: #fff
        font-family: "Font Awesome 5 Free"
  .select-arrow
    position: absolute
    right: 10px
    bottom: 9px
    pointer-events: none  
</style>
