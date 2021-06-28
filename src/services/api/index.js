import axios from 'axios'

const BASE_API_URL = process.env.VUE_APP_REST_API_URL
const client = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? BASE_API_URL : '',
  withCredentials: false
})

client.defaults.headers['Cache-Control'] = 'no-cache, no-store'

const call = (method, url, data = null, params = null, cancelToken = null) => {
  return client({
    method,
    url,
    params,
    data,
    cancelToken
  })
}

const requests = {
  getCatalogSections: () => {
    return call(
      'GET',
      '/api/?controller=api&app_id=MakeAPP&app_key=du65ure9f7dewuhr844j569ifjr04oif&enc_request=GetCatalogSectionsNew'
    )
  },
  signIn: ({ email, password }) => {
    return call(
      'POST',
      'http://localhost:4000/users/login',
      { email, password }
    )
  },
  getUsers: () => {
    return call(
      'GET',
      'http://localhost:4000/users'
    )
  }
}

export default requests
