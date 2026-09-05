import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, doctorInfo, STATUS_DOC_PATH } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STATUS_META = {
  available: { label: "Available at home", color: "#23845b", pulse: true },
  busy: { label: "Busy — seeing a patient", color: "#c47a18", pulse: false },
  home_visit: { label: "On another home visit", color: "#3977b8", pulse: false },
  clinic: { label: "At the clinic", color: "#765bb0", pulse: false },
  away: { label: "Not in the village", color: "#7c828a", pulse: false },
  leave: { label: "On leave", color: "#4a4f54", pulse: false }
};

document.getElementById("doctorName").textContent = doctorInfo.name;
document.getElementById("doctorSpecialty").textContent = doctorInfo.specialty;
document.getElementById("plaqueFooter").innerHTML = doctorInfo.footerHtml || "";

const dotEl = document.getElementById("statusDot");
const labelEl = document.getElementById("statusLabel");
const updatedEl = document.getElementById("statusUpdated");
const noteEl = document.getElementById("statusNote");

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function render(data) {
  const meta = STATUS_META[data.status] || STATUS_META.away;
  dotEl.style.background = meta.color;
  dotEl.classList.toggle("pulse", !!meta.pulse);
  labelEl.textContent = meta.label;
  noteEl.textContent = data.note || "";

  if (data.updatedAt && data.updatedAt.toDate) {
    const d = data.updatedAt.toDate();
    updatedEl.textContent = `Updated ${timeAgo(d)}`;
    updatedEl.dataset.ts = d.getTime();
  } else {
    updatedEl.textContent = "";
  }
}

const ref = doc(db, STATUS_DOC_PATH.collection, STATUS_DOC_PATH.doc);

onSnapshot(
  ref,
  (snap) => {
    if (snap.exists()) {
      render(snap.data());
    } else {
      labelEl.textContent = "Status not set up yet";
      dotEl.style.background = "#7c828a";
      updatedEl.textContent = "";
    }
  },
  (err) => {
    console.error(err);
    labelEl.textContent = "Unable to load status";
    dotEl.style.background = "#7c828a";
    updatedEl.textContent = "Please check your internet connection and try again.";
  }
);

setInterval(() => {
  const ts = Number(updatedEl.dataset.ts);
  if (ts) updatedEl.textContent = `Updated ${timeAgo(new Date(ts))}`;
}, 30000);
