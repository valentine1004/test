import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import { saveAs } from 'file-saver'
import { orderBy } from 'lodash'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  authDomain: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.VUE_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
})

const database = firebase.database()
const storage = firebase.storage()
const authObj = firebase.auth()

const auth = {
  login(email, password) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      authObj
        .signOut()
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchUser() {
    return authObj.currentUser
  }
}

const transferBanners = () => {
  const prodRef = database.ref('banners')
  const testRef = database.ref('bannersV2')

  let list = []
  prodRef.get().then(snapshot => {
    if (snapshot.exists()) {
      list = [...snapshot.val()].map(el => {
        if (el.name) {
          el.ID = el?.name
          delete el?.name
        }

        if (el.transition) {
          el.TRANSITION = { type: el.transition }
          if (el?.productId) {
            el.TRANSITION.productId = el?.productId
            delete el.productId
          }
          if (el?.productIds) {
            el.TRANSITION.productIds = el?.productIds
            delete el.productIds
          }
          if (el?.catalogId) {
            el.TRANSITION.catalogId = el?.catalogId
            delete el.catalogId
          }
          if (el?.stockId) {
            el.TRANSITION.stockId = el?.stockId
            delete el.stockId
          }
          if (el?.url) {
            el.TRANSITION.url = el?.url
            delete el.url
          }
          delete el.transition
        }

        return el
      })
      testRef.set(list)
    }
  })
}

const transferPromotions = () => {
  const prodRef = database.ref('actions')
  const testRef = database.ref('actionsV3')

  let list = []
  prodRef.get().then(snapshot => {
    if (snapshot.exists()) {
      list = [...snapshot.val()].map(el => {
        if (el.fileName) {
          el.ID = el?.fileName
          delete el?.fileName
        }

        return el
      })
      testRef.set(list)
    }
  })
}

const transferMaintenanceMode = () => {
  const prodRef = database.ref('technicalWork')
  const testRef = database.ref('technicalWorkTest')

  prodRef.get().then(snapshot => {
    if (snapshot.exists()) {
      testRef.set({ ...snapshot.val() })
    }
  })
}

const exportUnacceptedPolicies = async platform => {
  const platforms = ['Android', 'iOS']
  if (!platform || !platforms.includes(platform)) return

  const ref = database.ref(`policy/users/${platform}`)
  const cellsList = []
  document.body.style.cursor = 'wait'
  const snapshot = await ref.get()
  if (snapshot.exists()) {
    const data = { ...snapshot.val() }
    let cells
    for (const $k in data) {
      cells = data[$k]
      for (const cellN in cells) {
        if (cells[cellN]?.policy?.accepted === false) {
          cellsList.push({
            cell: cellN,
            accepted: cells[cellN]?.policy.accepted,
            policyDate: cells[cellN]?.policy.policyDate,
            updateDate: cells[cellN]?.policy.updateDate
          })
        }
      }
    }
  }

  if (cellsList.length === 0) alert('There is no data!')
  else {
    const blob = new Blob(
      orderBy(cellsList, 'updateDate', 'desc').map((item, $k) => {
        const head = 'Cell  |  Accepted  |  PolicyDate  |  UpdatedDate \n\n'
        if ($k === 0) return head
        else return `${item.cell} | ${item.accepted} | ${item.policyDate} | ${item.updateDate} \n`
      }),
      { type: 'text/plain;charset=utf-8' }
    )
    saveAs(blob, `${platform}.txt`)
  }
  document.body.style.cursor = 'default'
}

export {
  database,
  storage,
  auth,
  authObj,
  transferBanners,
  transferPromotions,
  transferMaintenanceMode,
  exportUnacceptedPolicies
}
