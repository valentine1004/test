<template>
  <va-card title="Logs">
    <div class="row">
      <div class="flex md4 sm4 xs12">
        <va-select textBy="name" label="Choose device type" v-model="device" :options="devices" :disabled="loading" />
      </div>
      <div class="flex md4 sm4 xs12">
        <va-date-picker label="Choose date" v-model="date" :disabled="loading" />
      </div>
      <div class="flex md2 sm2 xs12">
        <va-button @click="fetchLogs" :disabled="loading || !validate">{{ 'Get logs' }}</va-button>
      </div>
    </div>
    <div v-if="logs.length" class="row">
      <va-button @click="deleteBranch(`${this.chosenDate.year}_${this.chosenMonth}`)" :disabled="loading">{{
        `Delete ${this.chosenDate.year}_${this.chosenMonth} branch`
      }}</va-button>
      <va-button
        @click="deleteBranch(`${this.chosenDate.year}_${this.chosenMonth}/${this.chosenDay}`)"
        :disabled="loading"
        >{{ `Delete ${this.chosenDate.year}_${this.chosenMonth}_${this.chosenDay} branch` }}
      </va-button>
    </div>

    <va-data-table :fields="fields" :data="logs" :per-page="perPage" :loading="loading">
      <template slot="cell" slot-scope="props">{{ props.rowData[0] }}</template>
      <template slot="actions" slot-scope="props">
        <va-button flat small color="gray" icon="fa fa-pencil" @click="readLog(props.rowData[1], props.rowData[0])" />
        <va-button
          flat
          small
          color="gray"
          icon="fa fa-trash"
          @click="confirmDeleting(props.rowData[1], props.rowData[0])"
        />
      </template>
    </va-data-table>

    <va-modal
      v-model="deleteConfirmModal"
      size="small"
      :title="$t('logs.deleteModal.title', { title: deletingLogTitle })"
      :message="$t('logs.deleteModal.text')"
      :okText="$t('logs.deleteModal.confirm')"
      @cancel="deletingLog = null"
      @ok="deleteLog"
      :cancelText="$t('logs.deleteModal.cancel')"
    />
  </va-card>
</template>

<script>
import { database } from '@/services/firebase'
import { isEmpty } from 'lodash'

export default {
  name: 'Logs',
  data: () => ({
    logs: [],
    loading: false,
    devices: [
      { id: 0, name: 'Android' },
      { id: 1, name: 'iOS' },
    ],
    device: '',
    date: '',
    deleteConfirmModal: false,
    deletingLog: null,
    currentPage: 1,
    perPage: 20,
  }),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (Object.keys(to.query).length > 0) {
        vm.getQueryFilters()
      } else {
        vm.setCurrentDate()
      }
    })
  },
  computed: {
    fields() {
      return [
        {
          name: '__slot:cell',
          dataClass: 'text-right',
        },
        {
          name: '__slot:actions',
          dataClass: 'text-right',
        },
      ]
    },
    validate() {
      return this.data !== '' && this.device !== ''
    },
    isAndroid() {
      return this.device !== '' && this.device.name === 'Android'
    },
    chosenDate() {
      const date = new Date(Date.parse(this.date))
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return { year, month, day }
    },
    chosenMonth() {
      return this.isAndroid ? `0${this.chosenDate.month}` : this.chosenDate.month
    },
    chosenDay() {
      return this.isAndroid && this.chosenDate.day.toString().length === 1
        ? `0${this.chosenDate.day}`
        : this.chosenDate.day
    },
    deletingLogTitle() {
      return this.deletingLog?.cell || ''
    },
  },
  methods: {
    setCurrentDate() {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()

      this.date = `${yyyy}-${mm}-${dd}`
    },
    getQueryFilters() {
      const device = this.$route.query?.device || null
      const date = this.$route.query?.date || null

      const checkDevice = this.devices.find((el) => el.name === device)
      if (checkDevice) this.device = { ...checkDevice }
      if (date) this.date = date
      this.fetchLogs()
    },
    fetchLogs() {
      if (this.validate) {
        this.loading = true

        this.resetLogs()
        const device = this.device.name
        const uri = `logsV2/${device}/${this.chosenDate.year}_${this.chosenMonth}/${this.chosenDay}`

        database
          .ref(uri)
          .once('value')
          .then(async (snapshots) => {
            const values = { ...snapshots.val() }

            if (!isEmpty(values)) {
              this.$set(this, 'logs', Object.entries(values))
            }

            this.loading = false
          })
      }
    },
    readLog(log, cell) {
      this.$router.push({
        name: 'logItem',
        params: {
          device: this.device.name,
          date: `${this.chosenDate.year}-${this.chosenMonth}-${this.chosenDay}`,
          cell: cell,
        },
      })
    },
    confirmDeleting(log, cell) {
      this.deletingLog = { ...log, cell: cell }
      this.deleteConfirmModal = true
    },
    async deleteLog() {
      this.loading = true

      const uri = `${this.chosenDate.year}_${this.chosenMonth}/${this.chosenDay}/${this.deletingLog.cell}`
      await database.ref(`logsV2/${this.device.name}/${uri}`).remove()
      this.fetchLogs()
    },
    async deleteBranch(uri) {
      this.loading = true

      await database.ref(`logsV2/${this.device.name}/${uri}`).remove()
      this.fetchLogs()
    },
    resetLogs() {
      this.logs = []
    },
  },
  watch: {
    date() {
      this.resetLogs()
    },
    device: {
      deep: true,
      handler() {
        this.resetLogs()
      },
    },
  },
}
</script>
