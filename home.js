const XP_PER_LEVEL = 500;
const STORAGE_KEY = "ketik100-adventure-v12";
const BADGES = ["first-step","alphabet-master","word-explorer","number-friend","sentence-hero","combo-five"];
const WORLDS = ["huruf","kata","angka","kalimat"];

function getSavedAdventure(){
  const fallback={xp:0,totalStars:0,totalCorrect:0,chests:0,badges:[],completed:[]};
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(!saved||typeof saved!=="object") return fallback;
    return {
      xp:Math.max(0,Number(saved.xp)||0),
      totalStars:Math.max(0,Number(saved.totalStars)||0),
      totalCorrect:Math.max(0,Number(saved.totalCorrect)||0),
      chests:Math.max(0,Number(saved.chests)||0),
      badges:Array.isArray(saved.badges)?saved.badges.filter(id=>BADGES.includes(id)):[],
      completed:Array.isArray(saved.completed)?saved.completed.filter(id=>WORLDS.includes(id)):[]
    };
  }catch{return fallback;}
}

function levelInfo(xp){
  const safe=Math.max(0,Number(xp)||0);
  return {level:Math.floor(safe/XP_PER_LEVEL)+1,current:safe%XP_PER_LEVEL,percent:((safe%XP_PER_LEVEL)/XP_PER_LEVEL)*100};
}

function render(){
  const adventure=getSavedAdventure();
  const level=levelInfo(adventure.xp);
  document.getElementById("headerStars").textContent=adventure.totalStars;
  document.getElementById("headerLevel").textContent=level.level;
  document.getElementById("profileLevel").textContent=level.level;
  document.getElementById("profileStars").textContent=adventure.totalStars;
  document.getElementById("profileCorrect").textContent=adventure.totalCorrect;
  document.getElementById("profileChests").textContent=adventure.chests;
  document.getElementById("xpText").textContent=`${level.current} / ${XP_PER_LEVEL}`;
  document.getElementById("xpBar").style.width=`${level.percent}%`;

  document.querySelectorAll("[data-status-for]").forEach(el=>{
    const id=el.dataset.statusFor;
    const done=adventure.completed.includes(id);
    el.textContent=done?"✓ Selesai • Main lagi →":id==="huruf"?"Mulai →":"Jelajahi →";
    el.closest(".world-card")?.classList.toggle("completed",done);
  });

  document.querySelectorAll(".badge-card").forEach(card=>{
    const unlocked=adventure.badges.includes(card.dataset.badge);
    card.classList.toggle("locked",!unlocked);
    card.classList.toggle("unlocked",unlocked);
  });

  const speech=document.getElementById("mascotSpeech");
  if(adventure.completed.length===4) speech.textContent="Semua dunia sudah selesai! Pilih dunia favoritmu dan coba pecahkan skor lagi.";
  else if(adventure.totalCorrect===0) speech.textContent="Hai! Aku Kibo. Ayo mulai dari Hutan Huruf!";
  else speech.textContent=`Keren! Kita sudah punya ${adventure.totalStars} bintang. Pilih dunia berikutnya ya!`;
}

window.addEventListener("pageshow",render);
render();
