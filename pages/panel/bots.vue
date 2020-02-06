<template>
  <div class="bots-wrapper wrapper">
    <div
      class="m-universal-block panel-block"
      v-for="(block, blockIndex) in blocks"
      :key="blockIndex"
    >
      <div class="ub-dark-top panel-header">
        <div>
          <h2 class="title">{{ block.organisator }}</h2>
          <span class="hint">Updated: {{ dateFromNow(block.lastUpdate) }}</span>
        </div>

        <div class="buttons-wrapper">
          <common-button :round="true" @click.native.stop="stopAll(block.organisator)">
            <i class="fas fa-pause"></i>
          </common-button>

          <common-button :round="true" @click.native.stop="runAll(block.organisator)">
            <i class="fas fa-play"></i>
          </common-button>
        </div>
      </div>

      <div class="ub-content panel-content">
        <div
          class="bot-sector"
          v-for="(bot, botIndex) in block.bots"
          :class="{loading: bot.result.status === 0,
          finish: bot.result.status === -1 || bot.result.status === 1 }"
          :key="botIndex"
        >
          <common-button
            v-if="bot.result.status === undefined"
            @click.native="launchBot(block.id, bot.game, blockIndex, botIndex)"
          >{{ bot.game }}</common-button>

          <!-- LOADING -->
          <div class="loading-spinner" v-if="bot.result.status === 0">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <span class="message" v-if="bot.result.status === 0">Loading...</span>

          <!-- SUCCESS -->
          <common-button
            :round="true"
            v-if="bot.result.status === 1"
            @click.native.stop="runAll(block.organisator, bot.game)"
          >
            <i class="fas fa-play"></i>
          </common-button>
          <div class="notification" v-if="bot.result.status === 1">
            <h3 class="result">Success</h3>
            <span class="message">{{ bot.result.message }}</span>
          </div>

          <!-- ERROR -->
          <common-button
            :round="true"
            v-if="bot.result.status === -1"
            @click.native="launchBot(block.id, bot.game, blockIndex, botIndex)"
          >
            <i class="fas fa-redo"></i>
          </common-button>
          <div class="notification" v-if="bot.result.status === -1">
            <h3 class="result">Error</h3>
            <span class="message">{{ bot.result.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="run-all-wrapper">
      <div class="run-all" @click="runEverything">Run all bots</div>
    </div>

    <simple-popup :title="'Message'" :loading="popup.loading" v-if="popup.active">
      <h3 class="title" v-if="popup.title">{{ popup.title }}</h3>
      <p class="message" v-if="popup.message">{{ popup.message }}</p>
      <common-button v-if="popup.button" @click.native="$emit('confirmPopup')">{{ popup.button }}</common-button>
    </simple-popup>
  </div>
</template>

<script>
import CommonButton from '@/components/elements/CommonButton.vue'
import SimplePopup from '@/components/elements/SimplePopup.vue'
import Joi from 'joi'
import moment from 'moment'

export default {
  layout: 'panel',
  data() {
    return {
      popup: {
        message: '',
        title: '',
        loading: false,
        button: '',
        active: false
      },
      blocks: []
    }
  },
  created() {
    return this.$router.push('/panel')
    this.$axios
      .get('/api/bots/list')
      .then(res => {
        for (let bot of res.data) {
          bot.bots = []

          for (let game of bot.games) {
            bot.bots.push({ game: game, result: { status: undefined } })
          }
        }
        this.blocks = res.data
      })
      .catch(err => console.log(err))
  },
  mounted() {},
  watch: {},
  methods: {
    dateFromNow(date) {
      return moment(date).fromNow()
    },
    runAll(org, game = null) {
      this.popup.loading = false
      this.popup.active = true
      this.popup.title = 'Are you sure?'
      this.popup.message = `You are going to RUN all tourneys by ${org}`
      this.popup.button = 'Confirm'
      this.$once('confirmPopup', async () => {
        this.popup.title = ''
        this.popup.message = ''
        this.popup.button = ''
        this.popup.loading = true
        let answer = await this.$axios
          .post(`/api/tourneys/set-status`, { organisator: org, game })
          .then(res => {
            this.popup.loading = false
            this.popup.title = 'Successfully updated.'
            this.popup.message = ''
          })
          .catch(err => console.log('Error occured.'))
      })
    },
    runEverything(e) {
      e.toElement.innerText = 'Query has been sent. Tourneys will appear soon.'
      this.$axios
        .get(`/api/bots/all`)
        .then(res => {
          e.toElement.innerText = res.data
        })
        .catch(err => {
          e.toElement.innerText = 'Error occured.'
        })
    },
    stopAll(org, game) {
      this.popup.loading = false
      this.popup.active = true
      this.popup.title = 'Are you sure?'
      this.popup.message = `You are going to STOP all tourneys by ${org}`
      this.popup.button = 'Confirm'
      this.$once('confirmPopup', async () => {
        this.popup.title = ''
        this.popup.message = ''
        this.popup.button = ''
        this.popup.loading = true

        let answer = await this.$axios
          .post(`/api/tourneys/set-status`, {
            organisator: org,
            game,
            status: 0
          })
          .then(res => {
            this.popup.loading = false
            this.popup.title = 'Successfully updated.'
            this.popup.message = ''
          })
          .catch(err => console.log('Error occured.'))
      })
    },
    launchBot(org, game, blockIndex, botIndex) {
      this.blocks[blockIndex].bots[botIndex].result.status = 0
      let result = this.$axios
        .post(`/api/bots/${org}`, { game: game })
        .then(res => {
          this.blocks[blockIndex].lastUpdate = new Date()
          this.blocks[blockIndex].bots[botIndex].result.status = 1
          this.blocks[blockIndex].bots[botIndex].result.message = `Added ${
            res.data
          } tourneys.`
        })
        .catch(err => {
          this.blocks[blockIndex].bots[botIndex].result.status = -1
        })
    }
  },
  components: {
    CommonButton,
    SimplePopup
  },
  middleware: 'requiresModerator'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.run-all-wrapper
  width: 100%
  font-size: .8rem
  padding: 7.5px
  text-transform: uppercase
  opacity: .3
  .run-all
    display: inline-block
    cursor: pointer

.bots-wrapper
  display: flex !important
  flex-wrap: wrap
  justify-content: flex-start
  align-items: flex-start
  .panel-block
    margin-bottom: 15px
    margin-right: 7.5px
    margin-left: 7.5px
    .panel-header
      padding: 10px 15px
      grid-gap: 15px
      .title
        text-transform: uppercase
        font-size: 1.4rem
        font-weight: 100
      .hint
        font-size: .8rem
        margin-right: 15px
        font-weight: 100
        color: rgba(255, 255, 255, .3)
    .panel-content
      padding-left: 0
      padding-right: 0
      display: flex
      flex-wrap: wrap
      align-items: center
      .bot-sector
        padding-right: 15px
        padding-left: 15px
        padding-bottom: 7.5px
        padding-top: 7.5px
        display: grid
        justify-items: flex-start
        .hint
          font-size: .8rem
          margin-right: 15px
          font-weight: 100
          color: rgba(255, 255, 255, .3)
        .button:not(.round)
          margin-top: 5px
          font-size: 1.2rem
          padding-left: 50px
          padding-right: 50px
        &.loading
          justify-items: center
          padding-left: 50px
          padding-right: 50px
          .loading-spinner
            margin-top: 5px
            font-size: 2rem
          .message
            font-size: .8rem
            text-align: center
            font-weight: 100
            color: rgba(255, 255, 255, .3)
        &.finish
          grid-auto-flow: column
          align-items: center
          grid-gap: 10px
          .notification
            .result
              font-size: 2.2rem
              font-weight: 600
              margin: 0
            .message
              font-size: 1rem
              text-align: center
              font-weight: 100
              color: rgba(255, 255, 255, .3)
      
      @include respond-to(sm)
        justify-content: center
        grid-template-columns: auto
        .bot-sector
          .hint
            text-align: center
            margin-left: 10px

    

</style>
