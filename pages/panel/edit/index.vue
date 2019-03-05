<template>
  <div class="editor-wrapper wrapper">
    <div class="m-universal-block panel-block">
      <div class="ub-dark-top panel-header">
        <h2 class="title">{{ pageTitle }}</h2>
      </div>
      <div class="ub-content panel-content">
        <div class="form-wrapper">
          <form class="tourney-form">
            <div class="group">
              <field-text
                v-model="tourney.title.val"
                :error="tourney.title.err"
                :success="tourney.title.suc"
                :title="tourney.title.title"
              />

              <field-select
                v-model="tourney.status.val"
                :error="tourney.status.err"
                :success="tourney.status.suc"
                :title="tourney.status.title"
                :options="tourney.status.options"
              />
            </div>

            <div class="group">
              <field-select
                v-model="tourney.game.val"
                :error="tourney.game.err"
                :success="tourney.game.suc"
                :title="tourney.game.title"
                :options="tourney.game.options"
              />

              <field-select
                v-model="tourney.matchMode.val"
                :error="tourney.matchMode.err"
                :success="tourney.matchMode.suc"
                :title="tourney.matchMode.title"
                :options="tourney.matchMode.options"
              />

              <field-select
                v-model="tourney.teamMode.val"
                :error="tourney.teamMode.err"
                :success="tourney.teamMode.suc"
                :title="tourney.teamMode.title"
                :options="tourney.teamMode.options"
              />
            </div>

            <div class="group">
              <div class="m-field tf-field">
                <div class="label">Date:</div>
                <datetime
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  v-model="tourney.date.val"
                  :input-class="{input: true, inputText: true, success: tourney.date.suc, error: tourney.date.err }"
                ></datetime>
                <span class="info">{{ tourney.date.val }}</span>
                <span class="error">{{ tourney.date.err }}</span>
              </div>

              <field-text
                v-model="tourney.organisator.val"
                :error="tourney.organisator.err"
                :success="tourney.organisator.suc"
                :title="tourney.organisator.title"
              />

              <field-checkbox
                v-model="tourney.applications.val"
                :error="tourney.applications.err"
                :success="tourney.applications.suc"
                :title="tourney.applications.title"
              />
            </div>

            <field-text
              v-model="tourney.link.val"
              :error="tourney.link.err"
              :success="tourney.link.suc"
              :title="tourney.link.title"
              :placeholder="tourney.link.placeholder"
            />

            <field-textarea
              v-model="tourney.block1.val"
              :error="tourney.block1.err"
              :success="tourney.block1.suc"
              :title="tourney.block1.title"
            />

            <field-textarea
              v-model="tourney.block2.val"
              :error="tourney.block2.err"
              :success="tourney.block2.suc"
              :title="tourney.block2.title"
            />

            <div class="group">
              <field-select
                v-model="tourney.players.val"
                :error="tourney.players.err"
                :success="tourney.players.suc"
                :title="tourney.players.title"
                :options="tourney.players.options"
              />

              <field-text
                v-model="tourney.price.val"
                :error="tourney.price.err"
                :success="tourney.price.suc"
                :title="tourney.price.title"
                :placeholder="tourney.price.placeholder"
                :info="tourney.price.info"
              />

              <field-text
                v-model="tourney.prize.val"
                :error="tourney.prize.err"
                :success="tourney.prize.suc"
                :title="tourney.prize.title"
                :placeholder="tourney.prize.placeholder"
                :info="tourney.prize.info"
              />
            </div>
            <!-- image-loader -->
            <div class="group mobile jcse">
              <common-button @click.native="send()">Save</common-button>
              <common-button @click.native="check()">Check</common-button>
            </div>
            <div class="group mobile jcse">
              <field-checkbox
                v-model="sendAsCopy"
                :title="'New tournament'"
                v-tooltip="'Add new tourney with current info.'"
              />
            </div>
            <div class="group mobile jcse message">{{ message }}</div>
          </form>
        </div>
      </div>
    </div>

    <tourney-popup :active="activePopup"/>
  </div>
</template>
  

