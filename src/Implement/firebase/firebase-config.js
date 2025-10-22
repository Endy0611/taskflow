// src/Implement/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

// ✅ Load Firebase config from environment variables
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId is optional for analytics only
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Sanity check: warn instead of throwing hard error
if (!cfg.apiKey) {
  console.warn(
    "⚠️ Firebase API key is missing. Check your environment variables (.env.production or Vercel Settings).",
    cfg
  );
} else {
  console.log("🔥 Firebase config loaded successfully:", {
    apiKeyPrefix: cfg.apiKey.slice(0, 6),
    projectId: cfg.projectId,
  });
}

// ✅ Initialize Firebase app
const app = initializeApp(cfg);
export const auth = getAuth(app);

// ✅ Export auth persistence helpers
export { setPersistence, browserLocalPersistence, browserSessionPersistence };
