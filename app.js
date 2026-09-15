const LESSONS = {
  huruf: {
    title: "Kenal Huruf",
    world: "🌳 HUTAN HURUF",
    mission: "🎯 MISI: KENAL HURUF",
    instruction: "Tekan huruf yang sama seperti kartu di bawah.",
    type: "letter",
    rounds: 10,
    badge: "alphabet-master",
    items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  },
  kata: {
    title: "Kata Pendek",
    world: "🏡 DESA KATA",
    mission: "🧩 MISI: KATA PENDEK",
    instruction: "Ketik satu kata yang muncul di kartu.",
    type: "word",
    rounds: 10,
    badge: "word-explorer",
    items: ["buku", "meja", "tas", "guru", "bola", "rumah", "makan", "minum", "teman", "sekolah", "kucing", "pensil", "kelas", "pagi"]
  },
  angka: {
    title: "Kenal Angka",
    world: "🏝️ PULAU ANGKA",
    mission: "🔢 MISI: KENAL ANGKA",
    instruction: "Ketik angka yang sama seperti kartu di bawah.",
    type: "number",
    rounds: 10,
    badge: "number-friend",
    items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "10", "12", "15", "20"]
  },
  kalimat: {
    title: "Kalimat Mini",
    world: "🏰 KASTIL KALIMAT",
    mission: "✏️ MISI: KALIMAT MINI",
    instruction: "Ketik kalimat pendek di kartu dengan pelan dan teliti.",
    type: "sentence",
    rounds: 6,
    badge: "sentence-hero",
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

const BADGES = {
  "first-step": { icon: "🌟", name: "Langkah Pertama" },
  "alphabet-master": { icon: "🔤", name: "Master A–Z" },
  "word-explorer": { icon: "📚", name: "Penjelajah Kata" },
  "number-friend": { icon: "🔢", name: "Sahabat Angka" },
  "sentence-hero": { icon: "✏️", name: "Pahlawan Kalimat" },
  "combo-five": { icon: "🔥", name: "Combo 5" }
};

const KEYBOARD_ROWS = [
  "1234567890".split(""),
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split("")
];

const XP_PER_LEVEL = 500;
const STORAGE_KEY = "ketik100-adventure-v12";

const lessonGrid = document.getElementById("lessonGrid");
const practiceTitle = document.getElementById("practiceTitle");
const worldLabel = document.getElementById("worldLabel");
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
const chestMilestone = document.getElementById("chestMilestone");
const scoreStat = document.getElementById("scoreStat");
const comboStat = document.getElementById("comboStat");
const starStat = document.getElementById("starStat");
const rewardPop = document.getElementById("rewardPop");
const keyboard = document.getElementById("keyboard");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");
const countdownText = document.getElementById("countdownText");
const chestOverlay = document.getElementById("chestOverlay");
const openChestBtn = document.getElementById("openChestBtn");
const continueChestBtn = document.getElementById("continueChestBtn");
const chestEmoji = document.getElementById("chestEmoji");
const chestReward = document.getElementById("chestReward");
const chestRewardTitle = document.getElementById("chestRewardTitle");
const chestRewardXp = document.getElementById("chestRewardXp");
const finishOverlay = document.getElementById("finishOverlay");
const finishScore = document.getElementById("finishScore");
const finishStars = document.getElementById("finishStars");
const finishXp = document.getElementById("finishXp");
const finishMessage = document.getElementById("finishMessage");
const finishLevelText = document.getElementById("finishLevelText");
const finishXpBar = document.getElementById("finishXpBar");
const playAgainBtn = document.getElementById("playAgainBtn");
const chooseGameBtn = document.getElementById("chooseGameBtn");
const badgeToast = document.getElementById("badgeToast");
const badgeToastIcon = document.getElementById("badgeToastIcon");
const badgeToastName = document.getElementById("badgeToastName");
const badgeGrid = document.getElementById("badgeGrid");
const soundToggle = document.getElementById("soundToggle");
const focusToggle = document.getElementById("focusToggle");
const listenIntro = document.getElementById("listenIntro");
const gameZone = document.getElementById("game");
const headerLevel = document.getElementById("headerLevel");
const headerStars = document.getElementById("headerStars");
const profileLevel = document.getElementById("profileLevel");
const profileStars = document.getElementById("profileStars");
const profileCorrect = document.getElementById("profileCorrect");
const profileChests = document.getElementById("profileChests");
const xpText = document.getElementById("xpText");
const xpBar = document.getElementById("xpBar");
const mascotSpeech = document.getElementById("mascotSpeech");
const kiboGameSpeech = document.getElementById("kiboGameSpeech");
const kiboMini = document.getElementById("kiboMini");
const sessionXpEl = document.getElementById("sessionXp");

let currentLesson = "huruf";
let queue = [];
let currentRound = 0;
let score = 0;
let combo = 0;
let stars = 0;
let correct = 0;
let sessionXp = 0;
let gameActive = false;
let locked = false;
let mistakesThisRound = 0;
let countdownTimer = null;
let advanceTimer = null;
let badgeTimer = null;
let chestOpened = false;
let soundEnabled = storageGet("ketik100-sound") !== "off";
let adventure = loadAdventure();

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Game tetap dapat dimainkan tanpa penyimpanan.
  }
}

