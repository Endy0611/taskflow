// src/services/authService.js
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
  applyPersistence,
} from "../Implement/firebase/firebase-config";

export async function loginWithEmail({ email, password, remember }) {
  await applyPersistence(remember);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user; // {uid, email, displayName, photoURL}
}

export async function loginWithGoogle({ remember }) {
  await applyPersistence(remember);
  const { user } = await signInWithPopup(auth, googleProvider);
  return user;
}

export async function loginWithGithub({ remember }) {
  await applyPersistence(remember);
  const { user } = await signInWithPopup(auth, githubProvider);
  return user;
}

export async function loginWithFacebook({ remember }) {
  await applyPersistence(remember);
  const { user } = await signInWithPopup(auth, facebookProvider);
  return user;
}

// src/services/authService.js

export const getCurrentUserToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return user.token; // Assuming user object contains the token
  }
  return null;  // If no user or token is found
};


export function observeAuth(callback) {
  // callback(user or null)
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  await signOut(auth);
}

export async function ensureDisplayName(name) {
  if (auth.currentUser && !auth.currentUser.displayName && name) {
    await updateProfile(auth.currentUser, { displayName: name });
  }
}
