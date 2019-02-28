<template>
  <div class="m-popup" @click.self="close">
    <div class="m-universal-block popup-core">
      <div class="ub-dark-top popup-header">
        <div class="block-title">{{ title }}</div>
        <a class="close-button" @click="close">
          <i class="fas fa-times"></i>
        </a>
      </div>
      <div class="ub-content popup-content">
        <slot/>
        <div class="loading-spinner" v-if="loading">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$parent.popup.active = false
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    },
    button: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'
.m-popup
  display: grid
  justify-content: center
  align-items: center
  position: fixed
  z-index: 10
  width: 100%
  height: 100%
  left: 0
  top: 0
  max-width: 100%
  background-color: rgba(0,0,0,0.5)
  .popup-core
    margin-left: 10px
    margin-right: 10px
    min-width: 300px
  .popup-header
    padding: 5px 10px
    display: flex
    align-items: center
    justify-content: space-between
    .close-button
      margin-left: 15px
      font-size: 1rem
      cursor: pointer
  .popup-content
    padding: 30px
    .button
      justify-self: flex-end
      margin-top: 30px
    .loading-spinner
      display: grid
      justify-content: center
      align-items: center
      font-size: 2rem
      padding-left: 30px
      padding-right: 30px
    .title  
      font-size: 2rem
      margin-bottom: 0
    .message
      margin-top: 5px
      font-size: .9rem
      opacity: .8
  @include respond-to(sm)
    .popup-content
      .title
        font-size: 1.4rem
</style>
