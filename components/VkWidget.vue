<template>
  <div>
    <script type="text/javascript" src="https://vk.com/js/api/openapi.js?160"></script>
    <!-- VK Widget -->
    <div id="vk_groups" ref="vkWrapper"></div>
  </div>
</template>
<script>
export default {
  props: {
    game: String
  },
  mounted() {
    this.updatePlugin()
  },
  watch: {
    game() {
      let { vkWrapper } = this.$refs
      vkWrapper.innerHTML = ''
      this.updatePlugin()
    }
  },
  methods: {
    updatePlugin() {
      let id
      switch (this.game) {
        case 'Dota 2':
          id = 167311590
          break
        case 'PUBG':
          id = 167311461
          break
        case 'CS:GO':
          id = 167311687
          break
        case 'Hearthstone':
          id = 167311797
          break
        default:
          id = 151813510
      }
      VK.Widgets.Group(
        'vk_groups',
        {
          mode: 3,
          no_cover: 1,
          color1: '1E2B40',
          color2: 'FFFFFF',
          width: 'auto'
        },
        id
      )
    }
  }
}
</script>
