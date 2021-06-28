<template>
  <va-card :title="title">
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="createAndroidPost"/>
    <listInfoContent :device="device"></listInfoContent>
  </va-card>
</template>

<script>
export default {
  name: 'ListInfoAndroid',
  components: {
    listInfoContent: () => import('./content'),
  },
  computed: {
    device() {
      return 'Android'
    },
    title() {
      return `${this.$t('menu.listInfo')} (${this.device})`
    },
  },
  methods: {
    createAndroidPost() {
      this.$router.push({ name: 'postAndroidCreate' })
    },
  }
}
</script>
