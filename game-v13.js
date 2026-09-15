const PICTURE_SPRITE = "assets/picture-quest.svg";
const ICON_SPRITE = "assets/premium-icons.svg";
const XP_PER_LEVEL = 500;
const STORAGE_KEY = "ketik100-adventure-v12";

const LESSONS = {
  huruf: {
    title: "Kenal Huruf", world: "HUTAN HURUF", header: "Hutan Huruf", mission: "MISI: KENAL HURUF",
    instruction: "Tekan huruf yang sama seperti kartu di bawah.", type: "letter", rounds: 10, badge: "alphabet-master",
    items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  },
  kata: {
    title: "Kata Pendek", world: "DESA KATA", header: "Desa Kata", mission: "MISI: KATA PENDEK",
    instruction: "Ketik satu kata yang muncul di kartu.", type: "word", rounds: 10, badge: "word-explorer",
    items: ["buku","meja","tas","guru","bola","rumah","makan","minum","teman","sekolah","kucing","pensil","kelas","pagi"]
  },
  gambar: {
    title: "Picture Quest", world: "TAMAN GAMBAR", header: "Taman Gambar", mission: "MISI: LIHAT & KETIK",
    instruction: "Lihat gambar di kartu, kenali bendanya, lalu ketik namanya.", type: "picture", rounds: 10, badge: "picture-explorer",
    items: [
      { answer: "apel", icon: "pic-apple", hint: "Buah berwarna merah atau hijau" },
      { answer: "kucing", icon: "pic-cat", hint: "Hewan peliharaan yang suka mengeong" },
      { answer: "mobil", icon: "pic-car", hint: "Kendaraan yang berjalan di jalan raya" },
      { answer: "buku", icon: "pic-book", hint: "Kita membacanya untuk belajar" },
      { answer: "rumah", icon: "pic-house", hint: "Tempat kita tinggal" },
      { answer: "ikan", icon: "pic-fish", hint: "Hewan yang hidup di air" },
      { answer: "bola", icon: "pic-ball", hint: "Benda bulat untuk bermain" },
      { answer: "pensil", icon: "pic-pencil", hint: "Alat untuk menulis dan menggambar" },
      { answer: "bunga", icon: "pic-flower", hint: "Tanaman yang indah dan berwarna-warni" },
      { answer: "matahari", icon: "pic-sun", hint: "Bersinar terang di langit pada siang hari" }
    ]
  },
  angka: {
    title: "Kenal Angka", world: "PULAU ANGKA", header: "Pulau Angka", mission: "MISI: KENAL ANGKA",
    instruction: "Ketik angka yang sama seperti kartu di bawah.", type: "number", rounds: 10, badge: "number-friend",
    items: ["1","2","3","4","5","6","7","8","9","0","10","12","15","20"]
  },
  kalimat: {
    title: "Kalimat Mini", world: "KASTIL KALIMAT", header: "Kastil Kalimat", mission: "MISI: KALIMAT MINI",
    instruction: "Ketik kalimat pendek di kartu dengan pelan dan teliti.", type: "sentence", rounds: 6, badge: "sentence-hero",
    items: ["Saya suka belajar.","Nama saya hebat.","Saya duduk rapi.","Saya suka komputer.","Hari ini saya belajar.","Saya mengetik pelan.","Saya bisa mencoba lagi.","Guru membantu saya."]
  }
};

const BADGES = {
  "first-step": { name: "Langkah Pertama" },
  "alphabet-master": { name: "Master A–Z" },
  "word-explorer": { name: "Penjelajah Kata" },
  "picture-explorer": { name: "Jago Gambar" },
  "number-friend": { name: "Sahabat Angka" },
  "sentence-hero": { name: "Pahlawan Kalimat" },
  "combo-five": { name: "Combo 5" }
};

const KEYBOARD_ROWS = ["1234567890".split(""),"QWERTYUIOP".split(""),"ASDFGHJKL".split(""),"ZXCVBNM".split("")];
const params = new URLSearchParams(location.search);
const requested = params.get("mode");
const currentLesson = LESSONS[requested] ? requested : "huruf";
const lesson = LESSONS[currentLesson];
const el = (id) => document.getElementById(id);

