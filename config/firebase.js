import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: 'AIzaSyCjNtY8cjVHuyMr9A117AbtPH2F_x9SsBQ',
  authDomain: 'fir-auth-283ec.firebaseapp.com',
  projectId: 'fir-auth-283ec',
  storageBucket: 'fir-auth-283ec.appspot.com',
  messagingSenderId: '937457632320',
  appId: '1:937457632320:web:eeb1795cd5d789b90c4ba5',
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore and Firebase Storage
export const db = getFirestore(app);
export const storage = getStorage(app); // Export Firebase Storage
