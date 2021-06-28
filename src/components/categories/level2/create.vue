<template>
  <va-card :title="`Category: ${category.id}`">
    <div class="form">
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.id"
            :error="!!errors.id.length"
            :error-messages="errors.id"
            @input="errors.id = []"
            label="Category id"
            disabled
            placeholder="Enter category id"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <div class="row">
            <div class="flex md4 sm6 xs12 category-icon-wrap">
              <img v-if="files.length" class="category-icon" :src="iconSrc" />
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
        <va-button @click="addIcon" :disabled="loading">{{ 'Change' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, storage } from '@/services/firebase'
import { general } from '@/utils/general'

export default {
  mixins: [general],
  created() {
    this.category.id = this.$route.params.id
  },
  computed: {
    iconSrc() {
      return URL.createObjectURL(this.files[0])
    },
  },
  data: () => ({
    category: {
      icon: '',
      id: '',
    },
    files: [],
    loading: false,
    errors: {
      id: [],
    },
  }),
  methods: {
    async addIcon() {
      if (this.loading) return

      if (!this.validateCategory()) return

      this.loading = true

      await this.uploadIcon()

      if (!this.validateIcon()) {
        this.loading = false
        return
      }

      const list = (await database.ref('mainScreensTest/shopCategories2Level').once('value')).val()
      const inx = Array.isArray(list) ? list.length : Object.keys(list).length
      const categoryRef = database.ref('mainScreensTest/shopCategories2Level')
      await categoryRef.child(inx).set({
        ...this.category,
      })

      this.loading = false
      this.$router.push({ name: 'categories2Level' })
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
      const valid = img ? this.files.length !== 0 : this.category.icon !== ''
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

.category-icon-wrap {
  position: relative;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