const typingInput = el("typingInput"), targetLine = el("targetLine"), targetCard = el("targetCard"), targetHint = el("targetHint"), feedback = el("feedbackMessage");
const targetKicker = document.querySelector(".target-kicker");
const startBtn = el("startBtn"), restartBtn = el("restartBtn"), scoreStat = el("scoreStat"), comboStat = el("comboStat"), starStat = el("starStat");
const roundLabel = el("roundLabel"), progressPercent = el("progressPercent"), progressBar = el("progressBar"), chestMilestone = el("chestMilestone");
const rewardPop = el("rewardPop"), keyboard = el("keyboard"), countdownOverlay = el("countdownOverlay"), countdownNumber = el("countdownNumber"), countdownText = el("countdownText");
const chestOverlay = el("chestOverlay"), openChestBtn = el("openChestBtn"), continueChestBtn = el("continueChestBtn"), chestIconUse = el("chestIconUse");
const chestReward = el("chestReward"), chestRewardTitle = el("chestRewardTitle"), chestRewardXp = el("chestRewardXp");
const finishOverlay = el("finishOverlay"), finishScore = el("finishScore"), finishStars = el("finishStars"), finishXp = el("finishXp"), finishMessage = el("finishMessage");
const finishLevelText = el("finishLevelText"), finishXpBar = el("finishXpBar"), badgeToast = el("badgeToast"), badgeToastName = el("badgeToastName");
const soundToggle = el("soundToggle"), soundIconUse = el("soundIconUse"), kiboMini = el("kiboMini"), kiboSpeech = el("kiboGameSpeech");
const sessionXpEl = el("sessionXp"), miniXpBar = el("miniXpBar"), levelText = el("levelText"), headerLevel = el("headerLevel");

let queue = [], currentRound = 0, score = 0, combo = 0, stars = 0, correct = 0, sessionXp = 0, mistakesThisRound = 0;
let gameActive = false, locked = false, chestOpened = false, chestFinishesGame = false;
let countdownTimer = null, advanceTimer = null, badgeTimer = null;
let soundEnabled = storageGet("ketik100-sound") !== "off";
let adventure = loadAdventure();

function storageGet(key){ try{return localStorage.getItem(key);}catch{return null;} }
function storageSet(key,value){ try{localStorage.setItem(key,value);}catch{} }
function saveAdventure(){ storageSet(STORAGE_KEY,JSON.stringify(adventure)); }

function loadAdventure(){
  const fallback={xp:0,totalStars:0,totalCorrect:0,chests:0,badges:[],completed:[]};
  try{
    const saved=JSON.parse(storageGet(STORAGE_KEY)||"null");
    if(!saved||typeof saved!=="object") return fallback;
    return {
      xp:Math.max(0,Number(saved.xp)||0), totalStars:Math.max(0,Number(saved.totalStars)||0), totalCorrect:Math.max(0,Number(saved.totalCorrect)||0), chests:Math.max(0,Number(saved.chests)||0),
      badges:Array.isArray(saved.badges)?saved.badges.filter((id)=>BADGES[id]):[],
      completed:Array.isArray(saved.completed)?saved.completed.filter((id)=>LESSONS[id]):[]
    };
  }catch{return fallback;}
}

function levelInfo(xp=adventure.xp){
  const safe=Math.max(0,Number(xp)||0);
  return {level:Math.floor(safe/XP_PER_LEVEL)+1,current:safe%XP_PER_LEVEL,percent:((safe%XP_PER_LEVEL)/XP_PER_LEVEL)*100};
}

function renderLevel(){
  const info=levelInfo();
  headerLevel.textContent=info.level;
  levelText.textContent=`Level ${info.level} • ${info.current}/${XP_PER_LEVEL} XP`;
  miniXpBar.style.width=`${info.percent}%`;
  sessionXpEl.textContent=`+${sessionXp} XP`;
}

function setKibo(text,mood=""){
  kiboSpeech.textContent=text;
  kiboMini.className=`kibo-mini${mood?` ${mood}`:""}`;
}

function setIcon(useEl,iconId){ if(useEl) useEl.setAttribute("href",`${ICON_SPRITE}#${iconId}`); }
function renderSoundIcon(){
  setIcon(soundIconUse,soundEnabled?"sound-on":"sound-off");
  soundToggle.setAttribute("aria-pressed",String(soundEnabled));
  soundToggle.setAttribute("aria-label",soundEnabled?"Matikan suara":"Aktifkan suara");
}

