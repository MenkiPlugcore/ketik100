const XP_PER_LEVEL = 500;
const STORAGE_KEY = "ketik100-adventure-v12";
const BADGES = ["first-step","alphabet-master","word-explorer","picture-explorer","number-friend","sentence-hero","combo-five"];
const WORLDS = ["huruf","kata","gambar","angka","kalimat"];
const WORLD_ROUNDS = {huruf:10,kata:10,gambar:10,angka:10,kalimat:6};

function byId(id){return document.getElementById(id);}

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
  const current=safe%XP_PER_LEVEL;
  return {
    level:Math.floor(safe/XP_PER_LEVEL)+1,
    current,
    percent:Math.round((current/XP_PER_LEVEL)*100)
  };
}

function bestScore(world){
  try{return Math.max(0,Number(localStorage.getItem(`ketik100-best-${world}`))||0);}catch{return 0;}
}

function renderWorldProgress(adventure){
  document.querySelectorAll("[data-progress-for]").forEach(el=>{
    const world=el.dataset.progressFor;
    const rounds=WORLD_ROUNDS[world]||10;
    const done=adventure.completed.includes(world);
    el.textContent=done?`${rounds}/${rounds} misi`:bestScore(world)>0?"Pernah dimainkan":"0/"+rounds+" misi";
    el.closest(".world-card")?.classList.toggle("completed",done);
  });
}

function renderBadges(adventure){
  document.querySelectorAll(".badge-card").forEach(card=>{
    const unlocked=adventure.badges.includes(card.dataset.badge);
    card.classList.toggle("locked",!unlocked);
    card.classList.toggle("unlocked",unlocked);
  });
}

function render(){
  const adventure=getSavedAdventure();
  const level=levelInfo(adventure.xp);

  byId("headerStars").textContent=adventure.totalStars;
  byId("worldsDone").textContent=adventure.completed.length;
  byId("totalXp").textContent=adventure.xp.toLocaleString("id-ID");
  byId("profileCorrect").textContent=adventure.totalCorrect.toLocaleString("id-ID");
  byId("profileChests").textContent=adventure.chests;
  byId("xpBar").style.width=`${level.percent}%`;
  byId("xpPercent").textContent=`${level.percent}%`;

  const progressTitle=byId("progressTitle");
  const speech=byId("mascotSpeech");
  if(progressTitle) progressTitle.textContent=`Kibo siap menemani • Level ${level.level}`;

  if(adventure.completed.length===WORLDS.length){
    speech.textContent="Semua dunia sudah selesai! Pilih dunia favoritmu dan coba pecahkan skor terbaikmu.";
  }else if(adventure.totalCorrect===0){
    speech.textContent="Mulai dari Hutan Huruf, lalu jelajahi dunia lain sesuai kemampuanmu.";
  }else if(!adventure.completed.includes("gambar")&&adventure.totalCorrect>=5){
    speech.textContent="Keren! Coba Taman Gambar untuk melatih daya ingat visual sambil mengetik.";
  }else{
    speech.textContent=`Kamu sudah mengumpulkan ${adventure.totalStars} bintang. Sedikit demi sedikit, kemampuan mengetikmu terus berkembang.`;
  }

  renderWorldProgress(adventure);
  renderBadges(adventure);
}

window.addEventListener("pageshow",render);
render();
