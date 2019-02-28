<template>
  <div class="bots-wrapper wrapper">
    <div
      class="m-universal-block panel-block"
      v-for="(block, blockIndex) in blocks"
      :key="blockIndex"
    >
      <div class="ub-dark-top panel-header">
        <h2 class="title">{{ block.title }}</h2>

        <div class="buttons-wrapper">
          <common-button :round="true" @click.native.stop="stopAll(block.id, block.title)">
            <i class="fas fa-pause"></i>
          </common-button>

          <common-button :round="true" @click.native.stop="runAll(block.id, block.title)">
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
          <span
            class="hint"
            v-if="bot.result.status === undefined"
          >Last update: {{ bot.lastUpdate }}</span>
          <common-button
            v-if="bot.result.status === undefined"
            @click.native="launchBot(blockIndex, botIndex, bot.id)"
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
            @click.native.stop="runAll(block.id, block.title)"
          >
            <i class="fas fa-play"></i>
          </common-button>
          <div class="notification" v-if="bot.result.status === 1">
            <h3 class="result">Готово!</h3>
            <span class="message">{{ bot.result.message }}</span>
          </div>

          <!-- ERROR -->
          <common-button
            :round="true"
            v-if="bot.result.status === -1"
            @click.native="launchBot(blockIndex, botIndex, bot.id)"
          >
            <i class="fas fa-redo"></i>
          </common-button>
          <div class="notification" v-if="bot.result.status === -1">
            <h3 class="result">Ошибка</h3>
            <span class="message">{{ bot.result.message }}</span>
          </div>
        </div>
      </div>
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
      blocks: [
        {
          title: 'Epulze',
          id: 1,
          bots: [
            {
              id: 2,
              game: 'Dota 2',
              lastUpdate: '12 Jun 12:23',
              result: {
                status: undefined
              }
            },
            {
              id: 3,
              game: 'CS:GO',
              lastUpdate: '12 Jun 00:00',
              result: {
                status: undefined
              }
            }
          ]
        },
        {
          title: 'Epulze',
          id: 1,
          bots: [
            {
              id: 2,
              game: 'Dota 2',
              lastUpdate: '12 Jun 12:23',
              result: {
                status: undefined
              }
            },
            {
              id: 3,
              game: 'CS:GO',
              lastUpdate: '12 Jun 00:00',
              result: {
                status: undefined
              }
            }
          ]
        }
      ]
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    runAll(id, org) {
      this.popup.loading = false
      this.popup.active = true
      this.popup.title = 'Are you sure?'
      this.popup.message = `You are going to RUN all tourneys by ${org}`
      this.popup.button = 'Confirm'
      this.$on('confirmPopup', async () => {
        this.popup.title = ''
        this.popup.message = ''
        this.popup.button = ''
        this.popup.loading = true
        // let answer = await this.$axios.post(`/api/bots/runallby/${id}`)
        // HARDCODED
        let asnwer = {
          title: 'Success',
          message: '52 tourneys are hidden'
        }
        this.popup.loading = false
        this.popup.title = asnwer.title
        this.popup.message = asnwer.message
      })
    },
    stopAll(id, org) {
      this.popup.loading = false
      this.popup.active = true
      this.popup.title = 'Are you sure?'
      this.popup.message = `You are going to STOP all tourneys by ${org}`
      this.popup.button = 'Confirm'
      this.$on('confirmPopup', async () => {
        this.popup.title = ''
        this.popup.message = ''
        this.popup.button = ''
        this.popup.loading = true
        // let answer = await this.$axios.post(`/api/bots/stopallby/${id}`)
        // HARDCODED
        let asnwer = {
          title: 'Success',
          message: '52 tourneys are hidden'
        }
        this.popup.loading = false
        this.popup.title = asnwer.title
        this.popup.message = asnwer.message
      })
    },
    async launchBot(blockIndex, botIndex, id) {
      this.blocks[blockIndex].bots[botIndex].result.status = 0
      // let result = await this.$axios.post(`/api/bots/launch/${id}`)
      // HARDCODED
      let result = await new Promise(res => {
        setTimeout(() => {
          res({
            status: 1,
            message: 'Турниров добавлено: 28'
          })
        }, 2000)
      })

      this.blocks[blockIndex].bots[botIndex].result = result
    },
    async confirmAll(id) {
      // let result = await this.$axios.post(`/api/bots/launch/${id}`)
      // HARDCODED
      let result = await {
        answer: 'Success!',
        message: '28 tourneys confirmed'
      }
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
      .title
        text-transform: uppercase
        font-size: 1.4rem
        font-weight: 100
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
