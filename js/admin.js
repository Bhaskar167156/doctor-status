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
  // If someone still types a full email, respect it as-is.
  return clean.includes("@") ? clean : `${clean}@${USERNAME_DOMAIN}`;
}

loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "సైన్ ఇన్ అవుతోంది…";
  try {
    await signInWithEmailAndPassword(auth, toInternalEmail(usernameInput.value), passwordInput.value);
  } catch (err) {
    loginError.textContent = "సైన్ ఇన్ కాలేకపోయాము. వినియోగదారు పేరు మరియు పాస్‌వర్డ్ సరిచూడండి.";
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "సైన్ ఇన్";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

saveBtn.addEventListener("click", async () => {
  saveError.textContent = "";
  const selectedStatus = statusSelect.value;
  if (!selectedStatus) {
    saveError.textContent = "ముందు ఒక స్థితిని ఎంచుకోండి.";
    return;
  }
  saveBtn.disabled = true;
  saveBtn.textContent = "సేవ్ అవుతోంది…";
  try {
    await setDoc(ref, {
      status: selectedStatus,
      note: noteInput.value.trim(),
      updatedAt: serverTimestamp()
    });
    lastSaved.textContent = "ఇప్పుడే సేవ్ చేయబడింది.";
  } catch (err) {
    saveError.textContent = "సేవ్ చేయలేకపోయాము. మీ ఇంటర్నెట్ కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి.";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "స్థితిని సేవ్ చేయండి";
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
