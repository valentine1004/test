<template>
  <va-card title="Users">
    <va-button icon="fa fa-plus-square" flat slot="actions" class="mr-0" @click="addUser"/>
    <va-data-table :fields="fields" :data="users" :per-page="10" :loading="loading">
      <template slot="name" slot-scope="props">{{ props.rowData.name }}</template>
      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="editUser(props.rowData.index)"/>
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
import requests from '../../services/api'

export default {
  name: 'UsersList',
  data: () => ({
    users: [],
    loading: true,
    deleteConfirmModal: false,
    deletingCategory: null,
  }),
  computed: {
    fields() {
      return [
        {
          name: 'name',
          title: this.$t('tables.headings.fullName'),
        },
        {
          name: 'role',
          title: this.$t('tables.headings.role'),
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
    async getUsers() {
      try {
        const res = await requests.getUsers()
        this.users = res.data
        this.loading = false
      } catch (err) {
        console.log('err', err)
      }
    },
    editUser(inx) {
      console.log('index', inx)
      // this.$router.push({name: 'categoryItem', params: {key: inx}})
    },
    confirmDeleting(val, inx) {
      this.deletingCategory = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    async deleteCategory() {
      this.loading = true

      this.loading = false
    },
    addUser() {
      this.$router.push({ name: 'userCreate' })
    },
  },
  mounted() {
    this.getUsers()
  }
}
</script>
