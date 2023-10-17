import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authtest-3e4f7.firebaseapp.com",
  projectId: "authtest-3e4f7",
  storageBucket: "authtest-3e4f7.appspot.com",
  messagingSenderId: "369943110242",
  appId: "1:369943110242:web:2bf4335dace321ab62273b",
};

export const initFirebase = () => initializeApp(firebaseConfig);
