<template>
  <va-card :title="`Category: ${category.name.RU}`">
    <div class="form">
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.name.RU"
            :error="!!errors.nameRu.length"
            :error-messages="errors.nameRu"
            @input="errors.nameRu = []"
            label="Ru"
            placeholder="Enter RU name"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.name.UK"
            :error="!!errors.nameUk.length"
            :error-messages="errors.nameUk"
            @input="errors.nameUk = []"
            label="Uk"
            placeholder="Enter UK name"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.height"
            :error="!!errors.height.length"
            :error-messages="errors.height"
            @input="errors.height = []"
            @keypress="keypressNumeric"
            label="Height"
            placeholder="Enter height"
          />
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.iconHeight"
            :error="!!errors.iconHeight.length"
            :error-messages="errors.iconHeight"
            @input="errors.iconHeight = []"
            @keypress="keypressNumeric"
            label="Icon height"
            placeholder="Enter icon height"
          />
        </div>
      </div>
      <div class="row">
        <div class="flex md6 sm6 xs12">
          <va-dropdown class="category-picker-dropdown">
            <va-badge class="category-picker-dropdown__badge" :color="category.color" slot="anchor">{{
              category.color
            }}</va-badge>
            <va-advanced-color-picker class="my-1" v-model="category.color" />
          </va-dropdown>
        </div>
        <div class="flex md6 sm6 xs12">
          <va-input
            v-model="category.titleSize"
            :error="!!errors.titleSize.length"
            :error-messages="errors.titleSize"
            @input="errors.titleSize = []"
            @keypress="keypressNumeric"
            label="Title size"
            placeholder="Enter title size"
          />
        </div>
      </div>
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
          <va-toggle v-model="category.isTopTitle" label="Is top title" />
        </div>
        <div class="row">
          <div class="flex md6 sm6 xs12">
            <va-card title="Upload icon">
              <va-file-upload type="single" v-model="files" />
            </va-card>
          </div>
          <div class="flex md5 sm6 xs12 category-icon-wrap">
            <img v-if="files.length" class="category-icon" :src="iconSrc" />
          </div>
        </div>
      </div>
      <div class="row">
        <va-button @click="createCategory" :disabled="loading">{{ 'Create' }}</va-button>
      </div>
    </div>
  </va-card>
</template>

<script>
import { database, storage } from '@/services/firebase'
import { general } from '@/utils/general'

export default {
  name: 'CategoryCreate',
  mixins: [general],
  computed: {
    iconSrc() {
      return URL.createObjectURL(this.files[0])
    },
  },
  data: () => ({
    category: {
      color: '#000000',
      height: '',
      icon: '',
      iconHeight: '',
      id: '',
      isTopTitle: false,
      name: { RU: '', UK: '' },
      titleSize: '',
    },
    files: [],
    loading: false,
    errors: {
      height: [],
      iconHeight: [],
      id: [],
      nameRu: [],
      nameUk: [],
      titleSize: [],
    },
  }),
  methods: {
    async createCategory() {
      if (this.loading) return

      if (!this.validateCategory()) return

      this.loading = true

      await this.uploadIcon()

      if (!this.validateIcon()) {
        this.loading = false
        return
      }

      const list = (await database.ref('mainScreens/shopCategories').once('value')).val()
      const inx = Array.isArray(list) ? list.length : Object.keys(list).length
      const categoryRef = database.ref('mainScreens/shopCategories')
      await categoryRef.child(inx).set({
        ...this.category,
        height: +this.category.height,
        iconHeight: +this.category.iconHeight,
        titleSize: +this.category.titleSize,
      })

      this.loading = false
      this.$router.push({ name: 'categories' })
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
      this.errors.height = this.category.height !== '' ? [] : ['Height is required']
      this.errors.iconHeight = this.category.iconHeight !== '' ? [] : ['Icon height is required']
      this.errors.id = this.category.id !== '' ? [] : ['Category id is required']
      this.errors.nameRu = this.category.name.RU !== '' ? [] : ['Name is required']
      this.errors.nameUk = this.category.name.UK !== '' ? [] : ['Name is required']
      this.errors.titleSize = this.category.titleSize !== '' ? [] : ['Title size is required']

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
