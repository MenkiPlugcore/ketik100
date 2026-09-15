const LESSONS = {
  huruf: {
    title: "Kenal Huruf",
    instruction: "Ketik huruf yang kamu lihat di bawah ini.",
    items: ["a s d f", "j k l", "m n b v", "c x z", "q w e r t y"]
  },
  kata: {
    title: "Kata Pendek",
    instruction: "Ketik kata sederhana di bawah ini.",
    items: ["buku meja tas", "ibu ayah guru", "makan minum mandi", "bola kucing rumah", "belajar sekolah teman"]
  },
  kalimat: {
    title: "Kalimat",
    instruction: "Ketik kalimat sederhana dengan pelan dan teliti.",
    items: [
      "Saya suka belajar.",
      "Nama saya siswa hebat.",
      "Saya duduk dengan rapi.",
      "Saya mengetik dengan pelan.",
      "Hari ini saya belajar komputer."
    ]
  },
  angka: {
    title: "Angka",
    instruction: "Ketik angka yang kamu lihat di bawah ini.",
    items: ["1 2 3 4 5", "6 7 8 9 0", "10 20 30", "12 15 18", "100 200 300"]
  }
};

const KEYBOARD_ROWS = [
  "1234567890".split(""),
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  "zxcvbnm".split("")
];

const lessonGrid = document.getElementById("lessonGrid");
const practiceTitle = document.getElementById("practiceTitle");
const instruction = document.getElementById("instruction");
const targetLine = document.getElementById("targetLine");
const typingInput = document.getElementById("typingInput");
const feedbackMessage = document.getElementById("feedbackMessage");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const accuracyStat = document.getElementById("accuracyStat");
const wpmStat = document.getElementById("wpmStat");
const correctStat = document.getElementById("correctStat");
const roundStat = document.getElementById("roundStat");
const keyboard = document.getElementById("keyboard");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const speakTarget = document.getElementById("speakTarget");
const listenIntro = document.getElementById("listenIntro");
const soundToggle = document.getElementById("soundToggle");
const focusToggle = document.getElementById("focusToggle");

let currentLesson = "huruf";
let currentIndex = 0;
let startedAt = null;
let soundEnabled = localStorage.getItem("ketik100-sound") !== "off";
let completed = false;
let completionAnnounced = false;

function renderKeyboard() {
  keyboard.innerHTML = "";
  KEYBOARD_ROWS.flat().forEach((key) => {
    const el = document.createElement("span");
    el.className = "key";
    el.dataset.key = key;
    el.textContent = key.toUpperCase();
    keyboard.appendChild(el);
  });
}

function getTarget() {
  return LESSONS[currentLesson].items[currentIndex];
}

function renderTarget() {
  const target = getTarget();
  const typed = typingInput.value;
  targetLine.innerHTML = "";

  [...target].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "target-char";
    span.textContent = char === " " ? "\u00A0" : char;

    if (index < typed.length) {
      span.classList.add(typed[index] === char ? "correct" : "wrong");
    } else if (index === typed.length) {
      span.classList.add("current");
    }
    targetLine.appendChild(span);
  });

  highlightNextKey();
}

function highlightNextKey() {
  document.querySelectorAll(".key.active").forEach((el) => el.classList.remove("active"));
  const target = getTarget();
  const nextChar = (target[typingInput.value.length] || "").toLowerCase();
  if (!nextChar || nextChar === " ") return;

  const key = [...keyboard.querySelectorAll(".key")].find((el) => el.dataset.key === nextChar);
  if (key) key.classList.add("active");
}

function calculateStats() {
  const target = getTarget();
  const typed = typingInput.value;
  let correct = 0;

  for (let i = 0; i < typed.length; i += 1) {
    if (typed[i] === target[i]) correct += 1;
  }

  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const elapsedMinutes = startedAt ? Math.max((Date.now() - startedAt) / 60000, 1 / 60) : 0;
  const wpm = elapsedMinutes ? Math.max(0, Math.round((correct / 5) / elapsedMinutes)) : 0;

  accuracyStat.textContent = `${accuracy}%`;
  wpmStat.textContent = String(wpm);
  correctStat.textContent = String(correct);
  return { correct, accuracy, wpm };
}

function updateFeedback() {
  const target = getTarget();
  const typed = typingInput.value;
  const wasCompleted = completed;
  completed = typed === target;

  typingInput.classList.toggle("success", completed);
  nextBtn.disabled = !completed;

  if (completed) {
    feedbackMessage.textContent = "Hebat! Latihan ini selesai. Kamu boleh lanjut.";
    feedbackMessage.className = "feedback-message success";
    if (!wasCompleted && !completionAnnounced && soundEnabled) {
      completionAnnounced = true;
      speak("Hebat! Latihan selesai. Kamu boleh lanjut.");
    }
    saveProgress();
  } else if (typed.length > target.length || [...typed].some((char, i) => char !== target[i])) {
    completionAnnounced = false;
    feedbackMessage.textContent = "Tidak apa-apa. Periksa huruf yang berwarna merah lalu coba lagi.";
    feedbackMessage.className = "feedback-message warning";
  } else if (typed.length > 0) {
    completionAnnounced = false;
    feedbackMessage.textContent = "Bagus, lanjutkan pelan-pelan.";
    feedbackMessage.className = "feedback-message";
  } else {
    completionAnnounced = false;
    feedbackMessage.textContent = "Siap? Tekan kotak di atas lalu mulai mengetik.";
    feedbackMessage.className = "feedback-message";
  }
}

