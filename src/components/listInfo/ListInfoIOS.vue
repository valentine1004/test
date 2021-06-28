<template>
  <va-card :title="title">
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="createIOSPost" />
    <listInfoContent :device="device"></listInfoContent>
  </va-card>
</template>

<script>
export default {
  name: 'ListInfoIOS',
  components: {
    listInfoContent: () => import('./content'),
  },
  computed: {
    device() {
      return 'IOS'
    },
    title() {
      return `${this.$t('menu.listInfo')} (${this.device})`
    },
  },
  methods: {
    createIOSPost() {
      this.$router.push({ name: 'postIOSCreate' })
    },
  }
}
</script>
