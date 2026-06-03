const TH="schoolClockTheme"
const PT="schoolClockPlaytime"
const UNLOCKS="schoolClockUnlocks"

/* =========================
CODER LABEL
========================= */

if(!document.getElementById("coderTag")){
  let t=document.createElement("div")
  t.id="coderTag"
  t.textContent="the coder"
  document.body.appendChild(t)
}

/* =========================
PLAYTIME TRACKING
========================= */

setInterval(()=>{
  let p=Number(localStorage.getItem(PT)||0)
  localStorage.setItem(PT,p+1)
},1000)

/* =========================
UNLOCK STORAGE
========================= */

function getUnlocks(){
  try{
    return JSON.parse(localStorage.getItem(UNLOCKS)||"[]")
  }catch{
    return []
  }
}
function saveUnlock(v){
  let u=getUnlocks()
  if(!u.includes(v)){
    u.push(v)
    localStorage.setItem(UNLOCKS,JSON.stringify(u))
  }
}

/* =========================
AUTO UNLOCK THEMES
========================= */

function updatePlaytimeUnlocks(){
  let p=Number(localStorage.getItem(PT)||0)
  let hrs=p/3600
  if(hrs>=50) saveUnlock("sunset-dark")
  if(hrs>=100) saveUnlock("moon-dark")
  if(hrs>=150) saveUnlock("void-dark")
}
setInterval(updatePlaytimeUnlocks,5000)
updatePlaytimeUnlocks()

/* =========================
REMAINING HOURS
========================= */

function getRemaining(name){
  return 0
}

/* =========================
MENU FILTERING
========================= */

function updateThemeButtons(){
  const unlocks=getUnlocks()
  document.querySelectorAll("[data-theme]").forEach(btn=>{
    const th=btn.dataset.theme
    btn.style.display="block"
    btn.textContent=btn.dataset.label
  })
}
setInterval(updateThemeButtons,3000)
window.addEventListener("load",updateThemeButtons)

/* =========================
SET APPEARANCE
========================= */

window.setAppearance=function(name){
  localStorage.setItem(TH,name)
  applyTheme()
}

/* =========================
APPLY THEME
========================= */

function applyTheme(){
  document.body.className=""
  let t=localStorage.getItem(TH)||"default-dark"
  handleThemeChange("none");
  if(t==="default-light"){
    document.body.classList.add("light")
  }
  if(t==="sunset-dark"){
    document.body.classList.add("theme-sunset")
  }
  if(t==="moon-dark"){
    document.body.classList.add("theme-moon")
  }
  if(t==="void-dark"){
    document.body.classList.add("theme-void")
  }
  if(t==="admin-dark"){
    document.body.classList.add("theme-admin")
  }
  if(t==="hacker-dark"){
    document.body.classList.add("theme-hacker")
  }
}

// Moon overlay canvas element
const moonCanvas = document.getElementById('moonCanvas');
const moonCtx = moonCanvas ? moonCanvas.getContext('2d') : null;

function resizeMoonCanvas() {
  if (moonCanvas) {
    moonCanvas.width = window.innerWidth;
    moonCanvas.height = window.innerHeight;
  }
}

function drawMoon() {
  if (!moonCtx || !moonCanvas) return;
  moonCtx.clearRect(0, 0, moonCanvas.width, moonCanvas.height);
  const w = moonCanvas.width;
  const h = moonCanvas.height;
  const moonX = w * 0.8; // right side
  const moonY = h * 0.2; // top
  const radius = Math.min(w, h) * 0.1;

  // Draw full circle (moon)
  moonCtx.fillStyle = '#f0e68c'; // moon color
  moonCtx.beginPath();
  moonCtx.arc(moonX, moonY, radius, 0, Math.PI * 2);
  moonCtx.fill();

  // Overlay to create crescent shape
  moonCtx.globalCompositeOperation = 'destination-out';
  moonCtx.beginPath();
  moonCtx.arc(moonX + radius * 0.3, moonY, radius * 0.8, 0, Math.PI * 2);
  moonCtx.fill();

  moonCtx.globalCompositeOperation = 'source-over';
}

// Handle theme change to draw moon if needed
function handleThemeChange(themeName) {
  if (!moonCanvas || !moonCtx) return;
  if (themeName === 'moon-dark') {
    moonCanvas.style.display = 'block';
    resizeMoonCanvas();
    drawMoon();
  } else {
    moonCanvas.style.display = 'none';
  }
}

window.addEventListener('resize', () => {
  const theme = localStorage.getItem(TH);
  if (theme === 'moon-dark') {
    resizeMoonCanvas();
    drawMoon();
  }
});