<template>
  <div class="users-wrapper wrapper">
    <div class="m-universal-block panel-block">
      <div class="ub-dark-top panel-header">
        <h2 class="title">Сonfigure User</h2>
      </div>

      <div class="ub-content panel-content">
        <field-select
          v-model="confForm.username.val"
          :error="confForm.username.err"
          :success="confForm.username.suc"
          :title="confForm.username.title"
          :options="confForm.username.options"
        />
        <field-text
          v-model="confForm.email.val"
          :error="confForm.email.err"
          :success="confForm.email.suc"
          :title="confForm.email.title"
        />
        <field-text
          :password="true"
          v-model="confForm.password.val"
          :error="confForm.password.err"
          :success="confForm.password.suc"
          :title="confForm.password.title"
        />
        <field-text
          :password="true"
          v-model="confForm.passwordAgain.val"
          :error="confForm.passwordAgain.err"
          :success="confForm.passwordAgain.suc"
          :title="confForm.passwordAgain.title"
        />
        <field-select
          v-model="confForm.status.val"
          :error="confForm.status.err"
          :success="confForm.status.suc"
          :title="confForm.status.title"
          :options="confForm.status.options"
        />
        <field-select
          v-model="confForm.privilege.val"
          :error="confForm.privilege.err"
          :success="confForm.privilege.suc"
          :title="confForm.privilege.title"
          :options="confForm.privilege.options"
        />

        <div class="group jsfe">
          <common-button @click.native="removeUser()">Remove user</common-button>
          <common-button @click.native="configureUser()">Edit user</common-button>
        </div>
        <p class="jsfe message">{{ confFormMsg }}</p>
      </div>
    </div>

    <div class="m-universal-block panel-block">
      <div class="ub-dark-top panel-header">
        <h2 class="title">Add user</h2>
      </div>

      <div class="ub-content panel-content">
        <field-text
          v-model="addForm.username.val"
          :error="addForm.username.err"
          :success="addForm.username.suc"
          :title="addForm.username.title"
        />
        <field-text
          v-model="addForm.email.val"
          :error="addForm.email.err"
          :success="addForm.email.suc"
          :title="addForm.email.title"
        />
        <field-text
          :password="true"
          v-model="addForm.password.val"
          :error="addForm.password.err"
          :success="addForm.password.suc"
          :title="addForm.password.title"
        />
        <field-text
          :password="true"
          v-model="addForm.passwordAgain.val"
          :error="addForm.passwordAgain.err"
          :success="addForm.passwordAgain.suc"
          :title="addForm.passwordAgain.title"
        />

        <field-select
          v-model="addForm.privilege.val"
          :error="addForm.privilege.err"
          :success="addForm.privilege.suc"
          :title="addForm.privilege.title"
          :options="addForm.privilege.options"
        />

        <common-button @click.native="addUser()" class="jsfe">Add User</common-button>

        <p class="jsfe message">{{ addFormMsg }}</p>
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
import FieldText from '@/components/elements/FieldText.vue'
import FieldSelect from '@/components/elements/FieldSelect.vue'
import CommonButton from '@/components/elements/CommonButton.vue'
import SimplePopup from '@/components/elements/SimplePopup.vue'
import Joi from 'joi'
import _ from 'lodash'

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
      addFormMsg: '',
      confFormMsg: '',
      addForm: {
        username: {
          title: 'Username',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(3)
            .max(50)
            .required()
        },
        email: {
          title: 'Email',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .email()
            .required()
        },
        password: {
          title: 'Password',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(8)
            .max(255)
            .required()
        },
        passwordAgain: {
          title: 'Password once again',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .min(8)
            .max(255)
            .required()
        },
        privilege: {
          title: 'Privilege',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Guest',
              val: 'guest'
            },
            {
              title: 'Organisator',
              val: 'organisator'
            },
            {
              title: 'Moderator',
              val: 'moderator'
            },
            {
              title: 'Admin',
              val: 'admin'
            }
          ],
          schema: Joi.required()
        }
      },
      confForm: {
        id: {
          val: null,
          suc: true
        },
        username: {
          title: 'Username',
          val: '',
          suc: true,
          err: '',
          options: [
            {
              title: 'Gusev',
              val: 'Gusev'
            },
            {
              title: 'Epulze',
              val: 'Epulze'
            }
          ],
          schema: Joi.string().required()
        },
        email: {
          title: 'Email',
          val: '',
          suc: false,
          err: '',
          schema: Joi.string()
            .email()
            .required()
        },
        password: {
          title: 'New password',
          val: '',
          suc: true,
          err: '',
          schema: Joi.string()
            .min(8)
            .max(255)
            .empty('')
        },
        passwordAgain: {
          title: 'New password once again',
          val: '',
          suc: true,
          err: '',
          schema: Joi.string()
            .min(8)
            .max(255)
            .empty('')
        },
        privilege: {
          title: 'Privilege',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Guest',
              val: 'guest'
            },
            {
              title: 'Organisator',
              val: 'organisator'
            },
            {
              title: 'Moderator',
              val: 'moderator'
            },
            {
              title: 'Admin',
              val: 'admin'
            }
          ],
          schema: Joi.required()
        },
        status: {
          title: 'Status',
          val: '',
          suc: false,
          err: '',
          options: [
            {
              title: 'Active',
              val: 1
            },
            {
              title: 'Unactive',
              val: 0
            }
          ],
          schema: Joi.required()
        }
      }
    }
  },
  created() {},
  mounted() {},
  watch: {
    'confForm.username.val'() {
      // this.$axios('/api/get-user-info', {params})
      let user = {
        id: 123,
        username: 'Gusev',
        email: 'san4es021@gmail.com',
        privilege: 'admin',
        status: 0
      }
      _.mapKeys(this.confForm, function(value, key) {
        if (key !== 'password' && key !== 'passwordAgain') value.val = user[key]
      })
    },
    'confForm.email.val'() {
      this.validate('email', 'confForm')
    },
    'confForm.privilege.val'() {
      this.validate('privilege', 'confForm')
    },
    'confForm.status.val'() {
      this.validate('status', 'confForm')
    },
    'confForm.password.val'() {
      this.validate('password', 'confForm', true)
    },
    'confForm.passwordAgain.val'() {
      this.validate('passwordAgain', 'confForm', true)
    },

    'addForm.username.val'() {
      this.validate('username', 'addForm')
    },
    'addForm.email.val'() {
      this.validate('email', 'addForm')
    },
    'addForm.privilege.val'() {
      this.validate('privilege', 'addForm')
    },
    'addForm.password.val'() {
      this.validate('password', 'addForm', true)
    },
    'addForm.passwordAgain.val'() {
      this.validate('passwordAgain', 'addForm', true)
    }
  },
  methods: {
    validate(fieldName, form, password = false) {
      let field = this[form][fieldName]
      let { error } = Joi.validate(field.val, field.schema)
      if (error) {
        field.suc = false
        field.err = error.message.split('"')[2]
      } else {
        // if it's password
        if (
          password &&
          this[form].password.val !== this[form].passwordAgain.val
        ) {
          this[form].password.err = 'Passwords are different!'
          this[form].passwordAgain.err = 'Passwords are different!'
          this[form].password.suc = false
          this[form].passwordAgain.suc = false
          console.log(22)

          return false
        }
        // if it's password, set both
        if (password) {
          this[form].password.err = ''
          this[form].passwordAgain.err = ''
          this[form].password.suc = true
          this[form].passwordAgain.suc = true
        }
        // okay
        field.err = ''
        field.suc = true
      }
    },
    getUserObject() {
      let user = {}
      _.mapKeys(this.addForm, function(value, key) {
        user[key] = value.val
      })
      return user
    },
    isValid(form) {
      // LOOK FOR suc=false
      let error = null
      for (let item in this[form]) {
        if (!this[form][item].suc) {
          error = true
          console.log(item)
        }
      }
      if (error) return false

      return true
    },
    removeUser() {
      // CHECK IF USER SET
      if (!this.confForm.id.val) {
        return (this.confFormMsg = 'Choose the user')
      } else {
        this.confFormMsg = ''
      }

      // POPUP
      this.confirmPopup(() => {
        console.log('removed user')
        // QUERY
        // this.$axios.post('/api/removeuser', {params})
        this.popup.title = 'User has been removed.'
        this.popup.message = 'Accound to longer exists.'
        this.popup.button = ''
      }, 'You are going to remove user ' + this.confForm.username.val)
    },
    addUser() {
      // CHECK VALIDATION
      if (!this.isValid('addForm'))
        return (this.addFormMsg = 'Form is incorrect')
      this.addFormMsg = ''

      // POPUP
      this.confirmPopup(() => {
        let user = this.getUserObject()
        this.$axios
          .post('/api/users/register', user)
          .then(res => {
            this.popup.title = 'User successfully added!'
            this.popup.message = ''
            //'Login info was sent to email.'
            this.popup.button = ''
          })
          .catch(err => {
            this.popup.title = err.response.data
            this.popup.message = ''
            this.popup.button = ''
          })
      }, 'You are going to add user with privileges of ' + this.addForm.privilege.val)
    },
    configureUser() {
      // CHECK IF USER SET
      if (!this.confForm.id.val) {
        return (this.confFormMsg = 'Choose the user')
      } else {
        this.confFormMsg = ''
      }
      // CHECK VALIDATION
      if (!this.isValid('confForm'))
        return (this.confFormMsg = 'Form is incorrect')
      this.confFormMsg = ''

      // POPUP
      this.confirmPopup(() => {
        console.log('edited user')
        // QUERY
        // this.$axios.post('/api/configureuser', {params})
        this.popup.title = 'User successfully edited!'
        this.popup.message = 'Notification was sent to email.'
        this.popup.button = ''
      }, 'You are going to edit user "' + this.confForm.username.val + '" with privileges of ' + this.confForm.privilege.val)
    },

    confirmPopup(func, message = '', title = 'Are you sure?', html = false) {
      if (func !== false) {
        this.$on('confirmPopup', func)
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
    FieldText,
    FieldSelect,
    CommonButton,
    SimplePopup
  },
  middleware: 'requiresAdmin'
}
</script>

<style lang="sass" scoped>
@import '@/assets/style/_variables.sass'

.users-wrapper
  align-items: flex-start
  display: grid
  grid-template-columns: minmax(auto, 400px) minmax(auto, 400px)
  justify-content: flex-start
  grid-gap: 15px
  @include respond-to(sm)
    justify-content: center
    justify-items: center
    grid-template-columns: 1fr
  .panel-block
    width: 100%
    max-width: 400px
    .panel-content
      display: grid
      padding-left: 15px
      padding-right: 15px
.jsfe
  justify-self: flex-end 

.message
  font-size: .9rem
  margin: 0
  opacity: .5

</style>
