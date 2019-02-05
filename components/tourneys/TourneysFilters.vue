<template>
  <div class="l-filters">
    <div class="container">
      <div class="l-content wrapper">
        <div class="m-solid-block filter-button caped">1v1</div>
        <div class="m-solid-block filter-button unactive caped">5v5</div>
        <div class="m-solid-block filter-button calendar caped">
          <i class="fas fa-calendar"></i> 23/12
        </div>
        <div class="m-solid-block filter-button unactive caped">Бесплатно</div>
        <div class="m-solid-block filter-button select caped no-padding">
          <select>
            <!-- maybe should take from m-field -->
            <option selected>Организаторы</option>
            <option>Epulze</option>
          </select>
          <i class="fas fa-angle-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.l-filters
  padding: 15px 0 0 0  
  .wrapper
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
    align-items: center
    grid-gap: 10px 
    .filter-button
      margin: 0 10px 5px 0
      cursor: pointer
      @include shadow(1)
      @include respond-to(md)
        margin: 0 7.5px 10px 0
      &.calendar
        .fas
          margin-right: 5px
      &.select
        position: relative
        cursor: pointer
        select
          font-size: inherit
          padding-right: 30px
        .fas
          position: absolute
          right: 10px
          top: 10px

</style>