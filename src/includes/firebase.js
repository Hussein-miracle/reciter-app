// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, serverTimestamp,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAVsIWswbYu8CgRLoOEknmGAITR_8qnl_A',
  authDomain: 'vue-music-2df39.firebaseapp.com',
  projectId: 'vue-music-2df39',
  storageBucket: 'vue-music-2df39.appspot.com',
  messagingSenderId: '213880509498',
  appId: '1:213880509498:web:41edea9d2f3939df83d103',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log(app.name, 'firestore app name');

const auth = getAuth(app);

// console.log(auth, 'auth');

const firestoreDb = getFirestore(app);

// console.log(firestore, 'firestore');

const usersCollection = collection(firestoreDb, 'users');

export default {
  auth, firestoreDb, createUserWithEmailAndPassword, usersCollection, addDoc, serverTimestamp, updateProfile, onAuthStateChanged, signInWithEmailAndPassword, signOut,
};
