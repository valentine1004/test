<template>
  <form @submit.prevent="onsubmit">
    <va-input
      v-model="email"
      type="email"
      :label="$t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
      @input="emailErrors = []"
    />

    <va-input
      v-model="password"
      type="password"
      :label="$t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
      @input="passwordErrors = []"
    />

    <!-- <div class="auth-layout__options d-flex align--center justify--space-between"> -->
    <!-- <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="$t('auth.keep_logged_in')"/>
      <router-link class="ml-1 link" :to="{name: 'recover-password'}">{{$t('auth.recover_password')}}</router-link> -->
    <!-- </div> -->

    <div class="d-flex justify--center mt-3">
      <va-button type="submit" class="my-0">{{ $t('auth.login') }}</va-button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import requests from '../../../services/api'

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      // keepLoggedIn: false,
      emailErrors: [],
      passwordErrors: [],
    }
  },
  computed: {
    formReady() {
      return !this.emailErrors.length && !this.passwordErrors.length
    },
  },
  methods: {
    ...mapActions(['signIn']),
    async onsubmit() {
      this.emailErrors = this.email ? [] : ['Email is required']
      this.passwordErrors = this.password ? [] : ['Password is required']
      if (!this.formReady) {
        return
      }

      try {
        await requests.signIn({ email: this.email, password: this.password })
        await this.signIn({ email: 'root@gmail.com', password: 'root123' })
        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        this.showToast(error.message, {
          icon: 'fa-warning',
          position: 'bottom-right',
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss">
</style>
