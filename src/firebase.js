import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYBLjeex_H34T_z2-c3Mtle2Cp6FSV89Q",
  authDomain: "mymusic-app-fee4f.firebaseapp.com",
  projectId: "mymusic-app-fee4f",
  storageBucket: "mymusic-app-fee4f.firebasestorage.app",
  messagingSenderId: "1039980304473",
  appId: "1:1039980304473:web:1c28728c7201e184bbf948",
  measurementId: "G-6XQWTWHW8E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);