function updateProgress() {
  const total = LESSONS[currentLesson].items.length;
  const done = currentIndex + (completed ? 1 : 0);
  progressBar.style.width = `${Math.min(100, (done / total) * 100)}%`;
  roundStat.textContent = `${currentIndex + 1}/${total}`;
}

function loadLesson(key, { scroll = false } = {}) {
  currentLesson = key;
  currentIndex = 0;
  startedAt = null;
  completed = false;
  completionAnnounced = false;

  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.lesson === key);
  });

  practiceTitle.textContent = LESSONS[key].title;
  instruction.textContent = LESSONS[key].instruction;
  typingInput.value = "";
  typingInput.classList.remove("success");
  nextBtn.disabled = true;
  nextBtn.textContent = "Latihan berikutnya →";
  feedbackMessage.textContent = "Siap? Tekan kotak di atas lalu mulai mengetik.";
  feedbackMessage.className = "feedback-message";

  renderTarget();
  calculateStats();
  updateProgress();
  saveProgress();

  if (scroll) {
    document.getElementById("latihan").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => typingInput.focus({ preventScroll: true }), 350);
  }
}

function nextRound() {
  const total = LESSONS[currentLesson].items.length;
  if (!completed) return;

  if (currentIndex < total - 1) {
    currentIndex += 1;
    startedAt = null;
    completed = false;
    completionAnnounced = false;
    typingInput.value = "";
    typingInput.classList.remove("success");
    nextBtn.disabled = true;
    nextBtn.textContent = "Latihan berikutnya →";
    feedbackMessage.textContent = "Bagus. Sekarang lanjut ke latihan berikutnya.";
    feedbackMessage.className = "feedback-message";
    renderTarget();
    calculateStats();
    updateProgress();
    saveProgress();
    typingInput.focus();
    if (soundEnabled) speak("Bagus. Sekarang lanjut ke latihan berikutnya.");
    return;
  }

  feedbackMessage.textContent = "Selesai! Kamu sudah menuntaskan latihan ini. Pilih latihan lain jika ingin lanjut.";
  feedbackMessage.className = "feedback-message success";
  progressBar.style.width = "100%";
  nextBtn.disabled = true;
  nextBtn.textContent = "Selesai ✓";
  if (soundEnabled) speak("Selamat! Kamu sudah menyelesaikan semua latihan di bagian ini.");
}

function speak(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function saveProgress() {
  localStorage.setItem("ketik100-progress", JSON.stringify({
    lesson: currentLesson,
    round: currentIndex,
    updatedAt: Date.now()
  }));
}

function restorePreferences() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.querySelector("span").textContent = soundEnabled ? "🔊" : "🔇";

  const savedSize = localStorage.getItem("ketik100-font-size") || "besar";
  fontSizeSelect.value = savedSize;
  setTargetSize(savedSize);
}

function setTargetSize(size) {
  targetLine.classList.remove("size-normal", "size-besar", "size-sangat-besar");
  targetLine.classList.add(`size-${size}`);
}

lessonGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".lesson-card");
  if (!card) return;
  loadLesson(card.dataset.lesson, { scroll: true });
});

typingInput.addEventListener("input", () => {
  if (!startedAt && typingInput.value.length) startedAt = Date.now();
  renderTarget();
  calculateStats();
  updateFeedback();
  updateProgress();
});

typingInput.addEventListener("paste", (event) => {
  event.preventDefault();
  feedbackMessage.textContent = "Untuk latihan, ketik sendiri ya. Tempel teks dimatikan.";
  feedbackMessage.className = "feedback-message warning";
});

nextBtn.addEventListener("click", nextRound);

fontSizeSelect.addEventListener("change", () => {
  setTargetSize(fontSizeSelect.value);
  localStorage.setItem("ketik100-font-size", fontSizeSelect.value);
});

speakTarget.addEventListener("click", () => {
  speak(`${LESSONS[currentLesson].instruction} ${getTarget()}`);
});

listenIntro.addEventListener("click", () => {
  speak("Selamat datang di Ketik seratus. Pilih latihan, lalu ketik tulisan yang muncul. Tidak perlu cepat. Kerjakan pelan-pelan dan teliti.");
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("ketik100-sound", soundEnabled ? "on" : "off");
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.querySelector("span").textContent = soundEnabled ? "🔊" : "🔇";
  if (!soundEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  if (soundEnabled) speak("Suara panduan aktif.");
});

focusToggle.addEventListener("click", () => {
  const enabled = document.body.classList.toggle("focus-mode");
  focusToggle.setAttribute("aria-pressed", String(enabled));
  focusToggle.querySelector("span").textContent = enabled ? "●" : "◎";
  if (enabled) setTimeout(() => typingInput.focus(), 100);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && completed && document.activeElement !== typingInput) nextRound();
});

renderKeyboard();
restorePreferences();
loadLesson("huruf");
