<template>
  <label class="m-field tf-field">
    <div class="label">{{ title }}</div>
    <input
      :type="(password) ? 'password' : 'text'"
      class="input input-text"
      :class="{ error, success }"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    <span class="error">{{ error }}</span>
    <span class="info">{{ info }}</span>
  </label>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
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
    password: {
      type: Boolean,
      required: false
    },
    info: {
      type: String,
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
    &-text 
      
</style>
