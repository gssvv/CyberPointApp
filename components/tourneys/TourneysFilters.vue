<template>
  <div class="l-filters">
    <div class="container">
      <div class="l-content wrapper">
        <div
          class="m-solid-block filter-button caped"
          v-for="(param, index) in paramsTemplate"
          @click="toggleField(index)"
          :class="{ disabled: !params[index] }"
          :key="index"
        >{{ param.text }}</div>
        <div
          class="m-solid-block filter-button caped"
          @click="toggleField('free')"
          :class="{ disabled: !params.free }"
        >Бесплатно</div>
        <div
          class="m-solid-block filter-button select caped no-padding"
          :class="{ disabled: !params.organisator }"
        >
          <select v-model="params.organisator">
            <!-- maybe should take from m-field -->
            <option selected value>Организатор</option>
            <option v-for="item in organisators" :value="item" :key="item">{{ item }}</option>
          </select>
          <i class="fas fa-angle-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    paramsTemplate: {
      type: Object,
      required: false
    },
    game: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      params: {
        free: false,
        organisator: '',
        // optional:
        v1: false,
        v5: false,
        fpp: false,
        tpp: false,
        solo: false,
        duo: false,
        squad: false
      },
      organisators: []
    }
  },
  async created() {
    let result = await this.$axios
      .post('/api/tourneys/orgs/', { game: this.game })
      .catch(err => console.log('Error occured'))

    this.organisators = result.data
  },
  watch: {
    params: {
      handler: function(val) {
        this.$emit('updateParams', val)
      },
      deep: true
    }
  },
  methods: {
    toggleField(option) {
      this.params[option] = !this.params[option]
    }
  }
}
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
    .filter-button
      margin: 0 10px 5px 0
      cursor: pointer
      @include shadow(1)
      @include respond-to(md)
        margin: 0 7.5px 10px 0
      &.disabled
        opacity: .3
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