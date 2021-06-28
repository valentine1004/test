<template>
  <va-card title="Categories">
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="createCategory" />
    <va-data-table :fields="fields" :data="categories" :per-page="10" :loading="loading">
      <template slot="inx" slot-scope="props">{{ props.rowData.index }}</template>
      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="editCategory(props.rowData.index)" />
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
      :title="$t('category.deleteModal.title', { title: deletingCategoryTitle })"
      :message="$t('category.deleteModal.text')"
      :okText="$t('category.deleteModal.confirm')"
      @cancel="deletingCategory = null"
      @ok="deleteCategory"
      :cancelText="$t('category.deleteModal.cancel')"
    />
  </va-card>
</template>

<script>
import Vue from 'vue'
import { database } from '@/services/firebase'
const categoriesRef = database.ref('mainScreensV2/shopCategories')

export default {
  name: 'Categories',
  created() {
    categoriesRef.on('value', this.categoriesListener)
  },
  beforeDestroy() {
    categoriesRef.off('value', this.categoriesListener)
  },
  data: () => ({
    categories: [],
    loading: true,
    deleteConfirmModal: false,
    deletingCategory: null,
  }),
  computed: {
    fields() {
      return [
        {
          name: '__slot:inx',
          title: this.$t('tables.headings.index'),
        },
        {
          name: 'name.RU',
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
      return this.deletingCategory?.name?.[locale] || ''
    },
  },
  methods: {
    categoriesListener(snapshots) {
      this.loading = true
      this.$set(
        this,
        'categories',
        snapshots.val().map((el, $inx) => {
          return { ...el, index: $inx }
        })
      )
      this.loading = false
    },
    editCategory(inx) {
      this.$router.push({ name: 'categoryItem', params: { key: inx } })
    },
    confirmDeleting(val, inx) {
      this.deletingCategory = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    async deleteCategory() {
      this.loading = true

      const list = [...this.categories].map((el) => {
        delete el?.index
        delete el?.inx
        return el
      })
      list.splice(this.deletingCategory.index, 1)
      await database.ref('mainScreensV2/shopCategories').set(list)
      this.deletingCategory = null

      this.loading = false
    },
    createCategory() {
      this.$router.push({ name: 'categoryCreate' })
    },
  },
}
</script>
