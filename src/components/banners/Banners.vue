<template>
  <va-card title="Banners">
    <va-button
      v-if="!isProduction"
      icon="fa fa-external-link-square"
      flat
      slot="actions"
      class="mr-0"
      @click="transferOld"
    />
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="createBanner" />
    <va-data-table :fields="fields" :data="banners" :per-page="10" :loading="loading">
      <template slot="inx" slot-scope="props">{{ props.rowData.index }}</template>
      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="editBanner(props.rowData.index)" />
        <va-button
          flat
          small
          color="gray"
          icon="fa fa-trash"
          @click="confirmDeleting(props.rowData, props.rowData.index)"
        />
      </template>
    </va-data-table>

    <va-modal
      v-model="deleteConfirmModal"
      size="small"
      :title="$t('banner.deleteModal.title', { title: deletingCategoryTitle })"
      :message="$t('banner.deleteModal.text')"
      :okText="$t('banner.deleteModal.confirm')"
      @cancel="deletingBanner = null"
      @ok="deleteBanner"
      :cancelText="$t('banner.deleteModal.cancel')"
    />
  </va-card>
</template>

<script>
import { database, transferBanners } from '@/services/firebase'
const bannersRef = database.ref('bannersV2')

export default {
  name: 'Banners',
  created() {
    bannersRef.on('value', this.bannersListener)
  },
  beforeDestroy() {
    bannersRef.off('value', this.bannersListener)
  },
  data: () => ({
    banners: [],
    loading: true,
    deleteConfirmModal: false,
    deletingBanner: null,
  }),
  computed: {
    fields() {
      return [
        {
          name: '__slot:inx',
          title: this.$t('tables.headings.index'),
        },
        {
          name: 'ID',
          title: this.$t('tables.headings.id'),
        },
        {
          name: '__slot:actions',
          dataClass: 'text-right',
        },
      ]
    },
    deletingCategoryTitle() {
      return this.deletingBanner?.ID || ''
    },
    isProduction() {
      return process.env.NODE_ENV === 'production'
    },
  },
  methods: {
    bannersListener(snapshots) {
      this.loading = true
      this.$set(
        this,
        'banners',
        snapshots.val().map((el, $inx) => {
          return { ...el, index: $inx }
        })
      )
      this.loading = false
    },
    editBanner(inx) {
      this.$router.push({ name: 'bannerItem', params: { key: inx } })
    },
    confirmDeleting(val, inx) {
      this.deletingBanner = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    async deleteBanner() {
      this.loading = true

      const list = [...this.banners].map((el) => {
        delete el?.index
        delete el?.inx
        return el
      })
      list.splice(this.deletingBanner.index, 1)
      await database.ref('bannersV2').set(list)
      this.deletingBanner = null

      this.loading = false
    },
    createBanner() {
      this.$router.push({ name: 'bannerCreate' })
    },
    transferOld() {
      if (this.isProduction) return
      transferBanners()
    },
  },
}
</script>
