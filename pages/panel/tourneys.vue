<template>
  <div class="tourneys-wrapper wrapper">
    <div class="m-universal-block panel-block">
      <div class="ub-dark-top panel-header">
        <h2 class="title">Турниры</h2>

        <div class="buttons-wrapper">
          <common-button :round="true" v-tooltip.top-end="'Add'" @click.native="editor">
            <i class="fas fa-plus"></i>
          </common-button>
          <common-button :round="true" v-tooltip.top-end="'Run all'" @click.native="runAll">
            <i class="fas fa-play"></i>
          </common-button>
        </div>
      </div>

      <div class="ub-content panel-content">
        <div class="tourneys-list">
          <tourney-list-item v-for="(item, index) in tourneys" :key="index" :data="item"/>
        </div>
      </div>
    </div>
    <div class="offset-counter" v-scroll="scroll" ref="offsetCounter"></div>

    <simple-popup :title="'Message'" :loading="popup.loading" v-if="popup.active">
      <h3 class="title" v-if="popup.title">{{ popup.title }}</h3>
      <p class="message" v-if="popup.message && !popup.html">{{ popup.message }}</p>
      <p class="message" v-if="popup.message && popup.html" v-html="popup.message"></p>

      <common-button v-if="popup.button" @click.native="$emit('confirmPopup')">{{ popup.button }}</common-button>
    </simple-popup>

    <tourney-popup :active="activePopup"/>
  </div>
</template>

<script>
import CommonButton from '@/components/elements/CommonButton.vue'
import TourneyListItem from '@/components/panel/TourneyListItem.vue'
import SimplePopup from '@/components/elements/SimplePopup.vue'
import TourneyPopup from '@/components/tourneys/TourneyPopup.vue'

export default {
  layout: 'panel',
  data() {
    return {
      scrollEnabled: false,
      popup: {
        message: '',
        title: '',
        loading: false,
        button: '',
        active: false,
        html: false
      },
      activePopup: false,
      tourneys: [],
      loading: false
    }
  },
  async created() {
    this.loadTourneys()
  },
  mounted() {},
  watch: {
    activePopup: function(val) {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  },
  methods: {
    async loadTourneys() {
      let { data: tourneys } =
        (await this.$axios
          .post('/api/tourneys/admin-list')
          .catch(err => console.log(err))) || {}

      this.pagination = tourneys.length < 25 ? null : tourneys.length
      this.tourneys = tourneys
      this.scrollEnabled = true
    },
    scroll() {
      if (!this.scrollEnabled) return
      let { offsetCounter } = this.$refs

      if (
        window.innerHeight >
        offsetCounter.getBoundingClientRect().top + window.pageXOffset
      )
        if (!this.loading) this.addTourneys()
    },
    async addTourneys() {
      if (this.pagination == null) return

      this.loading = true

      let { data: tourneys } =
        (await this.$axios
          .post('/api/tourneys/admin-list', {
            offset: this.pagination
          })
          .catch(err => console.log(err))) || {}

      this.pagination =
        tourneys.length < 10 ? null : this.pagination + tourneys.length

      for (let i of tourneys) {
        this.tourneys.push(i)
      }

      this.loading = false
    },
    editor() {
      this.$router.push('edit')
    },
    async runAll() {
      await this.confirmPopup(
        async () => {
          await this.$axios
            .post('/api/tourneys/set-status')
            .catch(err => console.log(err))

          await this.loadTourneys()
          this.popup.active = await false
        },
        '',
        'Run all tourneys?'
      )
    },
    confirmPopup(func, message = '', title = 'Are you sure?', html = false) {
      this.popup.button = ''
      if (func !== false) {
        this.$once('confirmPopup', func)
        this.popup.button = 'Confirm'
      }

      this.popup.loading = false
      this.popup.html = html
      this.popup.active = true
      this.popup.title = title
      this.popup.message = message
    }
  },
  components: {
    CommonButton,
    TourneyListItem,
    SimplePopup,
    TourneyPopup
  },
  destroyed() {
    this.scrollEnabled = false
  },
  middleware: 'requiresOrganisator'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.tourneys-wrapper
  .l-filters
    padding: 5px 0 20px 0
  .panel-content
    .filters
      padding: 15px 0
    .tourneys-list
      position: relative
      display: grid
      width: 100%
      grid-template-columns: auto 1fr auto auto
      grid-gap: 30px
      align-items: center
      
.offset-counter
  visibility: hidden
</style>
