// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyClFrglPUX9fykS45oMz-yp-apgytFRrAA',
  authDomain: 'thinkstack-9d003.firebaseapp.com',
  projectId: 'thinkstack-9d003',
  storageBucket: 'thinkstack-9d003.firebasestorage.app',
  messagingSenderId: '639664757810',
  appId: '1:639664757810:web:0e616721049079bdbf702b',
  measurementId: 'G-0YMTJ4ZKD1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