<script>
import FieldText from '@/components/elements/FieldText.vue'
import FieldSelect from '@/components/elements/FieldSelect.vue'
import FieldCheckbox from '@/components/elements/FieldCheckbox.vue'
import FieldTextarea from '@/components/elements/FieldTextarea.vue'
import CommonButton from '@/components/elements/CommonButton.vue'
import TourneyPopup from '@/components/tourneys/TourneyPopup.vue'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Joi from 'joi'
import _ from 'lodash'
export default {
  layout: 'panel',
  data() {
    return {
      pageTitle: 'Add Tournament',
      message: '',
      sendAsCopy: false,
      tourney: {
        id: {
          val: null,
          suc: true,
          schema: Joi
        },
        title: {
          title: 'Title',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(3)
            .max(100)
            .required()
        },
        status: {
          title: 'Access',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Close',
              val: 0
            },
            {
              title: 'Public',
              val: 1
            }
          ],
          schema: Joi.number().required()
        },
        game: {
          title: 'Game',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Dota 2',
              val: 'Dota 2'
            },
            {
              title: 'CS:GO',
              val: 'CS:GO'
            },
            {
              title: 'PUBG',
              val: 'PUBG'
            },
            {
              title: 'Hearthstone',
              val: 'Hearthstone'
            }
          ],
          schema: Joi.string()
            .min(1)
            .required()
        },
        matchMode: {
          title: 'Match Mode',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Best of 1',
              val: 'Best of 1'
            },
            {
              title: 'Best of 2',
              val: 'Best of 2'
            },
            {
              title: 'Best of 3',
              val: 'Best of 3'
            },
            {
              title: 'Best of 4',
              val: 'Best of 4'
            },
            {
              title: 'Best of 5',
              val: 'Best of 5'
            }
          ],
          schema: Joi.string()
            .min(1)
            .empty('')
        },
        teamMode: {
          title: 'Team Mode',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: '1v1',
              val: '1v1'
            },
            {
              title: '5v5',
              val: '5v5'
            },
            {
              title: 'SOLO FPP',
              val: 'SOLO FPP'
            },
            {
              title: 'DUO FPP',
              val: 'DUO FPP'
            },
            {
              title: 'SQUAD FPP',
              val: 'SQUAD FPP'
            },
            {
              title: 'SOLO TPP',
              val: 'SOLO TPP'
            },
            {
              title: 'DUO TPP',
              val: 'DUO TPP'
            },
            {
              title: 'SQUAD TPP',
              val: 'SQUAD TPP'
            }
          ],
          schema: Joi.string()
            .min(1)
            .empty('')
        },
        date: {
          title: 'Date',
          val: '',
          suc: false,
          err: '',
          schema: Joi.date().required()
        },
        organisator: {
          title: 'Organisator',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(1)
            .required()
        },
        applications: {
          title: 'Team search',
          val: true,
          suc: true,
          err: '',
          schema: Joi.required()
        },
        link: {
          title: 'Link',
          val: '',
          suc: false,
          err: '',
          placeholder: 'https://organisat.or',
          schema: Joi.string()
            .min(1)
            .max(255)
            .required()
        },
        block1: {
          title: 'Additional Information',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(10)
            .max(3000)
            .required()
        },
        block2: {
          title: 'Prize pool information',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(3)
            .max(3000)
            .required()
        },
        players: {
          title: 'Players',
          val: '',
          suc: true,
          err: '',
          options: [
            {
              title: '1',
              val: 1
            },
            {
              title: '2',
              val: 2
            },
            {
              title: '3',
              val: 3
            },
            {
              title: '4',
              val: 4
            },
            {
              title: '5',
              val: 5
            }
          ],
          info: 'In a one team.',
          schema: Joi.number().empty('')
        },
        price: {
          title: 'Participation fee',
          val: '',
          suc: true,
          err: '',
          placeholder: '$10',
          info: 'For one player. Leave blank if free.',
          schema: Joi.string()
            .max(20)
            .empty('')
        },
        prize: {
          title: 'Prize',
          val: '',
          suc: true,
          err: '',
          placeholder: '$200',
          info: "Leave blank if it isn't money: € $ ₽",
          schema: Joi.string()
            .max(20)
            .empty('')
        }
      },
      activePopup: false
    }
  },
  created() {},
  mounted() {
    if (this.$route.params != {}) {
      if (this.$route.params.edit) {
        this.pageTitle = 'Edit Tournament'
        this.loadTourney(this.$route.params.edit)
        // load tourney with id
      }
    }
  },
  watch: {
    'tourney.title.val'() {
      this.validate('title')
    },
    'tourney.status.val'() {
      this.validate('status')
    },
    'tourney.game.val'() {
      this.validate('game')
    },
    'tourney.matchMode.val'() {
      this.validate('matchMode')
    },
    'tourney.teamMode.val'() {
      this.validate('teamMode')
    },
    'tourney.date.val'() {
      this.validate('date')
    },
    'tourney.organisator.val'() {
      this.validate('organisator')
    },
    'tourney.applications.val'() {
      this.validate('applications')
    },
    'tourney.link.val'() {
      this.validate('link')
    },
    'tourney.block1.val'() {
      this.validate('block1')
    },
    'tourney.block2.val'() {
      this.validate('block2')
    },
    'tourney.players.val'() {
      this.validate('players')
    },
    'tourney.price.val'() {
      this.validate('price')
    },
    'tourney.prize.val'() {
      this.validate('prize')
    },
    activePopup: function(val) {
      document.body.style.overflow = val ? 'hidden' : ''
    }
  },
  methods: {
    async loadTourney(id) {
      let { data: tourney } =
        (await this.$axios
          .post('/api/tourneys/admin-list', { id: id, full: true })
          .catch(err => console.log(err))) || []

      if (tourney == undefined) return console.log('Tourney is not found.')

      tourney = tourney[0]

      _.mapKeys(this.tourney, function(value, key) {
        value.val = tourney[key]
      })
    },
    validate(fieldName) {
      let field = this.tourney[fieldName]
      let { error } = Joi.validate(field.val, field.schema)
      if (error) {
        field.suc = false
        field.err = error.message.split('"')[2]
      } else {
        field.err = ''
        field.suc = true
      }
    },
    getTourneyObject() {
      let tourney = {}
      _.mapKeys(this.tourney, function(value, key) {
        tourney[key] = value.val
      })
      tourney.applications = tourney.applications ? [] : undefined
      return tourney
    },
    check() {
      let tourney = this.getTourneyObject()
      _.mapKeys(this.tourney, function(value, key) {
        tourney[key] = value.val
      })
      console.log(tourney)
      this.$store.commit('SET_FULL_TOURNAMENT', tourney)
      this.activePopup = true
    },
    send() {
      let error
      _.mapKeys(this.tourney, function(value, key) {
        if (!value.suc) {
          value.err = ' '
          error = true
        }
      })
      if (!error) {
        // add new tourney
        if (!this.tourney.id.val || this.sendAsCopy) {
          this.message = 'Loading...'
          this.$axios
            .post('/api/tourneys/add', this.getTourneyObject())
            .catch(err => console.log(err))
            .then(res => {
              let id = res.data.id
              this.tourney.id.val = id
              this.message =
                'Tourney successfully added! You can find it in the tourneys panel. Id is ' +
                id
              this.pageTitle = 'Edit Tournament'
            })
        } else if (this.tourney.id.val) {
          this.message = 'Loading...'
          this.$axios
            .post('/api/tourneys/edit/', this.getTourneyObject())
            .catch(err => console.log(err))
            .then(res => {
              this.message = 'Tourney saved.'
            })
        }
      } else {
        this.message = 'There are incorrect fields.'
      }
    }
  },
  components: {
    FieldText,
    FieldSelect,
    FieldCheckbox,
    FieldTextarea,
    CommonButton,
    TourneyPopup,
    Datetime
  },
  middleware: 'requiresOrganisator'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.editor-wrapper
  .panel-block
    .panel-header
      
    .panel-content
      .form-wrapper
        width: 100%
        display: grid
        justify-content: center
        grid-template-columns: minmax(auto, 700px)
        grid-gap: 10px 15px
        .tourney-form
          display: contents
          .button
            justify-self: flex-start
            @include respond-to(sm)
              font-size: .9rem
          .group
            align-items: flex-start
            display: grid
            grid-auto-flow: column
            grid-gap: 10px 15px
            &.jcse
              justify-content: flex-end
            &.message
              font-size: .9rem
              opacity: .5
            @include respond-to(sm)
              &:not(.mobile)
                grid-auto-flow: row
          .tf-field
            grid-template-columns: 100%
            &.checkbox-wrapper
              grid-template-columns: auto auto
              justify-content: center
              align-items: center
              align-self: center
              cursor: pointer
              @include respond-to(sm)
                justify-content: flex-start
</style>
