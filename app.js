const LESSONS = {
  huruf: {
    title: "Kenal Huruf",
    mission: "🎯 MISI: KENAL HURUF",
    instruction: "Tekan huruf yang sama seperti kartu di bawah.",
    type: "letter",
    rounds: 10,
    items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  },
  kata: {
    title: "Kata Pendek",
    mission: "🧩 MISI: KATA PENDEK",
    instruction: "Ketik satu kata yang muncul di kartu.",
    type: "word",
    rounds: 10,
    items: ["buku", "meja", "tas", "guru", "bola", "rumah", "makan", "minum", "teman", "sekolah", "kucing", "pensil", "kelas", "pagi"]
  },
  angka: {
    title: "Kenal Angka",
    mission: "🔢 MISI: KENAL ANGKA",
    instruction: "Ketik angka yang sama seperti kartu di bawah.",
    type: "number",
    rounds: 10,
    items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "10", "12", "15", "20"]
  },
  kalimat: {
    title: "Kalimat Mini",
    mission: "✏️ MISI: KALIMAT MINI",
    instruction: "Ketik kalimat pendek di kartu dengan pelan dan teliti.",
    type: "sentence",
    rounds: 6,
    items: [
      "Saya suka belajar.",
      "Nama saya hebat.",
      "Saya duduk rapi.",
      "Saya suka komputer.",
      "Hari ini saya belajar.",
      "Saya mengetik pelan.",
      "Saya bisa mencoba lagi.",
      "Guru membantu saya."
    ]
  }
};

const KEYBOARD_ROWS = [
  "1234567890".split(""),
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split("")
];

const lessonGrid = document.getElementById("lessonGrid");
const practiceTitle = document.getElementById("practiceTitle");
const missionPill = document.getElementById("missionPill");
const instruction = document.getElementById("instruction");
const targetLine = document.getElementById("targetLine");
const targetCard = document.getElementById("targetCard");
const targetHint = document.getElementById("targetHint");
const typingInput = document.getElementById("typingInput");
const feedbackMessage = document.getElementById("feedbackMessage");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const speakTarget = document.getElementById("speakTarget");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const roundLabel = document.getElementById("roundLabel");
const scoreStat = document.getElementById("scoreStat");
const comboStat = document.getElementById("comboStat");
const starStat = document.getElementById("starStat");
const rewardPop = document.getElementById("rewardPop");
const keyboard = document.getElementById("keyboard");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");
const countdownText = document.getElementById("countdownText");
const finishOverlay = document.getElementById("finishOverlay");
const finishScore = document.getElementById("finishScore");
const finishStars = document.getElementById("finishStars");
const finishCorrect = document.getElementById("finishCorrect");
const finishMessage = document.getElementById("finishMessage");
const playAgainBtn = document.getElementById("playAgainBtn");
const chooseGameBtn = document.getElementById("chooseGameBtn");
const soundToggle = document.getElementById("soundToggle");
const focusToggle = document.getElementById("focusToggle");
const listenIntro = document.getElementById("listenIntro");
const gameZone = document.getElementById("game");

let currentLesson = "huruf";
let queue = [];
let currentRound = 0;
let score = 0;
let combo = 0;
let stars = 0;
let correct = 0;
let gameActive = false;
let locked = false;
let mistakesThisRound = 0;
let countdownTimer = null;
let advanceTimer = null;
let soundEnabled = localStorage.getItem("ketik100-sound") !== "off";

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQueue() {
  const lesson = LESSONS[currentLesson];
  const pool = shuffle(lesson.items);
  if (pool.length >= lesson.rounds) return pool.slice(0, lesson.rounds);
  const result = [];
  while (result.length < lesson.rounds) result.push(...shuffle(pool));
  return result.slice(0, lesson.rounds);
}

function normalize(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}

function currentTarget() {
  return queue[currentRound] || LESSONS[currentLesson].items[0];
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  KEYBOARD_ROWS.flat().forEach((key) => {
    const el = document.createElement("span");
    el.className = "key";
    el.dataset.key = key.toLowerCase();
    el.textContent = key;
    keyboard.appendChild(el);
  });
}

function updateKeyboardHint() {
  document.querySelectorAll(".key.active").forEach((el) => el.classList.remove("active"));
  if (!gameActive || locked) return;
  const target = String(currentTarget());
  const typed = typingInput.value;
  const next = target[typed.length] || target[0] || "";
  if (next === " ") return;
  const key = keyboard.querySelector(`[data-key="${CSS.escape(next.toLowerCase())}"]`);
  if (key) key.classList.add("active");
}

function renderTarget() {
  const lesson = LESSONS[currentLesson];
  const target = String(currentTarget());
  targetLine.textContent = target;
  targetLine.className = "target-line";
  if (lesson.type === "word") targetLine.classList.add("word");
  if (lesson.type === "sentence") targetLine.classList.add("sentence");

  if (lesson.type === "letter") targetHint.textContent = `Cari huruf ${target} di keyboard`;
  else if (lesson.type === "number") targetHint.textContent = `Cari angka ${target} di keyboard`;
  else if (lesson.type === "word") targetHint.textContent = `${target.length} huruf • ketik tanpa terburu-buru`;
  else targetHint.textContent = "Baca dulu, lalu ketik sedikit demi sedikit";

  typingInput.maxLength = lesson.type === "letter" ? 1 : Math.max(target.length + 5, 20);
  typingInput.inputMode = lesson.type === "number" ? "numeric" : "text";
  updateKeyboardHint();
}

