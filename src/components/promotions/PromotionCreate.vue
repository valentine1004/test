<template>
  <va-card :title="`Promotion: ${cardTitle}`">
    <div class="form">
      <div class="row">
        <div class="flex md4 sm4 xs12">
          <va-input
            v-model="promotion.ID"
            :error="!!errors.id.length"
            :error-messages="errors.id"
            @input="errors.id = []"
            label="Promotion ID"
            placeholder="Enter promotion ID"
          />
        </div>
        <div class="flex md4 sm4 xs12">
          <va-input
            v-model="promotion.TITLE.RU"
            :error="!!errors.titleRu.length"
            :error-messages="errors.titleRu"
            @input="errors.titleRu = []"
            label="Title (Ru)"
            placeholder="Enter RU title"
          />
        </div>
        <div class="flex md4 sm4 xs12">
          <va-input
            v-model="promotion.TITLE.UK"
            :error="!!errors.titleUk.length"
            :error-messages="errors.titleUk"
            @input="errors.titleUk = []"
            label="Title (Uk)"
            placeholder="Enter UK title"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md5 sm5 xs12">
          <va-select
            textBy="name"
            label="Promotion transition type"
            v-model="transition.type"
            :options="transitionTypes"
          />
        </div>
      </div>
      <div class="row">
        <div v-if="webType" class="flex md5 sm5 xs12">
          <va-input v-model="transition.url" label="Promotion transition url" placeholder="Enter transition url" />
        </div>
        <slot v-else-if="shopType">
          <div class="flex md5 sm5 xs12">
            <va-input
              v-model="transition.productId"
              label="Promotion transition product ID"
              placeholder="Enter transition product ID"
            />
          </div>
          <div class="flex md5 sm5 xs12">
            <va-input
              v-model="transition.catalogId"
              label="Promotion transition catalog ID"
              placeholder="Enter transition catalog ID"
            />
          </div>
        </slot>
        <div v-else-if="actionsType" class="flex md5 sm5 xs12">
          <va-input
            v-model="transition.stockId"
            label="Promotion transition stock ID"
            placeholder="Enter transition stock ID"
          />
        </div>
        <div v-else-if="basketType || checkoutType" class="flex md5 sm5 xs12">
          <va-input
            v-model="transition.productIds"
            label="Promotion transition product IDs"
            placeholder="Enter transition product IDs"
            :messages="[$t('promotion.productIds.format')]"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <transition name="fade">
              <div v-if="imagesRU.length" class="flex md4 sm6 xs12 promotion-icon-wrap">
                <img class="promotion-icon" :src="imagesRUSrc" />
              </div>
            </transition>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload image (RU)">
                <va-file-upload type="single" v-model="imagesRU" />
              </va-card>
            </div>
          </div>
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <transition name="fade">
              <div v-if="imagesUK.length" class="flex md4 sm6 xs12 promotion-icon-wrap">
                <img class="promotion-icon" :src="imagesUKSrc" />
              </div>
            </transition>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload image (UK)">
                <va-file-upload type="single" v-model="imagesUK" />
              </va-card>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <transition name="fade">
              <div v-if="imagesBigRU.length" class="flex md4 sm6 xs12 promotion-icon-wrap">
                <img class="promotion-icon" :src="imagesBigRUSrc" />
              </div>
            </transition>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload big image (RU)">
                <va-file-upload type="single" v-model="imagesBigRU" />
              </va-card>
            </div>
          </div>
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <transition name="fade">
              <div v-if="imagesBigUK.length" class="flex md4 sm6 xs12 promotion-icon-wrap">
                <img class="promotion-icon" :src="imagesBigUKSrc" />
              </div>
            </transition>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload big image (UK)">
                <va-file-upload type="single" v-model="imagesBigUK" />
              </va-card>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="promotion.DESCR.RU"
            :error="!!errors.descrRu.length"
            :error-messages="errors.descrRu"
            @input="errors.descrRu = []"
            label="Description (Ru)"
            type="textarea"
            autosize
            placeholder="Enter RU description"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="promotion.DESCR.UK"
            :error="!!errors.descrUk.length"
            :error-messages="errors.descrUk"
            @input="errors.descrUk = []"
            label="Description (Uk)"
            type="textarea"
            autosize
            placeholder="Enter UK description"
          />
        </div>
      </div>
      <div class="row">
        <va-toggle v-model="promotion.isActive" label="Active" />
      </div>
      <div class="row">
        <va-button @click="createPromotion" :disabled="loading">{{ 'Create' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, storage } from '@/services/firebase'
import { general } from '@/utils/general'
import { mapState } from 'vuex'

export default {
  name: 'PromotionCreate',
  mixins: [general],
  computed: {
    ...mapState({
      transitionTypes: (state) => state.app.transitionTypes,
    }),
    cardTitle() {
      const locale = this.$i18n.locale() === 'ua' ? 'UK' : this.$i18n.locale().toUpperCase()
      return this.promotion?.TITLE?.[locale] || ''
    },
    imagesRUSrc() {
      return URL.createObjectURL(this.imagesRU[0])
    },
    imagesUKSrc() {
      return URL.createObjectURL(this.imagesUK[0])
    },
    imagesBigRUSrc() {
      return URL.createObjectURL(this.imagesBigRU[0])
    },
    imagesBigUKSrc() {
      return URL.createObjectURL(this.imagesBigUK[0])
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
    promotion: {
      ID: '',
      TITLE: {
        RU: '',
        UK: '',
      },
      DESCR: {
        RU: '',
        UK: '',
      },
      IMAGE: {
        RU: '',
        UK: '',
      },
      IMAGE_BIG: {
        RU: '',
        UK: '',
      },
      isActive: true
    },
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
      titleRu: [],
      titleUk: [],
      descrRu: [],
      descrUk: [],
      catalogId: [],
      type: [],
    },
    imagesRU: [],
    imagesUK: [],
    imagesBigRU: [],
    imagesBigUK: [],
  }),
  methods: {
    async createPromotion() {
      if (this.loading) return

      if (!this.validatePromotion()) return

      this.loading = true

      await this.uploadImages()

      if (!this.validateImages()) {
        this.loading = false
        return
      }

      const list = (await database.ref('actionsV3').once('value')).val()
      const inx = Array.isArray(list) ? list.length : Object.keys(list).length
      const promotionRef = database.ref('actionsV3')
      const promotion = { ...this.promotion }
      if (this.transition.type !== '') {
        promotion.TRANSITION = { type: this.transition.type.name }
        if (this.transition.productId !== '') promotion.TRANSITION.productId = this.transition.productId
        if (this.transition.catalogId !== '') promotion.TRANSITION.catalogId = this.transition.catalogId
        if (this.transition.stockId !== '') promotion.TRANSITION.stockId = this.transition.stockId
        if (this.transition.url !== '') promotion.TRANSITION.url = this.transition.url
        if (this.transition.productIds !== '') {
          const ids = this.transition.productIds.replace(/\s+/g, '').trim().split(',')
          promotion.TRANSITION.productIds = ids
        }
      }
      await promotionRef.child(inx).set(promotion)

      this.loading = false
      this.$router.push({ name: 'promotions' })
    },
    uploadImages() {
      const vars = [
        ['IMAGE', 'imagesRU'],
        ['IMAGE', 'imagesUK'],
        ['IMAGE_BIG', 'imagesBigRU'],
        ['IMAGE_BIG', 'imagesBigUK'],
      ]

      const upload = (variable) => {
        return new Promise((resolve, reject) => {
          storage
            .ref()
            .child(`Actions20/${this[variable[1]][0].name}`)
            .put(this[variable[1]][0])
            .then(() => {
              storage
                .ref(`Actions20/${this[variable[1]][0].name}`)
                .getDownloadURL()
                .then((url) => {
                  let key
                  switch (variable[1]) {
                    case 'imagesRU':
                      key = 'RU'
                      break
                    case 'imagesUK':
                      key = 'UK'
                      break
                    case 'imagesBigRU':
                      key = 'RU'
                      break
                    case 'imagesBigUK':
                      key = 'UK'
                      break
                  }
                  this.promotion[variable[0]][key] = url
                  resolve()
                })
            })
            .catch((error) => {
              reject(error)
            })
        })
      }

      return Promise.all([upload(vars[0]), upload(vars[1]), upload(vars[2]), upload(vars[3])])
    },
    validatePromotion() {
      this.errors.id = this.promotion.ID !== '' ? [] : ['Promotion ID is required']
      this.errors.titleRu = this.promotion.TITLE.RU !== '' ? [] : ['Title is required']
      this.errors.titleUk = this.promotion.TITLE.UK !== '' ? [] : ['Title is required']
      this.errors.descrRu = this.promotion.DESCR.RU !== '' ? [] : ['Description is required']
      this.errors.descrUk = this.promotion.DESCR.UK !== '' ? [] : ['Description is required']

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
    validateImages(img) {
      const validRU = img
        ? this.promotion.IMAGE.RU === ''
          ? this.imagesRU.length !== 0
          : true
        : this.promotion.IMAGE.RU !== ''
      const validUK = img
        ? this.promotion.IMAGE.UK === ''
          ? this.imagesUK.length !== 0
          : true
        : this.promotion.IMAGE.UK !== ''
      const validBigRU = img
        ? this.promotion.IMAGE_BIG.RU === ''
          ? this.imagesRU.length !== 0
          : true
        : this.promotion.IMAGE_BIG.RU !== ''
      const validBigUK = img
        ? this.promotion.IMAGE_BIG.UK === ''
          ? this.imagesUK.length !== 0
          : true
        : this.promotion.IMAGE_BIG.UK !== ''

      if (!validRU || !validUK || !validBigRU || !validBigUK) {
        this.showToast('Images are required', {
          icon: 'fa-warning',
          position: 'bottom-right',
          type: 'error',
        })
      }
      return validRU && validUK && validBigRU && validBigUK
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
.promotion-icon-wrap {
  position: relative;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
