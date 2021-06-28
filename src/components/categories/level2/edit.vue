<template>
  <va-card v-if="category !== null" :title="`Category: ${cardTitle}`">
    <div class="form">
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.id"
            :error="!!errors.id.length"
            :error-messages="errors.id"
            @input="errors.id = []"
            label="Category id"
            placeholder="Enter category id"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md4 sm6 xs12 category-icon-wrap">
              <img v-if="files.length" class="category-icon" :src="iconSrc" />
              <div v-else class="category-icon" :style="iconStyles"></div>
            </div>
            <div class="flex md8 sm6 xs12">
              <va-card title="Upload icon">
                <va-file-upload type="single" v-model="files" />
              </va-card>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <va-button @click="editCategory" :disabled="loading">{{ 'Change' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import Vue from 'vue'
import { database, storage } from '@/services/firebase'
import { general } from '@/utils/general'
import api from '@/services/api'

export default {
  name: 'CategoryItem',
  mixins: [general],
  created() {
    const key = this.$route.params.key
    this.categoryRef = database.ref(`mainScreensTest/shopCategories2Level/${key}`)
    this.categoryRef.once('value').then(this.categoryListener)
  },
  data: () => ({
    categoryRef: null,
    category: null,
    additionalData: null,
    loading: false,
    errors: {
      height: [],
      iconHeight: [],
      id: [],
      nameRu: [],
      nameUk: [],
      titleSize: [],
    },
    files: [],
  }),
  computed: {
    cardTitle() {
      return this.additionalData
        ? Vue.i18n.locale() === 'ru'
          ? this.additionalData.NAME.RU
          : this.additionalData.NAME.UK
        : this.category.id
    },
    iconStyles() {
      return {
        backgroundImage: `url(${this.category.icon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }
    },
    iconSrc() {
      return URL.createObjectURL(this.files[0])
    },
  },
  methods: {
    async categoryListener(snapshot) {
      this.category = { ...snapshot.val() }

      await this.getAdditionalData()
    },
    async editCategory() {
      if (this.loading) return

      if (!this.validateCategory()) return

      this.loading = true

      if (this.files.length !== 0) {
        await this.uploadIcon()
      }

      if (!this.validateIcon()) {
        this.loading = false
        return
      }

      await this.categoryRef.set(
        {
          ...this.category,
        },
        (error) => {
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
            this.files = []
          }
        }
      )

      await this.getAdditionalData()

      this.loading = false
    },
    getAdditionalData() {
      return new Promise((resolve, reject) => {
        api
          .getCatalogSections()
          .then((r) => {
            const c = r.data.data.find((el) => el.ID === this.category.id)
            if (c) this.additionalData = { ...c }
            else this.additionalData = null
            resolve()
          })
          .catch((error) => {
            this.additionalData = null
            reject(error)
          })
      })
    },
    uploadIcon() {
      return new Promise((resolve, reject) => {
        storage
          .ref()
          .child(`MainSreens/Categories/${this.files[0].name}`)
          .put(this.files[0])
          .then(() => {
            storage
              .ref(`MainSreens/Categories/${this.files[0].name}`)
              .getDownloadURL()
              .then((url) => {
                this.category.icon = url
                resolve()
              })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    validateCategory() {
      this.errors.id = this.category.id !== '' ? [] : ['Category id is required']

      let validated = true
      for (const k in this.errors) {
        if (this.errors[k].length) {
          validated = false
          break
        }
      }

      validated = validated ? this.validateIcon(true) : validated

      return validated
    },
    validateIcon(img = false) {
      const valid = img ? (this.category.icon === '' ? this.files.length !== 0 : true) : this.category.icon !== ''
      if (!valid) {
        this.showToast('Icon is required', {
          icon: 'fa-warning',
          position: 'bottom-right',
          type: 'error',
        })
      }
      return valid
    },
  },
}
</script>

<style lang="scss">
.category-picker-dropdown {
  &__badge {
    width: 100%;
    padding: 0.55rem 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
}

div.category-icon {
  height: auto;
  min-height: 100%;
}

img.category-icon {
  max-width: 100%;
  max-height: 100%;
}
</style>