function shuffle(values){
  const copy=[...values];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}

function buildQueue(){
  const pool=shuffle(lesson.items);
  if(pool.length>=lesson.rounds) return pool.slice(0,lesson.rounds);
  const result=[];
  while(result.length<lesson.rounds) result.push(...shuffle(pool));
  return result.slice(0,lesson.rounds);
}

function currentEntry(){ return queue[currentRound] ?? lesson.items[0]; }
function currentTarget(){ const entry=currentEntry(); return String(entry&&typeof entry==="object"?entry.answer:entry); }
function normalize(value){ return String(value).trim().replace(/\s+/g," ").toLocaleLowerCase("id-ID"); }

function clearTimers(){
  if(countdownTimer) clearTimeout(countdownTimer);
  if(advanceTimer) clearTimeout(advanceTimer);
  if(badgeTimer) clearTimeout(badgeTimer);
  countdownTimer=advanceTimer=badgeTimer=null;
}

function setFeedback(text,type=""){ feedback.textContent=text; feedback.className=`feedback-message${type?` ${type}`:""}`; }
function speak(text){
  if(!soundEnabled||!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang="id-ID"; utterance.rate=.82; utterance.pitch=1.05;
  window.speechSynthesis.speak(utterance);
}

function speakTarget(){
  const target=currentTarget();
  if(lesson.type==="letter") speak(`Ketik huruf ${target}`);
  else if(lesson.type==="number") speak(`Ketik angka ${target}`);
  else if(lesson.type==="picture") speak(`Gambar ini adalah ${target}. Ketik ${target}.`);
  else if(lesson.type==="word") speak(`Ketik kata ${target}`);
  else speak(`Ketik kalimat. ${target}`);
}

function renderKeyboard(){
  keyboard.innerHTML="";
  KEYBOARD_ROWS.flat().forEach((key)=>{
    const node=document.createElement("span");
    node.className="key"; node.dataset.key=key.toLowerCase(); node.textContent=key; keyboard.appendChild(node);
  });
  const space=document.createElement("span");
  space.className="key space"; space.dataset.key=" "; space.textContent="SPASI"; keyboard.appendChild(space);
}

function updateKeyboardHint(){
  keyboard.querySelectorAll(".key.active").forEach((key)=>key.classList.remove("active"));
  if(!gameActive||locked) return;
  const target=currentTarget();
  const next=target[typingInput.value.length]??target[0]??"";
  const selector=next===" "?'[data-key=" "]':`[data-key="${CSS.escape(next.toLowerCase())}"]`;
  const key=keyboard.querySelector(selector);
  if(key) key.classList.add("active");
}

function renderTarget(){
  const target=currentTarget();
  const entry=currentEntry();
  targetLine.className="target-line";
  targetCard.classList.toggle("picture-mode",lesson.type==="picture");

  if(lesson.type==="picture"){
    targetLine.classList.add("picture");
    targetLine.innerHTML=`<svg role="img" aria-label="Gambar soal"><use href="${PICTURE_SPRITE}#${entry.icon}"></use></svg>`;
    targetKicker.textContent="KETIK NAMA GAMBAR";
    targetHint.textContent=`${entry.hint} • ketik namanya`;
    typingInput.placeholder="Ketik nama gambar…";
  }else{
    targetLine.textContent=target;
    targetKicker.textContent="KETIK INI";
    typingInput.placeholder="Ketik di sini…";
    if(lesson.type==="word") targetLine.classList.add("word");
    if(lesson.type==="sentence") targetLine.classList.add("sentence");
    if(lesson.type==="letter") targetHint.textContent=`Cari huruf ${target} di keyboard`;
    else if(lesson.type==="number") targetHint.textContent=`Cari angka ${target} di keyboard`;
    else if(lesson.type==="word") targetHint.textContent=`${target.length} huruf • ketik pelan-pelan`;
    else targetHint.textContent="Baca dulu, lalu ketik sedikit demi sedikit";
  }

  typingInput.maxLength=lesson.type==="letter"?1:Math.max(target.length+5,20);
  typingInput.inputMode=lesson.type==="number"?"numeric":"text";
  updateKeyboardHint();
}

function renderHud(){
  const done=Math.min(currentRound,lesson.rounds), percent=Math.round((done/lesson.rounds)*100);
  scoreStat.textContent=score.toLocaleString("id-ID"); comboStat.textContent=combo; starStat.textContent=stars;
  roundLabel.textContent=`Ronde ${Math.min(currentRound+1,lesson.rounds)} dari ${lesson.rounds}`;
  progressPercent.textContent=`${percent}%`; progressBar.style.width=`${percent}%`;
  const nextChest=correct<5?5:correct<10&&lesson.rounds>=10?10:null;
  chestMilestone.textContent=nextChest?`Peti di ${nextChest} benar`:"Menuju selesai";
}

function unlockBadge(id){
  if(!BADGES[id]||adventure.badges.includes(id)) return;
  adventure.badges.push(id); saveAdventure(); badgeToastName.textContent=BADGES[id].name;
  badgeToast.hidden=false; badgeToast.classList.remove("show"); void badgeToast.offsetWidth; badgeToast.classList.add("show");
  clearTimeout(badgeTimer); badgeTimer=setTimeout(()=>{badgeToast.hidden=true;badgeToast.classList.remove("show");},3000);
}

function awardXp(amount){
  const value=Math.max(0,Math.round(Number(amount)||0)); if(!value) return;
  const before=levelInfo().level; adventure.xp+=value; sessionXp+=value; const after=levelInfo().level; renderLevel();
  if(after>before){setKibo(`LEVEL UP! Sekarang kamu Level ${after}!`,"happy");createConfetti(28);speak(`Level naik. Sekarang level ${after}`);}
}

function createConfetti(amount=18){
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const colors=["#ffd45f","#72e3b6","#8c7cff","#ff8f70","#65cce6"];
  for(let i=0;i<amount;i++){
    const piece=document.createElement("i"); piece.className="confetti";
    piece.style.left=`${10+Math.random()*80}%`; piece.style.top=`${15+Math.random()*20}%`; piece.style.background=colors[i%colors.length]; piece.style.animationDelay=`${Math.random()*.18}s`;
    document.body.appendChild(piece); setTimeout(()=>piece.remove(),1350);
  }
}

function resetGame(){
  clearTimers(); queue=buildQueue(); currentRound=score=combo=stars=correct=sessionXp=mistakesThisRound=0;
  gameActive=false; locked=false; chestOpened=false; chestFinishesGame=false;
  typingInput.value=""; typingInput.disabled=true; startBtn.hidden=false; finishOverlay.hidden=true; chestOverlay.hidden=true;
  targetCard.classList.remove("success","wrong"); setIcon(chestIconUse,"chest-closed");
  setFeedback("Tekan “Mulai Game” saat sudah siap.");
  setKibo(lesson.type==="picture"?"Aku siap! Lihat gambarnya, lalu ketik namanya.":"Aku siap membantu. Tekan “Mulai Game” ya!");
  renderTarget(); renderHud(); renderLevel();
}

function runCountdown(){
  clearTimers(); countdownOverlay.hidden=false; typingInput.disabled=true; startBtn.hidden=true;
  const steps=[{number:"3",text:"Siapkan tanganmu!"},{number:"2",text:lesson.type==="picture"?"Lihat gambarnya…":"Lihat kartunya…"},{number:"1",text:"Cari tombolnya…"},{number:"GO!",text:"Ayo mulai!"}];
  let index=0;
  const step=()=>{
    const current=steps[index]; countdownNumber.textContent=current.number; countdownText.textContent=current.text;
    countdownNumber.style.animation="none"; void countdownNumber.offsetWidth; countdownNumber.style.animation="countPop .65s ease";
    speak(current.number==="GO!"?"Mulai":current.number); index+=1;
    if(index<steps.length) countdownTimer=setTimeout(step,700); else countdownTimer=setTimeout(beginRound,600);
  };
  step();
}

function startGame(){ resetGame(); gameActive=true; queue=buildQueue(); renderTarget(); renderHud(); setKibo("Petualangan dimulai! Aku ikut menemani.","happy"); runCountdown(); }

function beginRound(){
  countdownOverlay.hidden=true; chestOverlay.hidden=true; locked=false; mistakesThisRound=0; typingInput.value=""; typingInput.disabled=false;
  targetCard.classList.remove("success","wrong");
  setFeedback(lesson.type==="picture"?"Lihat gambarnya, lalu ketik nama yang kamu tahu.":"Lihat kartu, lalu ketik jawabannya.");
  setKibo(lesson.type==="picture"?"Lihat bentuk dan warnanya. Kamu pasti bisa!":currentRound===0?"Ayo! Cari tombol yang sama.":"Bagus. Kita lanjut satu soal lagi!");
  renderTarget(); typingInput.focus({preventScroll:true});
  if(lesson.type!=="picture") speakTarget();
}

function wrongAnswer(){
  if(locked) return;
  mistakesThisRound+=1; combo=0; renderHud(); targetCard.classList.remove("wrong"); void targetCard.offsetWidth; targetCard.classList.add("wrong");
  setFeedback(lesson.type==="picture"?"Belum cocok. Lihat gambarnya lagi lalu periksa huruf yang kamu ketik.":"Hampir! Lihat kartunya lagi lalu coba sekali lagi.","warning");
  setKibo("Tidak apa-apa. Coba lagi pelan-pelan.","encourage");
  if(lesson.type==="letter"||lesson.type==="number"){
    locked=true; advanceTimer=setTimeout(()=>{typingInput.value="";locked=false;targetCard.classList.remove("wrong");updateKeyboardHint();typingInput.focus({preventScroll:true});},430);
  }
}

function correctAnswer(){
  if(locked) return;
  locked=true; typingInput.disabled=true; correct+=1; combo+=1; stars+=1;
  const earnedScore=100+Math.min(combo*10,100), earnedXp=25+Math.min(combo*2,15);
  score+=earnedScore; adventure.totalCorrect+=1; adventure.totalStars+=1; awardXp(earnedXp); unlockBadge("first-step"); if(combo>=5) unlockBadge("combo-five"); saveAdventure();
  targetCard.classList.remove("wrong"); targetCard.classList.add("success");
  rewardPop.textContent=`+${earnedScore} • +${earnedXp} XP`; rewardPop.classList.remove("show"); void rewardPop.offsetWidth; rewardPop.classList.add("show");
  setFeedback(mistakesThisRound?"Yes! Ketemu juga. Bagus sudah mencoba lagi!":lesson.type==="picture"?`Benar! Itu ${currentTarget()}!`:"Hebat! Jawabanmu benar!","success");
  setKibo(combo>=3?`Combo ${combo}! Keren sekali!`:"Benar! Bintang kita bertambah.","happy"); renderHud(); createConfetti(combo>=3?18:10); if(combo>=3) speak(`Hebat. Combo ${combo}`);
  advanceTimer=setTimeout(()=>{
    const isLast=currentRound+1>=lesson.rounds;
    if(correct%5===0){chestFinishesGame=isLast;openChestCheckpoint();return;}
    if(isLast){currentRound+=1;finishGame();return;}
    currentRound+=1; typingInput.value=""; targetCard.classList.remove("success"); renderHud(); beginRound();
  },850);
}

function evaluate(){
  if(!gameActive||locked) return;
  const target=currentTarget(), typed=typingInput.value; updateKeyboardHint();
  if(!typed){targetCard.classList.remove("wrong");setFeedback(lesson.type==="picture"?"Lihat gambarnya, lalu ketik namanya.":"Lihat kartu, lalu ketik jawabannya.");return;}
  if(normalize(typed)===normalize(target)){correctAnswer();return;}
  if(lesson.type==="letter"){wrongAnswer();return;}
  const typedLower=typed.toLocaleLowerCase("id-ID"), targetLower=target.toLocaleLowerCase("id-ID");
  if(targetLower.startsWith(typedLower)){
    targetCard.classList.remove("wrong");
    setFeedback(lesson.type==="number"?"Bagus, lanjutkan angkanya.":lesson.type==="picture"?"Bagus, huruf awalnya sudah cocok.":"Bagus, lanjutkan sedikit lagi.");
  }else wrongAnswer();
}

function openChestCheckpoint(){
  locked=true; typingInput.disabled=true; chestOpened=false; chestReward.hidden=true; continueChestBtn.hidden=true; openChestBtn.hidden=false; openChestBtn.disabled=false;
  setIcon(chestIconUse,"chest-closed"); chestOverlay.hidden=false; setKibo("Wah! Kita menemukan peti hadiah!","happy"); speak("Kamu menemukan peti hadiah. Ayo buka petinya.");
}

function revealChest(){
  if(chestOpened) return; chestOpened=true;
  const bonusStars=Math.floor(Math.random()*4)+2, bonusXp=50;
  stars+=bonusStars; adventure.totalStars+=bonusStars; adventure.chests+=1; awardXp(bonusXp); saveAdventure(); renderHud(); setIcon(chestIconUse,"chest-open");
  chestRewardTitle.textContent=`+${bonusStars} bintang`; chestRewardXp.textContent=`+${bonusXp} XP`; chestReward.hidden=false; continueChestBtn.hidden=false; openChestBtn.hidden=true;
  createConfetti(30); setKibo("Hore! Hadiahnya sudah kita ambil.","happy"); speak(`Hore. Kamu mendapat ${bonusStars} bintang dan ${bonusXp} XP.`);
}

function continueAfterChest(){
  chestOverlay.hidden=true; currentRound+=1; typingInput.value=""; targetCard.classList.remove("success");
  if(chestFinishesGame){chestFinishesGame=false;finishGame();return;}
  renderHud(); beginRound();
}

function finishGame(){
  clearTimers(); gameActive=false; locked=true; typingInput.disabled=true;
  if(!adventure.completed.includes(currentLesson)){adventure.completed.push(currentLesson);awardXp(100);}
  unlockBadge(lesson.badge); saveAdventure();
  progressBar.style.width="100%"; progressPercent.textContent="100%"; roundLabel.textContent=`Selesai • ${lesson.rounds} ronde`; chestMilestone.textContent="Dunia selesai";
  finishScore.textContent=score.toLocaleString("id-ID"); finishStars.textContent=stars; finishXp.textContent=`+${sessionXp} XP`;
  const info=levelInfo(); finishLevelText.textContent=`Level ${info.level} • ${info.current}/${XP_PER_LEVEL} XP`; finishXpBar.style.width=`${info.percent}%`;
  finishMessage.textContent=lesson.type==="picture"?"Kamu berhasil mengenali semua gambar dan mengetik namanya. Hebat!":combo>=5?"Petualangan selesai dengan combo keren. Mau pecahkan skor lagi?":"Kamu berhasil menyelesaikan dunia ini. Setiap usaha membuat Kibo makin kuat!";
  const bestKey=`ketik100-best-${currentLesson}`, best=Number(storageGet(bestKey)||0); if(score>best) storageSet(bestKey,String(score));
  setKibo("Dunia selesai! Aku bangga sama usahamu.","happy"); createConfetti(42); finishOverlay.hidden=false; speak("Petualangan selesai. Hebat sekali!");
}

document.body.dataset.mode=currentLesson;
el("headerWorld").textContent=lesson.header; el("worldLabel").textContent=lesson.world; el("practiceTitle").textContent=lesson.title; el("missionPill").textContent=lesson.mission; el("instruction").textContent=lesson.instruction;
document.title=`Ketik100 — ${lesson.header}`;

renderKeyboard(); resetGame(); renderSoundIcon();
typingInput.addEventListener("input",evaluate);
typingInput.addEventListener("paste",(event)=>{event.preventDefault();setFeedback("Untuk latihan, ketik sendiri ya. Fitur tempel dimatikan.","warning");});
typingInput.addEventListener("keydown",(event)=>{if(event.key==="Enter") event.preventDefault();});
startBtn.addEventListener("click",startGame); restartBtn.addEventListener("click",startGame); el("playAgainBtn").addEventListener("click",startGame);
openChestBtn.addEventListener("click",revealChest); continueChestBtn.addEventListener("click",continueAfterChest); el("speakTarget").addEventListener("click",speakTarget);
soundToggle.addEventListener("click",()=>{soundEnabled=!soundEnabled;storageSet("ketik100-sound",soundEnabled?"on":"off");renderSoundIcon();if(!soundEnabled&&"speechSynthesis" in window)window.speechSynthesis.cancel();else speak("Suara panduan aktif");});
window.addEventListener("beforeunload",clearTimers);
