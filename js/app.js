import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, doctorInfo, STATUS_DOC_PATH } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STATUS_META = {
  available: { label: "ఇంటి వద్ద అందుబాటులో ఉన్నారు", color: "#2f7d4f", pulse: true },
  busy: { label: "బిజీ — రోగిని చూస్తున్నారు", color: "#b9761f", pulse: false },
  home_visit: { label: "వేరే ఇంటి సందర్శనలో ఉన్నారు", color: "#3b6ea5", pulse: false },
  clinic: { label: "క్లినిక్‌లో ఉన్నారు", color: "#6b5b95", pulse: false },
  away: { label: "ఊరిలో లేరు", color: "#7c828a", pulse: false },
  leave: { label: "సెలవులో ఉన్నారు", color: "#4a4f54", pulse: false }
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
  if (seconds < 60) return "ఇప్పుడే";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} నిమిషాల క్రితం`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} గంటల క్రితం`;
  const days = Math.floor(hours / 24);
  return `${days} రోజుల క్రితం`;
}

function render(data) {
  const meta = STATUS_META[data.status] || STATUS_META.away;
  dotEl.style.background = meta.color;
  dotEl.classList.toggle("pulse", !!meta.pulse);
  labelEl.textContent = meta.label;
  noteEl.textContent = data.note || "";

  if (data.updatedAt && data.updatedAt.toDate) {
    const d = data.updatedAt.toDate();
    updatedEl.textContent = `${timeAgo(d)} అప్‌డేట్ చేయబడింది`;
    // Keep the relative time fresh without a full re-render.
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
      labelEl.textContent = "స్థితి ఇంకా సెటప్ చేయలేదు";
      dotEl.style.background = "#7c828a";
      updatedEl.textContent = "";
    }
  },
  (err) => {
    console.error(err);
    labelEl.textContent = "స్థితిని లోడ్ చేయలేకపోయాము";
    dotEl.style.background = "#7c828a";
    updatedEl.textContent = "మీ ఇంటర్నెట్ కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి";
  }
);

// Refresh the "x mins ago" text every 30s without waiting for a new snapshot.
setInterval(() => {
  const ts = Number(updatedEl.dataset.ts);
  if (ts) updatedEl.textContent = `${timeAgo(new Date(ts))} అప్‌డేట్ చేయబడింది`;
}, 30000);
