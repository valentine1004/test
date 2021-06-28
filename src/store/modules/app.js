export default {
  state: {
    sidebar: {
      opened: false
    },
    config: {
      palette: {
        primary: '#4ae387',
        danger: '#e34a4a',
        info: '#4ab2e3',
        success: '#db76df',
        warning: '#f7cc36',
        white: '#fff',
        black: '#000',
        fontColor: '#34495e',
        transparent: 'transparent',
        lighterGray: '#ddd'
      }
    },
    isLoading: true,
    transitionTypes: [
      { id: 0, name: 'Actions' },
      { id: 1, name: 'Shop' },
      { id: 2, name: 'Web' },
      { id: 3, name: 'Checkout' },
      { id: 4, name: 'Basket' },
      { id: 5, name: 'Account' },
      { id: 6, name: 'Orders' }
    ]
  },
  getters: {
    config: state => state.app.config,
    palette: state => state.app.config.palette,
    isLoading: state => state.app.isLoading
  },
  actions: {},
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    }
  }
}
