<template>
  <div>
    <va-data-table :fields="fields" :data="listInfo" :per-page="10" :loading="loading">
      <template slot="inx" slot-scope="props">{{ props.rowData.index }}</template>
      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="editInfo(props.rowData.index)" />
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
      :title="$t('category.deleteModal.title', { title: deletingInfoTitle })"
      :message="$t('category.deleteModal.text')"
      :okText="$t('category.deleteModal.confirm')"
      @cancel="deletingInfo = null"
      @ok="deleteInfo"
      :cancelText="$t('category.deleteModal.cancel')"
    />
  </div>
</template>

<script>
import { database } from '@/services/firebase'

export default {
  name: 'listInfoContent',
  props: {
    device: {
      type: String,
      required: true,
    },
  },
  async created() {
    const ref = await database.ref(this.refPath)
    this.ref = ref
    this.ref.on('value', this.storageListener)
  },
  beforeDestroy() {
    this.ref.off('value', this.storageListener)
  },
  computed: {
    refPath() {
      return `listInfo${this.device}Test`
    },
    fields() {
      return [
        {
          name: '__slot:inx',
          title: this.$t('tables.headings.index'),
        },
        {
          name: 'TITLE.RU',
          title: this.$t('tables.headings.name'),
        },
        {
          name: '__slot:actions',
          dataClass: 'text-right',
        },
      ]
    },
    deletingInfoTitle() {
      return ''
    },
  },
  data: () => ({
    ref: null,
    listInfo: [],
    loading: true,
    deleteConfirmModal: false,
    deletingInfo: null,
  }),
  methods: {
    storageListener(snapshots) {
      this.loading = true
      this.$set(
        this,
        'listInfo',
        snapshots.val().map((el, $inx) => {
          return { ...el, index: $inx }
        })
      )
      this.loading = false
    },
    createInfo() {
      this.$router.push({ name: 'createlistInfoItem', params: { key: this.device } })
    },
    editInfo(inx) {
      this.$router.push({ name: 'listInfoItem', params: { key: inx } })
    },
    confirmDeleting(val, inx) {
      this.deletingInfo = { ...val, index: inx }
      this.deleteConfirmModal = true
    },
    deleteInfo() {
      //
    },
  },
}
</script>
