import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, STATUS_DOC_PATH, USERNAME_DOMAIN } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const ref = doc(db, STATUS_DOC_PATH.collection, STATUS_DOC_PATH.doc);

const loginCard = document.getElementById("loginCard");
const updateCard = document.getElementById("updateCard");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const saveError = document.getElementById("saveError");
const noteInput = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const lastSaved = document.getElementById("lastSaved");
const logoutBtn = document.getElementById("logoutBtn");
const statusSelect = document.getElementById("statusSelect");

function toInternalEmail(username) {
  const clean = username.trim().toLowerCase();
  return clean.includes("@") ? clean : `${clean}@${USERNAME_DOMAIN}`;
}

loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in…";
  try {
    await signInWithEmailAndPassword(auth, toInternalEmail(usernameInput.value), passwordInput.value);
  } catch (err) {
    loginError.textContent = "Unable to sign in. Please check your username and password.";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign in";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

saveBtn.addEventListener("click", async () => {
  saveError.textContent = "";
  const selectedStatus = statusSelect.value;
  if (!selectedStatus) {
    saveError.textContent = "Please select a status first.";
    return;
  }
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";
  try {
    await setDoc(ref, {
      status: selectedStatus,
      note: noteInput.value.trim(),
      updatedAt: serverTimestamp()
    });
    lastSaved.textContent = "Saved just now.";
  } catch (err) {
    saveError.textContent = "Unable to save. Please check your internet connection and try again.";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save status";
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginCard.classList.add("hidden");
    updateCard.classList.remove("hidden");
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        noteInput.value = data.note || "";
        if (data.status) statusSelect.value = data.status;
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    loginCard.classList.remove("hidden");
    updateCard.classList.add("hidden");
    statusSelect.value = "";
  }
});