function loadAdventure() {
  const fallback = {
    xp: 0,
    totalStars: 0,
    totalCorrect: 0,
    chests: 0,
    badges: [],
    completed: []
  };
  try {
    const saved = JSON.parse(storageGet(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return fallback;
    return {
      xp: Math.max(0, Number(saved.xp) || 0),
      totalStars: Math.max(0, Number(saved.totalStars) || 0),
      totalCorrect: Math.max(0, Number(saved.totalCorrect) || 0),
      chests: Math.max(0, Number(saved.chests) || 0),
      badges: Array.isArray(saved.badges) ? saved.badges.filter((id) => BADGES[id]) : [],
      completed: Array.isArray(saved.completed) ? saved.completed.filter((id) => LESSONS[id]) : []
    };
  } catch {
    return fallback;
  }
}

function saveAdventure() {
  storageSet(STORAGE_KEY, JSON.stringify(adventure));
}

function levelInfo(xp = adventure.xp) {
  const safeXp = Math.max(0, Number(xp) || 0);
  return {
    level: Math.floor(safeXp / XP_PER_LEVEL) + 1,
    current: safeXp % XP_PER_LEVEL,
    percent: ((safeXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
  };
}

function renderAdventure() {
  const level = levelInfo();
  headerLevel.textContent = level.level;
  headerStars.textContent = adventure.totalStars;
  profileLevel.textContent = level.level;
  profileStars.textContent = adventure.totalStars;
  profileCorrect.textContent = adventure.totalCorrect;
  profileChests.textContent = adventure.chests;
  xpText.textContent = `${level.current} / ${XP_PER_LEVEL}`;
  xpBar.style.width = `${level.percent}%`;

  document.querySelectorAll("[data-status-for]").forEach((status) => {
    const lesson = status.dataset.statusFor;
    const done = adventure.completed.includes(lesson);
    status.textContent = done ? "✓ Selesai" : lesson === "huruf" ? "Mulai →" : "Jelajahi →";
    status.closest(".world-card")?.classList.toggle("completed", done);
  });

  document.querySelectorAll(".badge-card").forEach((card) => {
    const unlocked = adventure.badges.includes(card.dataset.badge);
    card.classList.toggle("locked", !unlocked);
    card.classList.toggle("unlocked", unlocked);
  });

  if (adventure.completed.length === 4) {
    mascotSpeech.textContent = "Semua dunia sudah kamu jelajahi! Sekarang kita bisa mengulang dunia favoritmu.";
  } else if (adventure.totalCorrect === 0) {
    mascotSpeech.textContent = "Hai! Aku Kibo. Ayo mulai dari Hutan Huruf!";
  } else {
    mascotSpeech.textContent = `Keren! Kita sudah mengumpulkan ${adventure.totalStars} bintang. Lanjut lagi?`;
  }
}

function unlockBadge(id) {
  if (!BADGES[id] || adventure.badges.includes(id)) return false;
  adventure.badges.push(id);
  saveAdventure();
  renderAdventure();
  showBadgeToast(id);
  return true;
}

function showBadgeToast(id) {
  const badge = BADGES[id];
  if (!badge) return;
  clearTimeout(badgeTimer);
  badgeToastIcon.textContent = badge.icon;
  badgeToastName.textContent = badge.name;
  badgeToast.hidden = false;
  badgeToast.classList.remove("show");
  void badgeToast.offsetWidth;
  badgeToast.classList.add("show");
  badgeTimer = setTimeout(() => {
    badgeToast.classList.remove("show");
    badgeToast.hidden = true;
  }, 3200);
}

function awardXp(amount) {
  const safeAmount = Math.max(0, Math.round(Number(amount) || 0));
  if (!safeAmount) return;
  const before = levelInfo().level;
  adventure.xp += safeAmount;
  sessionXp += safeAmount;
  const after = levelInfo().level;
  sessionXpEl.textContent = `+${sessionXp} XP`;
  renderAdventure();

  if (after > before) {
    kiboGameSpeech.textContent = `LEVEL UP! Sekarang kamu Level ${after}!`;
    createConfetti(28);
    if (soundEnabled) speak(`Level naik. Sekarang level ${after}`);
  }
}

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
  return String(value).trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
}

function currentTarget() {
  return queue[currentRound] || LESSONS[currentLesson].items[0];
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  KEYBOARD_ROWS.forEach((row) => {
    row.forEach((key) => {
      const el = document.createElement("span");
      el.className = "key";
      el.dataset.key = key.toLowerCase();
      el.textContent = key;
      keyboard.appendChild(el);
    });
  });

  const space = document.createElement("span");
  space.className = "key space-key";
  space.dataset.key = "space";
  space.textContent = "SPASI";
  keyboard.appendChild(space);

  const dot = document.createElement("span");
  dot.className = "key";
  dot.dataset.key = ".";
  dot.textContent = ".";
  keyboard.appendChild(dot);
}

function updateKeyboardHint() {
  document.querySelectorAll(".key.active").forEach((el) => el.classList.remove("active"));
  if (!gameActive || locked) return;

  const target = String(currentTarget());
  const typed = typingInput.value;
  const next = target[typed.length] || target[0] || "";
  const keyName = next === " " ? "space" : next.toLowerCase();
  const key = Array.from(keyboard.querySelectorAll(".key")).find((el) => el.dataset.key === keyName);
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
  const chestProgress = correct % 5;

  scoreStat.textContent = score.toLocaleString("id-ID");
  comboStat.textContent = `${combo}🔥`;
  starStat.textContent = `${stars}⭐`;
  roundLabel.textContent = `Ronde ${Math.min(currentRound + 1, total)} dari ${total}`;
  chestMilestone.textContent = `🎁 Peti: ${chestProgress}/5`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function setFeedback(text, type = "") {
  feedbackMessage.textContent = text;
  feedbackMessage.className = `feedback-message${type ? ` ${type}` : ""}`;
}

function setKibo(text, mood = "") {
  kiboGameSpeech.textContent = text;
  kiboMini.className = `kibo-mini${mood ? ` ${mood}` : ""}`;
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
  if (badgeTimer) clearTimeout(badgeTimer);
  countdownTimer = null;
  advanceTimer = null;
  badgeTimer = null;
}

function resetGameState() {
  clearTimers();
  queue = buildQueue();
  currentRound = 0;
  score = 0;
  combo = 0;
  stars = 0;
  correct = 0;
  sessionXp = 0;
  locked = false;
  mistakesThisRound = 0;
  chestOpened = false;
  gameActive = false;
  typingInput.value = "";
  typingInput.disabled = true;
  targetCard.classList.remove("success", "wrong");
  startBtn.hidden = false;
  startBtn.textContent = "▶ Mulai Game";
  finishOverlay.hidden = true;
  chestOverlay.hidden = true;
  sessionXpEl.textContent = "+0 XP";
  setKibo("Aku siap membantu. Tekan “Mulai Game” ya!");
  renderTarget();
  renderHUD();
  setFeedback("Tekan tombol “Mulai Game” untuk bermain.");
}

function loadLesson(key, shouldScroll = true) {
  if (!LESSONS[key]) return;
  currentLesson = key;
  document.querySelectorAll(".world-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.lesson === key);
  });

  const lesson = LESSONS[key];
  practiceTitle.textContent = lesson.title;
  worldLabel.textContent = lesson.world;
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
    if (index < steps.length) countdownTimer = setTimeout(showStep, 720);
    else countdownTimer = setTimeout(beginRound, 650);
  };

  showStep();
}

function startGame() {
  resetGameState();
  gameActive = true;
  queue = buildQueue();
  setKibo("Petualangan dimulai! Aku ikut menemani.", "happy");
  renderTarget();
  renderHUD();
  runCountdown();
}

function beginRound() {
  countdownOverlay.hidden = true;
  chestOverlay.hidden = true;
  locked = false;
  mistakesThisRound = 0;
  typingInput.value = "";
  typingInput.disabled = false;
  targetCard.classList.remove("success", "wrong");
  setFeedback("Lihat kartu, lalu ketik jawabannya.");
  setKibo(currentRound === 0 ? "Ayo! Cari tombol yang sama." : "Bagus. Kita lanjut satu soal lagi!");
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
  setKibo("Tidak apa-apa. Coba lagi pelan-pelan.", "encourage");

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
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#ffd45f", "#72e3b6", "#8c7cff", "#ff8f70", "#65cce6"];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${20 + Math.random() * 60}%`;
    piece.style.top = `${70 + Math.random() * 70}px`;
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
  const earnedScore = 100 + bonus;
  const earnedXp = 25 + Math.min(combo * 2, 15);

  score += earnedScore;
  adventure.totalCorrect += 1;
  adventure.totalStars += 1;
  awardXp(earnedXp);
  unlockBadge("first-step");
  if (combo >= 5) unlockBadge("combo-five");

  targetCard.classList.remove("wrong");
  targetCard.classList.add("success");
  rewardPop.textContent = `+${earnedScore} • +${earnedXp} XP`;
  rewardPop.classList.remove("show");
  void rewardPop.offsetWidth;
  rewardPop.classList.add("show");

  setFeedback(
    mistakesThisRound ? "Yes! Ketemu juga. Bagus sudah mencoba lagi!" : "Hebat! Jawabanmu benar!",
    "success"
  );
  setKibo(combo >= 3 ? `Combo ${combo}! Keren sekali!` : "Benar! Bintang kita bertambah.", "happy");
  renderHUD();
  renderAdventure();
  saveAdventure();
  createConfetti(combo >= 3 ? 18 : 10);

  if (soundEnabled && combo >= 3) speak(`Hebat! Combo ${combo}`);

  advanceTimer = setTimeout(() => {
    const isLastRound = currentRound + 1 >= LESSONS[currentLesson].rounds;

    if (isLastRound) {
      currentRound += 1;
      finishGame();
      return;
    }

    if (correct % 5 === 0) {
      openChestCheckpoint();
      return;
    }

    currentRound += 1;
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
    targetCard.classList.remove("wrong");
    setFeedback("Lihat kartu, lalu ketik jawabannya.");
    return;
  }

  if (normalize(typed) === normalize(target)) {
    correctAnswer();
    return;
  }

  if (lesson.type === "letter") {
    wrongAnswer();
    return;
  }

  const normalizedTyped = typed.toLocaleLowerCase("id-ID");
  const normalizedTarget = target.toLocaleLowerCase("id-ID");

  if (lesson.type === "number") {
    if (normalizedTarget.startsWith(normalizedTyped)) {
      targetCard.classList.remove("wrong");
      setFeedback("Bagus, lanjutkan angkanya.");
    } else {
      wrongAnswer();
    }
    return;
  }

  if (!normalizedTarget.startsWith(normalizedTyped)) {
    wrongAnswer();
  } else {
    targetCard.classList.remove("wrong");
    setFeedback("Bagus, lanjutkan sedikit lagi.");
  }
}

function openChestCheckpoint() {
  locked = true;
  typingInput.disabled = true;
  chestOpened = false;
  chestReward.hidden = true;
  continueChestBtn.hidden = true;
  chestEmoji.textContent = "🧰";
  openChestBtn.disabled = false;
  chestOverlay.hidden = false;
  setKibo("Wah! Kita menemukan peti hadiah!", "happy");
  if (soundEnabled) speak("Kamu menemukan peti hadiah. Ayo buka petinya.");
}

function revealChest() {
  if (chestOpened) return;
  chestOpened = true;

  const bonusStars = Math.floor(Math.random() * 4) + 2;
  const bonusXp = 50;

  stars += bonusStars;
  adventure.totalStars += bonusStars;
  adventure.chests += 1;
  awardXp(bonusXp);
  saveAdventure();
  renderAdventure();
  renderHUD();

  chestEmoji.textContent = "🎁";
  chestRewardTitle.textContent = `+${bonusStars} ⭐`;
  chestRewardXp.textContent = `+${bonusXp} XP`;
  chestReward.hidden = false;
  continueChestBtn.hidden = false;
  openChestBtn.disabled = true;
  createConfetti(30);
  setKibo("Hore! Hadiahnya sudah kita ambil.", "happy");

  if (soundEnabled) speak(`Hore. Kamu mendapat ${bonusStars} bintang dan ${bonusXp} XP.`);
}

function continueAfterChest() {
  chestOverlay.hidden = true;
  currentRound += 1;
  typingInput.value = "";
  targetCard.classList.remove("success");
  renderHUD();
  beginRound();
}

function finishGame() {
  clearTimers();
  gameActive = false;
  locked = true;
  typingInput.disabled = true;

  const lesson = LESSONS[currentLesson];
  const alreadyCompleted = adventure.completed.includes(currentLesson);

  if (!alreadyCompleted) {
    adventure.completed.push(currentLesson);
    awardXp(100);
  }
  unlockBadge(lesson.badge);
  saveAdventure();
  renderAdventure();

  progressBar.style.width = "100%";
  progressPercent.textContent = "100%";
  roundLabel.textContent = `Selesai • ${lesson.rounds} ronde`;
  chestMilestone.textContent = "🏆 Dunia selesai";
  finishScore.textContent = score.toLocaleString("id-ID");
  finishStars.textContent = `${stars} ⭐`;
  finishXp.textContent = `+${sessionXp} XP`;

  const level = levelInfo();
  finishLevelText.textContent = `Level ${level.level} • ${level.current}/${XP_PER_LEVEL} XP`;
  finishXpBar.style.width = `${level.percent}%`;

  finishMessage.textContent = combo >= 5
    ? "Petualangan selesai dengan combo keren. Mau pecahkan skor lagi?"
    : "Kamu berhasil menyelesaikan dunia ini. Setiap usaha membuat Kibo makin kuat!";

  saveBestScore();
  setKibo("Dunia selesai! Aku bangga sama usahamu.", "happy");
  createConfetti(45);
  finishOverlay.hidden = false;

  if (soundEnabled) speak("Petualangan selesai. Hebat sekali! Kamu berhasil menyelesaikan dunia ini.");
}

function saveBestScore() {
  const key = `ketik100-best-${currentLesson}`;
  const previous = Number(storageGet(key) || 0);
  if (score > previous) storageSet(key, String(score));
}

lessonGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".world-card");
  if (!card) return;
  loadLesson(card.dataset.lesson, true);
});

