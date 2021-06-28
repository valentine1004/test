<template>
  <va-card title="Promotions">
    <va-button
      v-if="!isProduction"
      icon="fa fa-external-link-square"
      flat
      slot="actions"
      class="mr-0"
      @click="transferOld"
    />
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="createPromotion" />
    <va-data-table :fields="fields" :data="promotions" :per-page="10" :loading="loading">
      <template slot="inx" slot-scope="props">
        {{ props.rowData.index }}
      </template>
      <template slot="title" slot-scope="props">
        {{ props.rowData.TITLE[$i18n.locale() === 'ua' ? 'UK' : $i18n.locale().toUpperCase()] }}
      </template>

      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="editPromotion(props.rowData.index)" />
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
      :title="$t('promotion.deleteModal.title', { title: deletingCategoryTitle })"
      :message="$t('promotion.deleteModal.text')"
      :okText="$t('promotion.deleteModal.confirm')"
      @cancel="deletingPromotion = null"
      @ok="deletePromotion"
      :cancelText="$t('promotion.deleteModal.cancel')"
    />
  </va-card>
</template>

<script>
import Vue from 'vue'
import { database, transferPromotions } from '@/services/firebase'
const promotionsRef = database.ref('actionsV3')

export default {
  name: 'Promotions',
  created() {
    promotionsRef.on('value', this.promotionsListener)
  },
  beforeDestroy() {
    promotionsRef.off('value', this.promotionsListener)
  },
  data: () => ({
    promotions: [],
    loading: true,
    deleteConfirmModal: false,
    deletingPromotion: null,
  }),
  computed: {
    fields() {
      return [
        {
          name: '__slot:inx',
          title: this.$t('tables.headings.index'),
        },
        {
          name: '__slot:title',
          title: this.$t('tables.headings.name'),
        },
        {
          name: '__slot:actions',
          dataClass: 'text-right',
        },
      ]
    },
    deletingCategoryTitle() {
      const locale = Vue.i18n.locale() === 'ua' ? 'UK' : Vue.i18n.locale().toUpperCase()
      return this.deletingPromotion?.TITLE?.[locale] || ''
    },
    isProduction() {
      return process.env.NODE_ENV === 'production'
    },
  },
  methods: {
    promotionsListener(snapshots) {
      this.loading = true
      this.$set(
        this,
        'promotions',
        snapshots.val().map((el, $inx) => {
          return { ...el, index: $inx }
        })
      )
      this.loading = false
    },
    editPromotion(inx) {
      this.$router.push({ name: 'promotionItem', params: { key: inx } })
    },
    confirmDeleting(val, inx) {
      this.deletingPromotion = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    async deletePromotion() {
      this.loading = true

      const list = [...this.promotions].map((el) => {
        delete el?.index
        delete el?.inx
        return el
      })
      list.splice(this.deletingPromotion.index, 1)
      await database.ref('actionsV3').set(list)
      this.deletingPromotion = null

      this.loading = false
    },
    createPromotion() {
      this.$router.push({ name: 'promotionCreate' })
    },
    transferOld() {
      if (this.isProduction) return
      transferPromotions()
    },
  },
}
</script>
