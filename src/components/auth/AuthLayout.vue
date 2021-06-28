<template>
  <div class="auth-layout row align-content--center">
    <div class="flex xs12 pa-3 flex-center">
      <div class="py-5 flex-center">
        <div class="logo-icon" />
      </div>
    </div>

    <div class="flex xs12 pa-3">
      <div class="d-flex justify--center">
        <va-card class="auth-layout__card">
          <va-tabs v-model="selectedTabIndex" center>
            <va-tab>{{ $t('auth.login') }}</va-tab>
          </va-tabs>

          <va-separator />

          <div class="pa-3">
            <router-view />
          </div>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  data: () => ({
    selectedTabIndex: 0,
    tabTitles: ['login'],
  }),
}
</script>

<style lang="scss">
.auth-layout {
  min-height: 100vh;
  background-image: linear-gradient(to right, #e1e8f5, #9fafd0);

  &__card {
    width: 100%;
    max-width: 600px;
  }

  &__options {
    @include media-breakpoint-down(xs) {
      flex-direction: column;
    }
  }

  .logo-icon {
    width: 190px;
    height: 32px;
    background-image: url(~@/assets/icons/MyWaterAdmin_logo.svg);
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