function renderHUD() {
  const total = LESSONS[currentLesson].rounds;
  const done = Math.min(currentRound, total);
  const percent = Math.round((done / total) * 100);
  scoreStat.textContent = score.toLocaleString("id-ID");
  comboStat.textContent = `${combo}🔥`;
  starStat.textContent = `${stars}⭐`;
  roundLabel.textContent = `Ronde ${Math.min(currentRound + 1, total)} dari ${total}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function setFeedback(text, type = "") {
  feedbackMessage.textContent = text;
  feedbackMessage.className = `feedback-message${type ? ` ${type}` : ""}`;
}

function speak(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.82;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

function speakCurrentTarget() {
  const lesson = LESSONS[currentLesson];
  const target = currentTarget();
  if (lesson.type === "letter") speak(`Ketik huruf ${target}`);
  else if (lesson.type === "number") speak(`Ketik angka ${target}`);
  else if (lesson.type === "word") speak(`Ketik kata ${target}`);
  else speak(`Ketik kalimat. ${target}`);
}

function clearTimers() {
  if (countdownTimer) clearTimeout(countdownTimer);
  if (advanceTimer) clearTimeout(advanceTimer);
  countdownTimer = null;
  advanceTimer = null;
}

function resetGameState() {
  clearTimers();
  queue = buildQueue();
  currentRound = 0;
  score = 0;
  combo = 0;
  stars = 0;
  correct = 0;
  locked = false;
  mistakesThisRound = 0;
  gameActive = false;
  typingInput.value = "";
  typingInput.disabled = true;
  targetCard.classList.remove("success", "wrong");
  startBtn.hidden = false;
  startBtn.textContent = "▶ Mulai Game";
  finishOverlay.hidden = true;
  renderTarget();
  renderHUD();
  setFeedback("Tekan tombol “Mulai Game” untuk bermain.");
}

function loadLesson(key, shouldScroll = true) {
  if (!LESSONS[key]) return;
  currentLesson = key;
  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.lesson === key);
  });
  const lesson = LESSONS[key];
  practiceTitle.textContent = lesson.title;
  missionPill.textContent = lesson.mission;
  instruction.textContent = lesson.instruction;
  resetGameState();
  if (shouldScroll) gameZone.scrollIntoView({ behavior: "smooth", block: "start" });
}

function runCountdown() {
  clearTimers();
  countdownOverlay.hidden = false;
  typingInput.disabled = true;
  startBtn.hidden = true;
  const steps = [
    { number: "3", text: "Siapkan tanganmu!" },
    { number: "2", text: "Lihat kartunya…" },
    { number: "1", text: "Cari tombolnya…" },
    { number: "GO!", text: "Ayo mulai!" }
  ];
  let index = 0;

  const showStep = () => {
    const step = steps[index];
    countdownNumber.textContent = step.number;
    countdownText.textContent = step.text;
    countdownNumber.style.animation = "none";
    void countdownNumber.offsetWidth;
    countdownNumber.style.animation = "countPop .7s ease";
    if (soundEnabled) speak(step.number === "GO!" ? "Mulai" : step.number);
    index += 1;
    if (index < steps.length) {
      countdownTimer = setTimeout(showStep, 720);
    } else {
      countdownTimer = setTimeout(beginRound, 650);
    }
  };
  showStep();
}

function startGame() {
  resetGameState();
  gameActive = true;
  queue = buildQueue();
  renderTarget();
  renderHUD();
  runCountdown();
}

function beginRound() {
  countdownOverlay.hidden = true;
  locked = false;
  mistakesThisRound = 0;
  typingInput.value = "";
  typingInput.disabled = false;
  targetCard.classList.remove("success", "wrong");
  setFeedback("Lihat kartu, lalu ketik jawabannya.");
  renderTarget();
  typingInput.focus({ preventScroll: true });
  speakCurrentTarget();
}

function wrongAnswer() {
  if (locked) return;
  mistakesThisRound += 1;
  combo = 0;
  comboStat.textContent = "0🔥";
  targetCard.classList.remove("wrong");
  void targetCard.offsetWidth;
  targetCard.classList.add("wrong");
  setFeedback("Hampir! Coba lihat kartunya lagi. Kamu bisa mencoba lagi.", "warning");
  if (LESSONS[currentLesson].type === "letter" || LESSONS[currentLesson].type === "number") {
    locked = true;
    advanceTimer = setTimeout(() => {
      typingInput.value = "";
      locked = false;
      targetCard.classList.remove("wrong");
      updateKeyboardHint();
      typingInput.focus({ preventScroll: true });
    }, 450);
  }
}

function createConfetti(amount = 18) {
  const colors = ["#ffd45f", "#72e3b6", "#8c7cff", "#ff8f70", "#65cce6"];
  const bounds = gameZone.getBoundingClientRect();
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${20 + Math.random() * 60}%`;
    piece.style.top = `${Math.max(20, window.scrollY ? 120 : bounds.top + 100)}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    gameZone.appendChild(piece);
    setTimeout(() => piece.remove(), 1300);
  }
}

function correctAnswer() {
  if (locked) return;
  locked = true;
  typingInput.disabled = true;
  correct += 1;
  combo += 1;
  stars += 1;
  const bonus = Math.min(combo * 10, 100);
  const earned = 100 + bonus;
  score += earned;
  targetCard.classList.remove("wrong");
  targetCard.classList.add("success");
  rewardPop.textContent = `+${earned} ⭐`;
  rewardPop.classList.remove("show");
  void rewardPop.offsetWidth;
  rewardPop.classList.add("show");
  setFeedback(mistakesThisRound ? "Yes! Ketemu juga. Bagus sudah mencoba lagi!" : "Hebat! Jawabanmu benar!", "success");
  renderHUD();
  createConfetti(combo >= 3 ? 18 : 10);
  if (soundEnabled && combo >= 3) speak(`Hebat! Combo ${combo}`);

  advanceTimer = setTimeout(() => {
    currentRound += 1;
    if (currentRound >= LESSONS[currentLesson].rounds) {
      finishGame();
      return;
    }
    typingInput.value = "";
    targetCard.classList.remove("success");
    renderHUD();
    beginRound();
  }, 900);
}

function evaluateInput() {
  if (!gameActive || locked) return;
  const target = String(currentTarget());
  const typed = typingInput.value;
  const lesson = LESSONS[currentLesson];
  updateKeyboardHint();

  if (!typed) {
    setFeedback("Lihat kartu, lalu ketik jawabannya.");
    return;
  }

  if (normalize(typed) === normalize(target)) {
    correctAnswer();
    return;
  }

  if (lesson.type === "letter" || lesson.type === "number") {
    wrongAnswer();
    return;
  }

  const normalizedTyped = typed.toLocaleLowerCase("id-ID");
  const normalizedTarget = target.toLocaleLowerCase("id-ID");
  if (!normalizedTarget.startsWith(normalizedTyped)) wrongAnswer();
  else setFeedback("Bagus, lanjutkan sedikit lagi.");
}

function finishGame() {
  clearTimers();
  gameActive = false;
  locked = true;
  typingInput.disabled = true;
  progressBar.style.width = "100%";
  progressPercent.textContent = "100%";
  roundLabel.textContent = `Selesai • ${LESSONS[currentLesson].rounds} ronde`;
  finishScore.textContent = score.toLocaleString("id-ID");
  finishStars.textContent = `${stars} ⭐`;
  finishCorrect.textContent = `${correct}/${LESSONS[currentLesson].rounds}`;
  finishMessage.textContent = combo >= 5
    ? "Keren! Kamu membuat combo panjang. Mau pecahkan skor lagi?"
    : "Kamu berhasil menyelesaikan semua ronde. Mau main sekali lagi?";
  saveBestScore();
  createConfetti(40);
  finishOverlay.hidden = false;
  if (soundEnabled) speak("Permainan selesai. Hebat sekali! Kamu berhasil menyelesaikan semua ronde.");
}

function saveBestScore() {
  const key = `ketik100-best-${currentLesson}`;
  const previous = Number(localStorage.getItem(key) || 0);
  if (score > previous) localStorage.setItem(key, String(score));
}

lessonGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".lesson-card");
  if (!card) return;
  loadLesson(card.dataset.lesson, true);
});

typingInput.addEventListener("input", evaluateInput);
typingInput.addEventListener("paste", (event) => {
  event.preventDefault();
  setFeedback("Untuk latihan, ketik sendiri ya. Fitur tempel dimatikan.", "warning");
});

typingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && LESSONS[currentLesson].type !== "sentence") event.preventDefault();
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  if (gameActive && soundEnabled) window.speechSynthesis?.cancel();
  startGame();
});

playAgainBtn.addEventListener("click", startGame);
chooseGameBtn.addEventListener("click", () => {
  finishOverlay.hidden = true;
  gameActive = false;
  resetGameState();
  document.getElementById("pilih-game").scrollIntoView({ behavior: "smooth", block: "start" });
});

speakTarget.addEventListener("click", () => {
  if (!queue.length) queue = buildQueue();
  speakCurrentTarget();
});

listenIntro.addEventListener("click", () => {
  speak("Selamat datang di Ketik seratus. Pilih permainan. Saat game dimulai akan ada hitungan tiga, dua, satu. Lihat kartu yang muncul, cari tombol keyboard yang sama, lalu ketik. Tidak perlu cepat.");
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
  if (enabled) gameZone.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("beforeunload", clearTimers);

renderKeyboard();
soundToggle.setAttribute("aria-pressed", String(soundEnabled));
soundToggle.querySelector("span").textContent = soundEnabled ? "🔊" : "🔇";
loadLesson("huruf", false);
