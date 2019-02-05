<template>
  <div class="l-contents">
    <div class="column wide">
      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header">Дополнительно:</div>
        <div class="ub-content block-content">
          <p>
            <b>Правила:</b>
          </p>

          <ul>
            <li>Нельзя намеренно использовать баги игры</li>
            <li>Использование читов наказывается баном</li>
            <li>Игрокам необходимо записывать реплеи игры и хранить их в течение 7 дней</li>
            <li>Игрокам необходимо сделать скриншот "экрана завершения игры" в случае краша игры на во время турнира</li>
            <li>Игроки с оскорбительными никнеймами будут дисквалифицированы.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="column">
      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header">Призовой фонд:</div>
        <div class="ub-content block-content">
          <p>1. 120$
            <br>2. 50$
            <br>3. 30$
          </p>
        </div>
      </div>
    </div>

    <div class="column">
      <div class="m-universal-block light item">
        <div class="ub-dark-top block-header organisator-header">
          <img src="/tourneys-page/tourney-logo.png" alt>
        </div>
        <div class="ub-content block-content organisator-content">
          <h2>ChallangerMode</h2>
          <p>
            <a href="#">Перейти на сайт организатора</a>
          </p>
        </div>
      </div>

      <div class="m-universal-block light item">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.column
  display: grid
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
    ul
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
