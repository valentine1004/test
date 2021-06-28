const general = {
  methods: {
    keypressNumeric(event, isNegative = false) {
      if (
        (event.target.value[0] === '0' || (event.target.value[0] === '-' && event.target.value[1] === '0')) &&
        event.target.value.indexOf('.') === -1
      ) {
        event.target.value += '.'
      }
      if (event.which === 44 && event.target.value.indexOf('.') === -1) {
        event.target.value += '.'
      }
      if (isNegative) {
        if (event.which === 45 && event.target.value) {
          event.preventDefault()
        }
        if (event.which < 45 || event.which > 59 || event.which === 47) {
          event.preventDefault()
        }
      } else {
        if (event.which < 46 || event.which > 59 || event.which === 47) {
          event.preventDefault()
        }
      }
      if (event.which === 46 && event.target.value.indexOf('.') !== -1) {
        event.preventDefault()
      }
    }
  }
}

const datePickerTimeFix = {
  mounted() {
    /** For displaying time inputs */
    setTimeout(() => {
      const pickers = document.getElementsByClassName('flatpickr-calendar hasTime animate')
      if (pickers.length > 0) {
        pickers.forEach(tag => {
          if (tag.classList.contains('hasTime') && !tag.classList.contains('showTimeInput')) {
            tag.classList.add('showTimeInput')
          }
        })
      }
    }, 1000)
  }
}

export { general, datePickerTimeFix }
