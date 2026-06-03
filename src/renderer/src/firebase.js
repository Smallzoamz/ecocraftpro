import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// ข้อมูลเชื่อมต่อ Firebase ของคุณ R
const firebaseConfig = {
  apiKey: 'AIzaSyDRadkbvFyGbxmwSYVV-sBaaMbmifNgsnU',
  authDomain: 'ecocraft-db.firebaseapp.com',
  projectId: 'ecocraft-db',
  storageBucket: 'ecocraft-db.firebasestorage.app',
  messagingSenderId: '451929595689',
  appId: '1:451929595689:web:02f1527f4d13e6093b2138'
}

// สั่งเปิดระบบและส่งออกตัวฐานข้อมูล (db) ไปให้หน้า Dashboard ใช้
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
