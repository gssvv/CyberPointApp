<template>
  <div class="l-contents">
    <div class="column wide">
      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header">Дополнительно:</div>
        <div class="ub-content block-content" v-html="tourney.block1"></div>
      </div>
    </div>

    <div class="column">
      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header">Призовой фонд:</div>
        <div class="ub-content block-content" v-html="tourney.block2"></div>
      </div>

      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header organisator-header">
          <img
            v-if="tourney.organisator"
            :src="`/organisators/${tourney.organisator.toLowerCase()}.png`"
            alt
          >
        </div>
        <div class="ub-content block-content organisator-content">
          <h2>{{ tourney.organisator }}</h2>
          <p>
            <a :href="tourney.link">Перейти на сайт организатора</a>
          </p>
        </div>
      </div>
    </div>

    <div class="column">
      <vk-widget :game="tourney.game"/>

      <!-- APPLICATIONS -->
      <!-- <div class="m-universal-block light item">
        <div class="ub-dark-top block-header players-header">
          <a>
            Поиск тиммейтов
            <span class="unactive">23</span>
          </a>
          <a class="button add-player-button">
            <span>
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </div>
        <div class="ub-content block-content players-content">
          <div class="item">
            <div class="nickname">Ник:</div>
            <div class="role">Роль:</div>
            <div class="rating">Рейтинг:</div>
          </div>

          <div class="item">
            <div class="nickname">EasygGem</div>
            <div class="role">Support</div>
            <div class="rating">3200MMR</div>
          </div>

          <div class="item">
            <div class="nickname">EasygGem</div>
            <div class="role">Support</div>
            <div class="rating">3200MMR</div>
          </div>

          <div class="item">
            <div class="nickname">EasygGem</div>
            <div class="role">Support</div>
            <div class="rating">3200MMR</div>
          </div>

          <div class="item">
            <div class="nickname">EasygGem</div>
            <div class="role">Support</div>
            <div class="rating">3200MMR</div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import VkWidget from '@/components/vkWidget'
export default {
  props: {
    tourney: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  components: {
    VkWidget
  }
}
</script>

<style lang="sass">
@import '@/assets/style/_variables.sass'
#vk_groups
  @include shadow(1)

.column
  display: grid
  grid-gap: 20px
  @include respond-to(lg)
    &.wide
      grid-column: 1/3
  @include respond-to(md)
    &.wide
      grid-column: 1/2
  .item
    .block-header
      grid-auto-flow: column
      justify-content: flex-start
      align-items: center
    .block-content
      padding: 10px
      display: block
      b
        font-weight: 600
      ol, ul
        padding-left: 20px
    .organisator-header
      padding: 15px 10px
      justify-content: center
    .organisator-content
      padding: 20px 10px
      h2
        font-size: 1.6rem
        font-weight: 100
        text-transform: uppercase
        text-align: center
        margin: 0
      p
        margin: 0
        text-align: center
        a
          text-decoration: none
          color: $lightBlue
          &:hover
            color: $paleBlue
    .players-header
      justify-content: space-between
      .unactive
        margin-left: 7px
        font-size: .9em
      .add-player-button
        margin-top: 0
        padding: 0px
        height: 40px
        width: 40px
        display: grid
        justify-content: center
        align-items: center
        border-radius: 50%
        cursor: pointer
        &:after
          border-radius: 50%
    .players-content
      padding: 0
      .item
        display: grid
        grid-template-columns: 4fr 3fr 3fr
        padding: 10px 10px
        &:nth-child(even)
          background-color: $darkBlue2
        &:first-child
          color: #626B7A
          padding-top: 5px
          padding-bottom: 5px
</style>
