<template>
  <va-card :title="$t('menu.maintenanceMode')">
    <va-button
      v-if="!isProduction"
      icon="fa fa-external-link-square"
      flat
      slot="actions"
      class="mr-0"
      @click="transferOld"
    />
    <div class="form" v-if="settings">
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.HEADER.RU"
            :error="!!errors.HEADER_RU.length"
            :error-messages="errors.HEADER_RU"
            @input="errors.HEADER_RU = []"
            label="Header (RU)"
            placeholder="Enter header (RU)"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.HEADER.UK"
            :error="!!errors.HEADER_UK.length"
            :error-messages="errors.HEADER_UK"
            @input="errors.HEADER_UK = []"
            label="Header (UK)"
            placeholder="Enter header (UK)"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.TITLE.RU"
            :error="!!errors.TITLE_RU.length"
            :error-messages="errors.TITLE_RU"
            @input="errors.TITLE_RU = []"
            label="Title (RU)"
            placeholder="Enter title (RU)"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.TITLE.UK"
            :error="!!errors.TITLE_UK.length"
            :error-messages="errors.TITLE_UK"
            @input="errors.TITLE_UK = []"
            label="Title (UK)"
            placeholder="Enter title (UK)"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.DESCR.RU"
            :error="!!errors.DESCR_RU.length"
            :error-messages="errors.DESCR_RU"
            @input="errors.DESCR_RU = []"
            type="textarea"
            autosize
            label="Description (RU)"
            placeholder="Enter description (RU)"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.DESCR.UK"
            :error="!!errors.DESCR_UK.length"
            :error-messages="errors.DESCR_UK"
            @input="errors.DESCR_UK = []"
            type="textarea"
            autosize
            label="Description (UK)"
            placeholder="Enter description (UK)"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.HOTLINE.RU"
            :error="!!errors.HOTLINE_RU.length"
            :error-messages="errors.HOTLINE_RU"
            @input="errors.HOTLINE_RU = []"
            label="Hotline (RU)"
            placeholder="Enter hotline (RU)"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="settings.HOTLINE.UK"
            :error="!!errors.HOTLINE_UK.length"
            :error-messages="errors.HOTLINE_UK"
            @input="errors.HOTLINE_UK = []"
            label="Hotline (UK)"
            placeholder="Enter hotline (UK)"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-date-picker
            label="Choose begin date"
            v-model="settings.beginDate"
            :config="{ enableTime: true, time_24hr: true }"
            :error="!!errors.beginDate.length"
            :error-messages="errors.beginDate"
            @input="errors.beginDate = []"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-date-picker
            label="Choose finish date"
            v-model="settings.finishDate"
            :config="{ enableTime: true, time_24hr: true }"
            :error="!!errors.finishDate.length"
            :error-messages="errors.finishDate"
            @input="errors.finishDate = []"
          />
        </div>
      </div>
      <div class="row">
        <va-button @click="setMode" :disabled="loading">{{ 'Set mode' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, transferMaintenanceMode } from '@/services/firebase'
import { datePickerTimeFix } from '@/utils/general'

export default {
  name: 'MaintenanceMode',
  mixins: [datePickerTimeFix],
  created() {
    this.ref = database.ref('technicalWorkTest')
    this.ref.once('value').then(this.settingsListener)
  },
  data: () => ({
    ref: null,
    settings: null,
    errors: {
      HEADER_RU: [],
      HEADER_UK: [],
      DESCR_RU: [],
      DESCR_UK: [],
      TITLE_RU: [],
      TITLE_UK: [],
      HOTLINE_RU: [],
      HOTLINE_UK: [],
      beginDate: [],
      finishDate: [],
    },

    loading: false,
  }),
  computed: {
    serverDateFormat() {
      return 'DD.MM.YYYY HH:mm'
    },
    frontDateFormat() {
      return 'YYYY-MM-DD HH:mm'
    },
    isProduction() {
      return process.env.NODE_ENV === 'production'
    },
  },
  methods: {
    settingsListener(snapshot) {
      const settings = { ...snapshot.val() }
      this.settings = {
        ...settings,
        beginDate: this.$moment(settings.beginDate, this.serverDateFormat).format(this.frontDateFormat),
        finishDate: this.$moment(settings.finishDate, this.serverDateFormat).format(this.frontDateFormat),
      }
    },
    async setMode() {
      if (this.loading) return

      if (!this.validate()) return

      this.loading = true

      const settings = {
        ...this.settings,
        beginDate: this.$moment(this.settings.beginDate).format(this.serverDateFormat),
        finishDate: this.$moment(this.settings.finishDate).format(this.serverDateFormat),
      }

      await this.ref.set(settings, (error) => {
        if (error) {
          console.log(error)
          this.showToast('An error occured.', {
            icon: 'fa-warning',
            position: 'bottom-right',
            type: 'error',
          })
        } else {
          this.showToast('Changes were saved!', {
            icon: 'fa-check',
            position: 'bottom-right',
          })
        }
      })
      this.loading = false
    },
    validate() {
      this.errors.HEADER_RU = this.settings.HEADER.RU !== '' ? [] : ['Header is required']
      this.errors.HEADER_UK = this.settings.HEADER.UK !== '' ? [] : ['Header is required']
      this.errors.DESCR_RU = this.settings.DESCR.RU !== '' ? [] : ['Description is required']
      this.errors.DESCR_UK = this.settings.DESCR.UK !== '' ? [] : ['Description is required']
      this.errors.TITLE_RU = this.settings.TITLE.RU !== '' ? [] : ['Title is required']
      this.errors.TITLE_UK = this.settings.TITLE.UK !== '' ? [] : ['Title is required']
      this.errors.HOTLINE_RU = this.settings.HOTLINE.RU !== '' ? [] : ['Hotline is required']
      this.errors.HOTLINE_UK = this.settings.HOTLINE.UK !== '' ? [] : ['Hotline is required']
      this.errors.beginDate = this.settings.beginDate !== '' ? [] : ['Begin date is required']
      this.errors.finishDate = this.settings.finishDate !== '' ? [] : ['Finish date is required']

      let validated = true
      for (const k in this.errors) {
        if (this.errors[k].length) {
          validated = false
          break
        }
      }

      return validated
    },
    transferOld() {
      if (this.isProduction) return
      transferMaintenanceMode()
    },
  },
}
</script>
