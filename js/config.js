// ============================================================
// EDIT THIS FILE with your own details. No coding needed beyond
// filling in the blanks below. See README.md for step-by-step help.
// ============================================================

// 1. Paste the config object Firebase gives you when you create
//    a Web App inside your Firebase project (Project settings > Your apps).
export const firebaseConfig = {
  apiKey: "AIzaSyC33jf1a10laZ7MeX-BHdPE35XhXvveo_8",
  authDomain: "doctor-status.firebaseapp.com",
  projectId: "doctor-status",
  storageBucket: "doctor-status.firebasestorage.app",
  messagingSenderId: "702653399520",
  appId: "1:702653399520:web:048f4eebb191f64554ab85"
};

// 2. Doctor / clinic details shown on the public page.
export const doctorInfo = {
  name: "Dr. Mavuduri Rambabu",
  specialty: "General Physician",
  // Shown at the bottom of the public status card. Keep it short.
  footerHtml: "Home visits by appointment · Please call for details"
};

// 3. Firestore location where the live status is stored.
//    You normally don't need to change this.
export const STATUS_DOC_PATH = { collection: "status", doc: "current" };

// 4. Staff sign in with a plain username + password (not an email).
//    Internally we turn "rambabu" into "rambabu@doctor-status.local"
//    before handing it to Firebase, since Firebase's password login
//    technically needs something shaped like an email. Nothing is ever
//    sent to that address — it's just an internal ID, never a real inbox.
//    You don't need to change this unless you want a different suffix.
export const USERNAME_DOMAIN = "doctor-status.local";
