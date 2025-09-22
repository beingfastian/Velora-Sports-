// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNjcOp4iQng2dJ5xuqsOYW8kPrWl_hA8A",
  authDomain: "velora-sports.firebaseapp.com",
  projectId: "velora-sports",
  storageBucket: "velora-sports.firebasestorage.app",
  messagingSenderId: "113143515119",
  appId: "1:113143515119:web:ba5c1153a1cbde0ff0181a",
  measurementId: "G-RMRRZHSQF5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Initialize Analytics only on client side
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
