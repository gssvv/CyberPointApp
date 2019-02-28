<template>
  <div>
    <div class="l-panel-wrapper">
      <div class="l-admin-sider">
        <div class="header">
          <h2 class="username" v-if="user._id">
            <i class="fas fa-user-circle"></i>
            <span>{{ user.username }}</span>
          </h2>
          <h4 class="post">{{ user.privilege || 'Login required' }}</h4>
        </div>
        <div class="menu">
          <ul>
            <!-- <nuxt-link tag="li" to="/panel/stats" active-class="active">
              <a>
                <i class="fas fa-chart-pie icon"></i>
                <span>Stats</span>
              </a>
            </nuxt-link>-->
            <nuxt-link tag="li" to="/panel/tourneys" active-class="active">
              <a>
                <i class="fas fa-trophy icon"></i>
                <span>Tourneys</span>
              </a>
            </nuxt-link>

            <nuxt-link tag="li" to="/panel/bots" active-class="active">
              <a>
                <i class="fas fa-robot icon"></i>
                <span>Bots</span>
              </a>
            </nuxt-link>

            <nuxt-link tag="li" to="/panel/users" active-class="active">
              <a>
                <i class="fas fa-users icon"></i>
                <span>Users</span>
              </a>
            </nuxt-link>

            <nuxt-link @click.native="$store.dispatch('signOut')" tag="li" to="/">
              <a>
                <i class="fas fa-sign-out-alt icon"></i>
                <span>Sign out</span>
              </a>
            </nuxt-link>
          </ul>
        </div>
      </div>
      <div class="l-panel-content">
        <nuxt/>
        <!-- //= templates/admin-panel/tourneys.html -->
        <!-- //= templates/admin-panel/editor.html -->
        <!-- //= templates/admin-panel/bots.html -->
      </div>
    </div>
  </div>
</template>
<script>
import FooterComponent from '@/components/FooterComponent'
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      user: state => state.currentUser
    })
  },
  components: {
    FooterComponent
  }
}
</script>

<style lang="sass">
@import '@/assets/style/_variables.sass'

.l-panel-wrapper
  overflow-y: hidden
  display: grid
  grid-template-columns: 300px 1fr
  min-height: 100vh
  @include respond-to(lg)
    grid-template-columns: 1fr
  .l-admin-sider
    z-index: 5
    display: grid
    grid-template-rows: auto 1fr
    @include shadow(2)
    background-color: $darkBlue1
    .header
      background-color: $colorfulBlue
      padding: 50px 15px
      display: grid
      align-items: center
      justify-content: center
      text-align: center
      .username
        font-size: 2rem
        font-weight: 400
        margin: 0
        line-height: 1
      .post
        font-size: .9rem
        text-transform: uppercase
        font-weight: 100
        margin: 0
        margin-top: 2px
    .menu
      padding: 30px 15px
      ul
        list-style-type: none
        padding: 0
        width: 100%
        margin: 0
        li
          a
            text-decoration: none
            font-size: 1.2rem
            padding: 15px
            color: $paleBlue
            display: block
            .icon
              margin-right: 10px
            &:hover
              color: #fff
          &.active
            a
              background-color: $darkBlue2
    @include respond-to(lg)
      position: fixed
      width: 100%
      bottom: 0
      box-shadow: 0 3px 3px rgba(0,0,0,.16), 0 -3px 6px rgba(0,0,0,.23)
      .header
        display: none
      .menu
        padding: 0
        ul
          display: grid
          grid-auto-flow: column
          li
            a
              padding-left: 15px
              padding-right: 15px
              text-align: center
              .icon
                margin-right: 0
              span
                display: none

  .l-panel-content
    padding: 30px
    >.wrapper
      margin: auto
      display: grid
      max-width: 1200px
      .title
        font-size: 2rem
        font-weight: 400
        margin: 0
      .panel-header
        grid-auto-flow: column
        padding: 15px 30px
        justify-content: space-between
        align-items: center
        .buttons-wrapper
          display: grid
          grid-auto-flow: column
          grid-gap: 10px
        .run-all
          .fa-play
            left: 2px
      .panel-content
        padding: 15px 30px
    
    @include respond-to(lg)
      padding: 15px
      padding-bottom: 75px
      >.wrapper
        .panel-header, .panel-content
          padding-left: 15px
          padding-right: 15px

    @include respond-to(md)
      >.wrapper
        .panel-content
          .tourneys-list
            grid-template-columns: auto 1fr auto
            .item
              .title, .date, .addedby
                font-size: 1rem
              .addedby
                display: none
                
    @include respond-to(sm)
      >.wrapper
        .panel-content
          .tourneys-list
            grid-gap: 30px 15px
            grid-template-columns: auto 1fr
            .item
              .date
                display: none
              .icons
                display: grid
                grid-template-columns: auto
                grid-auto-flow: column
                letter-spacing: 0px
                grid-gap: 10px 5px
</style>
