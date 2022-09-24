import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

let db: Firestore
if (process.env.NODE_ENV === 'local') {
  db = getFirestore()
  connectFirestoreEmulator(db, 'localhost', 8080)
}
if (process.env.NODE_ENV === 'dev') {
  db = getFirestore(app)
}

export { db }
