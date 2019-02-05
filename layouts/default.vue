<template>
  <div>
    <header-component/>
    <nuxt/>
    <footer-component/>
  </div>
</template>
<script>
import HeaderComponent from '@/components/HeaderComponent'
import FooterComponent from '@/components/FooterComponent'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style lang="sass">
@import '@/assets/style/_variables.sass'

</style>
