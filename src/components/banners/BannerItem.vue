<template>
  <va-card v-if="banner !== null" :title="`Banner: ${cardTitle}`">
    <div class="form">
      <div class="row">
        <div class="flex md5 sm5 xs12">
          <va-input
            v-model="banner.ID"
            :error="!!errors.id.length"
            :error-messages="errors.id"
            @input="errors.id = []"
            label="Banner id"
            placeholder="Enter banner id"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md5 sm5 xs12">
          <va-select
            textBy="name"
            label="Banner transition type"
            v-model="transition.type"
            :options="transitionTypes"
            @input="onTypeChange"
          />
        </div>
      </div>
      <div class="row">
        <div v-if="webType" class="flex md6 sm6 xs12">
          <va-input v-model="transition.url" label="Banner transition url" placeholder="Enter transition url" />
        </div>
        <slot v-else-if="shopType">
          <div class="flex md6 sm6 xs12">
            <va-input
              v-model="transition.productId"
              label="Banner transition product ID"
              placeholder="Enter transition product ID"
            />
          </div>
          <div class="flex md6 sm6 xs12">
            <va-input
              v-model="transition.catalogId"
              label="Banner transition catalog ID"
              placeholder="Enter transition catalog ID"
            />
          </div>
        </slot>
        <div v-else-if="actionsType" class="flex md6 sm6 xs12">
          <va-input
            v-model="transition.stockId"
            label="Banner transition stock ID"
            placeholder="Enter transition stock ID"
          />
        </div>
        <div v-else-if="basketType || checkoutType" class="flex md6 sm6 xs12">
          <va-input
            v-model="transition.productIds"
            label="Banner transition product IDs"
            placeholder="Enter transition product IDs"
            :messages="[$t('banner.productIds.format')]"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md4 sm6 xs12 banner-icon-wrap">
              <img v-if="filesRU.length" class="banner-icon" :src="filesRUSrc" />
              <div v-else class="banner-icon" :style="iconStylesRU"></div>
            </div>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload icon (RU)">
                <va-file-upload type="single" v-model="filesRU" />
              </va-card>
            </div>
          </div>
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md4 sm6 xs12 banner-icon-wrap">
              <img v-if="filesUK.length" class="banner-icon" :src="filesUKSrc" />
              <div v-else class="banner-icon" :style="iconStylesUK"></div>
            </div>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload icon (UK)">
                <va-file-upload type="single" v-model="filesUK" />
              </va-card>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <va-toggle v-model="banner.isActive" label="Active" />
      </div>
      <div class="row">
        <va-button @click="editBanner" :disabled="loading">{{ 'Change' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, storage } from '@/services/firebase'
import { general } from '@/utils/general'
import { mapState } from 'vuex'

export default {
  name: 'BannerItem',
  mixins: [general],
  created() {
    const key = this.$route.params.key
    this.bannerRef = database.ref(`bannersV2/${key}`)
    this.bannerRef.once('value').then(this.bannerListener)
  },
  computed: {
    ...mapState({
      transitionTypes: (state) => state.app.transitionTypes,
    }),
    cardTitle() {
      return this.banner.ID
    },
    filesRUSrc() {
      return URL.createObjectURL(this.filesRU[0])
    },
    filesUKSrc() {
      return URL.createObjectURL(this.filesUK[0])
    },
    iconStylesRU() {
      return {
        backgroundImage: `url("${this.banner.IMAGE.RU}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }
    },
    iconStylesUK() {
      return {
        backgroundImage: `url("${this.banner.IMAGE.UK}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }
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
  },
  data: () => ({
    bannerRef: null,
    banner: null,
    transition: {
      productId: '',
      catalogId: '',
      productIds: '',
      stockId: '',
      url: '',
      type: '',
    },
    loading: false,
    errors: {
      id: [],
    },
    filesRU: [],
    filesUK: [],
  }),
  methods: {
    bannerListener(snapshot) {
      this.banner = { ...snapshot.val() }
      if (this.banner?.TRANSITION?.type) {
        const type = this.transitionTypes.find((el) => el.name === this.banner?.TRANSITION?.type)
        this.$set(this.transition, 'type', type)
      }
      this.$set(this.transition, 'productId', this.banner?.TRANSITION?.productId || '')
      this.$set(this.transition, 'stockId', this.banner?.TRANSITION?.stockId || '')
      this.$set(this.transition, 'productIds', this.banner?.TRANSITION?.productIds?.join(',') || '')
      this.$set(this.transition, 'catalogId', this.banner?.TRANSITION?.catalogId || '')
      this.$set(this.transition, 'url', this.banner?.TRANSITION?.url || '')
    },
    async editBanner() {
      if (this.loading) return

      if (!this.validateBanner()) return

      this.loading = true

      if (this.filesRU.length !== 0) {
        await this.uploadImage('filesRU')
      }
      if (this.filesUK.length !== 0) {
        await this.uploadImage('filesUK')
      }

      if (!this.validateImages()) {
        this.loading = false
        return
      }

      const banner = { ...this.banner }
      if (this.transition.type !== '') {
        banner.TRANSITION = { type: this.transition.type.name }
        if (this.transition.productId !== '') banner.TRANSITION.productId = this.transition.productId
        if (this.transition.catalogId !== '') banner.TRANSITION.catalogId = this.transition.catalogId
        if (this.transition.stockId !== '') banner.TRANSITION.stockId = this.transition.stockId
        if (this.transition.url !== '') banner.TRANSITION.url = this.transition.url
        if (this.transition.productIds !== '') {
          const ids = this.transition.productIds.replace(/\s+/g, '').trim().split(',')
          banner.TRANSITION.productIds = ids
        }
      } else {
        delete banner.TRANSITION
      }

      await this.bannerRef.set(banner, (error) => {
        if (error) {
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
          this.filesRU = []
          this.filesUK = []
        }
      })
      this.loading = false
    },
    uploadImage(variable) {
      return new Promise((resolve, reject) => {
        storage
          .ref()
          .child(`Banners/${this[variable][0].name}`)
          .put(this[variable][0])
          .then(() => {
            storage
              .ref(`Banners/${this[variable][0].name}`)
              .getDownloadURL()
              .then((url) => {
                this.banner.IMAGE[variable === 'filesRU' ? 'RU' : 'UK'] = url
                resolve()
              })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    validateBanner() {
      this.errors.id = this.banner.ID !== '' ? [] : ['Banner ID is required']

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
      const validRU = img
        ? this.banner.IMAGE.RU === ''
          ? this.filesRU.length !== 0
          : true
        : this.banner.IMAGE.RU !== ''
      const validUK = img
        ? this.banner.IMAGE.UK === ''
          ? this.filesUK.length !== 0
          : true
        : this.banner.IMAGE.UK !== ''
      if (!validRU || !validUK) {
        this.showToast('Images are required', {
          icon: 'fa-warning',
          position: 'bottom-right',
          type: 'error',
        })
      }
      return validRU && validUK
    },
    onTypeChange() {
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
.banner-picker-dropdown {
  &__badge {
    width: 100%;
    padding: 0.55rem 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
}

div.banner-icon {
  height: auto;
  min-height: 100%;
}

img.banner-icon {
  max-width: 100%;
  max-height: 100%;
}
</style>
