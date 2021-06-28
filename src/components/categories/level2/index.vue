<template>
  <va-card :title="$t('menu.categories2Level')">
    <va-data-table :fields="fields" :data="categories" :per-page="20" :loading="loading">
      <template slot="inx" slot-scope="props">{{ props.rowData.index }}</template>
      <template slot="actions" slot-scope="props">
        <va-button
          v-if="props.rowData.iconExists"
          flat
          small
          color="gray"
          icon="fa fa-pencil"
          @click="editIcon(props.rowData.level2Icon.index)"
        />
        <va-button v-else flat small color="gray" icon="fa fa-plus-square" @click="addIcon(props.rowData.ID)" />
        <va-button
          flat
          small
          color="gray"
          icon="fa fa-trash"
          :disabled="!props.rowData.iconExists"
          @click="confirmDeleting(props.rowData, props.rowData.index)"
        />
      </template>
    </va-data-table>

    <va-modal
      v-model="deleteConfirmModal"
      size="small"
      :title="$t('category2level.deleteModal.title', { title: deletingCategoryTitle })"
      :message="$t('category2level.deleteModal.text')"
      :okText="$t('category2level.deleteModal.confirm')"
      @cancel="deletingCategory = null"
      @ok="deleteCategory"
      :cancelText="$t('category2level.deleteModal.cancel')"
    />
  </va-card>
</template>

<script>
import Vue from 'vue'
import api from '@/services/api'
import { database } from '@/services/firebase'
const categoriesRef = database.ref('mainScreensTest/shopCategories2Level')

export default {
  name: 'Categories2Level',
  async created() {
    await this.getCategoriesData()
  },
  beforeDestroy() {},
  data: () => ({
    categories: [],
    icons: [],
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
          name: `NAME.${this.locale}`,
          title: this.$t('tables.headings.name'),
        },
        {
          name: '__slot:actions',
          dataClass: 'text-right',
        },
      ]
    },
    locale() {
      return Vue.i18n.locale() === 'ua' ? 'UK' : Vue.i18n.locale().toUpperCase()
    },
    deletingCategoryTitle() {
      return this.deletingCategory?.NAME?.[this.locale] || ''
    },
  },
  methods: {
    async categoriesListener(snapshots) {
      this.loading = true
      this.$set(
        this,
        'icons',
        snapshots.val().map((el, $inx) => {
          return { ...el, index: $inx }
        })
      )
      this.loading = false
    },
    getCategoriesData() {
      return new Promise((resolve, reject) => {
        api
          .getCatalogSections()
          .then(async (r) => {
            if (r.data.data.length > 0) {
              const snapshots = await categoriesRef.once('value')
              this.$set(
                this,
                'icons',
                snapshots.val().map((el, $inx) => {
                  return { ...el, index: $inx }
                })
              )
            }

            this.categories = [...r.data.data].map((el, $inx) => {
              const iconExists = this.icons.find((icon) => icon.id === el.ID)
              return { ...el, index: $inx, iconExists: Boolean(iconExists), level2Icon: iconExists }
            })
            resolve()
          })
          .catch((error) => {
            this.categories = []
            reject(error)
          })
          .finally(() => {
            if (this.loading) this.loading = false
          })
      })
    },
    editIcon(inx) {
      this.$router.push({ name: 'categories2LevelItem', params: { key: inx } })
    },
    confirmDeleting(val, inx) {
      this.deletingCategory = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    async deleteCategory() {
      this.loading = true

      this.categories.splice(this.deletingCategory.index, 1, {
        ...this.deletingCategory,
        iconExists: false,
        level2Icon: null,
      })

      const iconsList = [...this.icons].map((el) => {
        delete el?.index
        delete el?.inx
        return el
      })
      iconsList.splice(this.deletingCategory.level2Icon.index, 1)

      await database.ref('mainScreensTest/shopCategories2Level').set(iconsList)
      this.deletingCategory = null

      this.loading = false
    },
    addIcon(id) {
      this.$router.push({ name: 'category2LevelCreate', params: { id: id } })
    },
  },
}
</script>
