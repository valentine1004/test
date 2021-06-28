<template>
  <va-card :title="`Рекламный пост (Android)`">
    <div class="form">
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.BUTTON.RU"
            :error="!!errors.BUTTON_RU.length"
            :error-messages="errors.BUTTON_RU"
            @input="errors.BUTTON_RU = []"
            label="Button name Ru"
            placeholder="Enter RU button name"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.BUTTON.UK"
            :error="!!errors.BUTTON_UK.length"
            :error-messages="errors.BUTTON_UK"
            @input="errors.BUTTON_UK = []"
            label="Button name Uk"
            placeholder="Enter UK button name"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.DESCR.RU"
            :error="!!errors.DESCR_RU.length"
            :error-messages="errors.DESCR_RU"
            @input="errors.DESCR_RU = []"
            label="Description Ru"
            type="textarea"
            autosize
            placeholder="Enter RU description"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.DESCR.UK"
            :error="!!errors.DESCR_UK.length"
            :error-messages="errors.DESCR_UK"
            @input="errors.DESCR_UK = []"
            label="Description Uk"
            type="textarea"
            autosize
            placeholder="Enter UK description"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md12 sm12 xs12">
          <va-input
            v-model="post.ID"
            :error="!!errors.ID.length"
            :error-messages="errors.ID"
            @input="errors.ID = []"
            label="Post ID"
            placeholder="Enter post ID"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.TITLE.RU"
            :error="!!errors.TITLE_RU.length"
            :error-messages="errors.TITLE_RU"
            @input="errors.TITLE_RU = []"
            label="Title Ru"
            placeholder="Enter RU title"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="post.TITLE.UK"
            :error="!!errors.TITLE_UK.length"
            :error-messages="errors.TITLE_UK"
            @input="errors.TITLE_UK = []"
            label="Title Uk"
            placeholder="Enter UK title"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-date-picker
            label="From Date"
            v-model="post.fromDate"
            :config="{ enableTime: true, time_24hr: true }"
            :error="!!errors.fromDate.length"
            :error-messages="errors.fromDate"
            @input="errors.fromDate = []"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-date-picker
            label="To Date"
            v-model="post.toDate"
            :config="{ enableTime: true, time_24hr: true }"
            :error="!!errors.toDate.length"
            :error-messages="errors.toDate"
            @input="errors.toDate = []"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-select
            textBy="name"
            label="Post transition type"
            v-model="transition.type"
            :options="transitionTypes"
          />
        </div>
      </div>
      <div class="row">
        <div v-if="webType" class="flex md6 sm6 xs12">
          <va-input v-model="transition.url" label="Post transition url" placeholder="Enter transition url"/>
        </div>
        <slot v-else-if="shopType">
          <div class="flex md6 sm6 xs12">
            <va-input
              v-model="transition.productId"
              label="Post transition product ID"
              placeholder="Enter transition product ID"
            />
          </div>
          <div class="flex md6 sm6 xs12">
            <va-input
              v-model="transition.catalogId"
              label="Post transition catalog ID"
              placeholder="Enter transition catalog ID"
            />
          </div>
        </slot>
        <div v-else-if="actionsType" class="flex md6 sm6 xs12">
          <va-input
            v-model="transition.stockId"
            label="Post transition stock ID"
            placeholder="Enter transition stock ID"
          />
        </div>
        <div v-else-if="basketType || checkoutType" class="flex md6 sm6 xs12">
          <va-input
            v-model="transition.productIds"
            label="Post transition product IDs"
            placeholder="Enter transition product IDs"
            :messages="[$t('banner.productIds.format')]"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md6 sm6 xs12">
              <va-card title="Upload icon (RU)">
                <va-file-upload type="single" v-model="filesRU"/>
              </va-card>
            </div>
            <div class="flex md5 sm6 xs12 post-icon-wrap">
              <img v-if="filesRU.length" class="post-icon" :src="filesRuSrc"/>
            </div>
          </div>
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md6 sm6 xs12">
              <va-card title="Upload icon (UK)">
                <va-file-upload type="single" v-model="filesUK"/>
              </va-card>
            </div>
            <div class="flex md5 sm6 xs12 post-icon-wrap">
              <img v-if="filesUK.length" class="post-icon" :src="filesUkSrc"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <va-button @click="createPost" :disabled="loading">{{ 'Create' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, storage } from '@/services/firebase'
import { general, datePickerTimeFix } from '@/utils/general'
import { mapState } from 'vuex'

export default {
  name: 'PostAndroidCreate',
  mixins: [general, datePickerTimeFix],
  computed: {
    ...mapState({
      transitionTypes: (state) => state.app.transitionTypes,
    }),
    filesRuSrc() {
      return URL.createObjectURL(this.filesRU[0])
    },
    filesUkSrc() {
      return URL.createObjectURL(this.filesUK[0])
    },
    webType() {
      return this.transition.type.name === 'Web'
    },
    shopType() {
      return this.transition.type.name === 'Shop'
    },
    actionsType() {
      return this.transition.type.name === 'Actions'
    },
    basketType() {
      return this.transition.type.name === 'Basket'
    },
    checkoutType() {
      return this.transition.type.name === 'Checkout'
    },
    serverDateFormat() {
      return 'DD.MM.YYYY HH:mm'
    },
    frontDateFormat() {
      return 'YYYY-MM-DD HH:mm'
    },
  },
  data: () => ({
    post: {
      BUTTON: { RU: '', UK: '' },
      DESCR: { RU: '', UK: '' },
      ID: '',
      IMAGE: { RU: '', UK: '' },
      TITLE: { RU: '', UK: '' },
      fromDate: '',
      toDate: '',
    },
    transition: {
      productId: '',
      catalogId: '',
      productIds: '',
      stockId: '',
      url: '',
      type: '',
    },
    filesRU: [],
    filesUK: [],
    loading: false,
    errors: {
      BUTTON_RU: [],
      BUTTON_UK: [],
      DESCR_RU: [],
      DESCR_UK: [],
      ID: [],
      IMAGE_RU: [],
      IMAGE_UK: [],
      TITLE_RU: [],
      TITLE_UK: [],
      fromDate: [],
      toDate: []
    },
  }),
  methods: {
    async createPost() {
      if (this.loading) return

      if (!this.validatePost()) return

      this.loading = true

      await this.uploadImages()

      if (!this.validateImages()) {
        this.loading = false
        return
      }

      const list = (await database.ref('listInfoAndroidTest').once('value')).val()
      const inx = Array.isArray(list) ? list.length : Object.keys(list).length
      const infoAndroidRef = database.ref('listInfoAndroidTest')
      const post = { ...this.post }
      if (this.transition.type !== '') {
        post.TRANSITION = { type: this.transition.type.name }
        if (this.transition.productId !== '') post.TRANSITION.productId = this.transition.productId
        if (this.transition.catalogId !== '') post.TRANSITION.catalogId = this.transition.catalogId
        if (this.transition.stockId !== '') post.TRANSITION.stockId = this.transition.stockId
        if (this.transition.url !== '') post.TRANSITION.url = this.transition.url
        if (this.transition.productIds !== '') {
          const ids = this.transition.productIds.replace(/\s+/g, '').trim().split(',')
          post.TRANSITION.productIds = ids
        }
      }
      await infoAndroidRef.child(inx).set({
        ...post,
        fromDate: this.$moment(this.post.fromDate).format(this.serverDateFormat),
        toDate: this.$moment(this.post.toDate).format(this.serverDateFormat),
      })

      this.loading = false
      this.$router.push({ name: 'listInfoAndroid' })
    },
    uploadImages() {
      const files = ['filesRU', 'filesUK']

      const upload = (variable) => {
        return new Promise((resolve, reject) => {
          storage
            .ref()
            .child(`listInfo/${this[variable][0].name}`)
            .put(this[variable][0])
            .then(() => {
              storage
                .ref(`listInfo/${this[variable][0].name}`)
                .getDownloadURL()
                .then((url) => {
                  this.post.IMAGE[variable === 'filesRU' ? 'RU' : 'UK'] = url
                  resolve()
                })
            })
            .catch((error) => {
              reject(error)
            })
        })
      }

      return Promise.all([upload(files[0]), upload(files[1])])
    },
    validatePost() {
      // this.errors.BUTTON_RU = this.post.BUTTON.RU !== '' ? [] : ['Ru button name is required']
      // this.errors.BUTTON_UK = this.post.BUTTON.UK !== '' ? [] : ['Uk button name is required']
      this.errors.DESCR_RU = this.post.DESCR.RU !== '' ? [] : ['Ru description is required']
      this.errors.DESCR_UK = this.post.DESCR.UK !== '' ? [] : ['Uk description is required']
      this.errors.ID = this.post.ID !== '' ? [] : ['Post ID is required']
      this.errors.TITLE_RU = this.post.TITLE.RU !== '' ? [] : ['Ru title is required']
      this.errors.TITLE_UK = this.post.TITLE.UK !== '' ? [] : ['Uk title is required']
      // this.errors.fromDate = this.post.fromDate !== '' ? [] : ['From date is required']
      // this.errors.toDate = this.post.toDate !== '' ? [] : ['To date is required']

      let validated = true
      for (const k in this.errors) {
        if (this.errors[k].length) {
          validated = false
          break
        }
      }

      validated = validated ? this.validateImages(true) : validated

      return validated
    },
    validateImages(img = false) {
      const validRU = img ? this.filesRU.length !== 0 : this.post.IMAGE.RU !== ''
      const validUK = img ? this.filesUK.length !== 0 : this.post.IMAGE.UK !== ''
      if (!validRU || !validUK) {
        this.showToast('Images are required', {
          icon: 'fa-warning',
          position: 'bottom-right',
          type: 'error',
        })
      }
      return validRU && validUK
    },
  },
  watch: {
    'transition.type'() {
      this.transition.productId = ''
      this.transition.productIds = ''
      this.transition.catalogId = ''
      this.transition.stockId = ''
      this.transition.url = ''
    },
  },
}
</script>

<style lang="scss">
.post-picker-dropdown {
  &__badge {
    width: 100%;
    padding: 0.55rem 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
}

.post-icon {
  height: auto;
  min-height: 100%;
}

.post-icon-wrap {
  position: relative;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
