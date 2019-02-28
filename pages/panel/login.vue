<template>
  <div class="login-wrapper wrapper">
    <div class="m-universal-block login-window">
      <div class="ub-dark-top">Login</div>
      <div class="ub-content">
        <form>
          <field-text
            v-model="form.username.val"
            :error="form.username.err"
            :success="form.username.suc"
            :title="form.username.title"
          />
          <field-text
            v-model="form.password.val"
            :error="form.password.err"
            :success="form.password.suc"
            :title="form.password.title"
            :password="true"
          />
          <common-button :class="'flex-end'" @click.native="signIn()">Sign In</common-button>
          <span class="error">{{ error }}</span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FieldText from '@/components/elements/FieldText.vue'
import FieldSelect from '@/components/elements/FieldSelect.vue'
import FieldCheckbox from '@/components/elements/FieldCheckbox.vue'
import FieldTextarea from '@/components/elements/FieldTextarea.vue'
import CommonButton from '@/components/elements/CommonButton.vue'
import Joi from 'joi'

export default {
  layout: 'panel',
  data() {
    return {
      hello: 'asd',
      form: {
        username: {
          title: 'Username',
          val: '',
          suc: false,
          err: ''
        },
        password: {
          title: 'Password',
          val: '',
          suc: false,
          err: ''
        }
      },
      error: ''
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    async signIn() {
      let result = await this.$store.dispatch('signIn', {
        username: this.form.username.val,
        password: this.form.password.val
      })

      if (!result) return (this.error = 'Wrong username or password.')

      if (result) return this.$router.push({ path: '/panel' })
    }
  },
  components: {
    FieldText,
    FieldSelect,
    FieldCheckbox,
    FieldTextarea,
    CommonButton
  },
  middleware: 'notLogged'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'
.login-wrapper
  height: 100%
.login-window
  margin: auto
  align-self: center
  width: 320px
  max-width: 100%
  form
    display: contents
.flex-end
  justify-self: flex-end
.error
  color: $error
  font-size: .8rem

</style>
