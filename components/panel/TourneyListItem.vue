<template>
  <div class="item" :class="{ unactive: data.status !== 1}">
    <div class="icons">
      <div class="icon-wrapper" @click="info()" v-tooltip.top-end="'Info'">
        <i class="fas fa-question-circle"></i>
      </div>
      <div
        class="icon-wrapper"
        v-if="data.status !== 1"
        @click="remove()"
        v-tooltip.top-end="'Remove'"
      >
        <i class="fas fa-trash"></i>
      </div>
      <div class="icon-wrapper" v-if="data.status == 1" @click="open()" v-tooltip.top-end="'Open'">
        <i class="fas fa-external-link-square-alt"></i>
      </div>
      <div class="icon-wrapper" @click="edit()" v-tooltip.top-end="'Edit'">
        <i class="fas fa-edit"></i>
      </div>
      <div class="icon-wrapper" v-if="data.status == 1" @click="stop()" v-tooltip.top-end="'Stop'">
        <i class="fas fa-stop-circle"></i>
      </div>
      <div class="icon-wrapper" v-if="data.status == 0" @click="run()" v-tooltip.top-end="'Run'">
        <i class="fas fa-play-circle"></i>
      </div>
    </div>
    <div class="title">{{ data.title }}</div>
    <div class="date">{{ tourneyDate }}</div>
    <div class="addedby">{{ data.addedby }}</div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  created() {
    moment.locale('en')
  },
  computed: {
    tourneyDate() {
      return moment(this.data.dateAdded).format('MMMM D, HH:mm:ss')
    }
  },
  methods: {
    info() {
      let {
        id,
        title,
        addedby,
        organisator,
        views,
        followings,
        date,
        dateAdded
      } = this.data
      this.$parent.confirmPopup(
        false,
        `<b>Id</b>: ${id}<br>
        <b>Added by</b>: ${addedby}<br>
        <b>Organisator</b>: ${organisator}<br>
        <b>Views</b>: ${views}<br>
        <b>Followings</b>: ${followings}<br>
        <b>Date of the event</b>: ${date}<br>
        <b>Added on</b>: ${dateAdded}`,
        title + ':',
        true
      )
    },
    open() {
      this.$store.dispatch('setFullTournament', this.data.id)
      this.$parent.activePopup = true
    },
    edit() {
      this.$router.push({
        name: `panel-edit`,
        params: { edit: this.data.id }
      })
    },
    async stop() {
      // LIKE RUN()
      await this.$parent.confirmPopup(async () => {
        await this.$axios
          .post('/api/tourneys/edit', { id: this.data.id, status: 0 })
          .catch(err => console.log(err))

        let { data: update } =
          (await this.$axios
            .post('/api/tourneys/admin-list', { id: this.data.id })
            .catch(err => console.log(err))) || []

        this.$parent.tourneys[this.$vnode.key] = await update[0]

        this.$parent.popup.active = await false
      }, 'You are going to HIDE tourney: ' + this.data.title)
    },
    async run() {
      await this.$parent.confirmPopup(async () => {
        await this.$axios
          .post('/api/tourneys/edit', { id: this.data.id, status: 1 })
          .catch(err => console.log(err))

        let { data: update } =
          (await this.$axios
            .post('/api/tourneys/admin-list', { id: this.data.id })
            .catch(err => console.log(err))) || []

        this.$parent.tourneys[this.$vnode.key] = await update[0]

        this.$parent.popup.active = await false
      }, 'You are going to RUN tourney: ' + this.data.title)
    },
    async remove() {
      await this.$parent.confirmPopup(async () => {
        await this.$axios
          .post('/api/tourneys/delete', { id: this.data.id })
          .catch(err => console.log(err))

        this.$parent.tourneys.splice(this.$vnode.key, 1)

        this.$parent.popup.active = await false
      }, 'You are going to REMOVE tourney: ' + this.data.title)
    }
  }
}
</script>
<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.item
  display: contents
  &.unactive
    .title, .date, .addedby
      opacity: .3
  .icons
    font-size: .9rem
    letter-spacing: 2px
    .icon-wrapper
      display: inline-block
      position: relative
    .fas
      cursor: pointer !important
      transition: .25s ease
      &:hover
        color: $lightBlue
  .title, .date, .addedby
    font-size: 1.1rem !important
</style>