typingInput.addEventListener("input", evaluateInput);

typingInput.addEventListener("paste", (event) => {
  event.preventDefault();
  setFeedback("Untuk latihan, ketik sendiri ya. Fitur tempel dimatikan.", "warning");
});

typingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
  if (gameActive && soundEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  startGame();
});

playAgainBtn.addEventListener("click", startGame);

chooseGameBtn.addEventListener("click", () => {
  finishOverlay.hidden = true;
  gameActive = false;
  resetGameState();
  document.getElementById("adventureMap").scrollIntoView({ behavior: "smooth", block: "start" });
});

openChestBtn.addEventListener("click", revealChest);
continueChestBtn.addEventListener("click", continueAfterChest);

speakTarget.addEventListener("click", () => {
  if (!queue.length) queue = buildQueue();
  speakCurrentTarget();
});

listenIntro.addEventListener("click", () => {
  speak(
    "Selamat datang di Ketik seratus Adventure Mode. Pilih dunia, lalu tekan mulai game. " +
    "Saat permainan dimulai akan ada hitungan tiga, dua, satu. Ketik soal yang muncul satu per satu. " +
    "Setiap jawaban benar memberi bintang dan XP. Setelah lima jawaban benar, kamu akan menemukan peti hadiah."
  );
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  storageSet("ketik100-sound", soundEnabled ? "on" : "off");
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
renderAdventure();
soundToggle.setAttribute("aria-pressed", String(soundEnabled));
soundToggle.querySelector("span").textContent = soundEnabled ? "🔊" : "🔇";
loadLesson("huruf", false);
