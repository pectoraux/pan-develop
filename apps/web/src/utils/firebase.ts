// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTb6Evfq1PhrI_TG3azwYED-TTghGQrsk",
  authDomain: "tiktok-a2bdb.firebaseapp.com",
  projectId: "tiktok-a2bdb",
  storageBucket: "tiktok-a2bdb.appspot.com",
  messagingSenderId: "45370985842",
  appId: "1:45370985842:web:52e42d37630e9e3ecee1eb",
  measurementId: "G-F959VMCZ0K",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// let instance;

// export function getFirebase() {
//   if (typeof window !== "undefined") {
//     if (instance) return instance;
//     instance = initializeApp(firebaseConfig);
//     return instance;
//   }

//   return null;
// }

// export const auth = getAuth();
let Firebase;

if (!firebase.apps.length) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export const Providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = firebase.auth();

export const firestore = firebase.firestore();

export default Firebase;
