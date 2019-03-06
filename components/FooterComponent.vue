<template>
  <div class="l-footer">
    <div class="container">
      <div class="l-content wrapper">
        <div class="item">admin@cybpoint.ru</div>
        <div class="item">CyberPoint © {{ currentYear }}</div>
        <div class="item">Сайт исользует Cookie-файлы</div>
        <!-- Add something -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-footer
  background-color: $darkBlue2
  padding: 30px 0
  box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.12)
  .wrapper
    text-align: center
    display: grid
    grid-auto-flow: column
    justify-content: space-between
    align-items: center
    grid-auto-columns: 1fr
    color: rgba(255,255,255,.3)
    font-size: .9rem
    .item:nth-child(1)
      justify-self: flex-start
    .item:nth-child(2)
      justify-self: center
      font-size: 1rem
      color: #fff
    .item:nth-child(3)
      justify-self: flex-end
</style>