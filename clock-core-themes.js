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

let p=
Number(
localStorage.getItem(PT)||0
)

localStorage.setItem(
PT,
p+1
)

},1000)

/* =========================
UNLOCK STORAGE
========================= */

function getUnlocks(){

try{

return JSON.parse(
localStorage.getItem(
UNLOCKS
)||"[]"
)

}catch{

return []

}

}

function saveUnlock(v){

let u=getUnlocks()

if(!u.includes(v)){

u.push(v)

localStorage.setItem(
UNLOCKS,
JSON.stringify(u)
)

}

}

/* =========================
AUTO UNLOCK PLAYTIME THEMES
========================= */

function updatePlaytimeUnlocks(){

let p=
Number(
localStorage.getItem(PT)||0
)

let hrs=p/3600

if(hrs>=50)
saveUnlock("sunset-dark")

if(hrs>=100)
saveUnlock("moon-dark")

if(hrs>=150)
saveUnlock("void-dark")

}

setInterval(
updatePlaytimeUnlocks,
5000
)

updatePlaytimeUnlocks()

/* =========================
REMAINING HOURS
========================= */

function getRemaining(name){

let p=
Number(
localStorage.getItem(PT)||0
)/3600

if(name==="sunset-dark"){
return Math.max(
0,
Math.ceil(50-p)
)
}

if(name==="moon-dark"){
return Math.max(
0,
Math.ceil(100-p)
)
}

if(name==="void-dark"){
return Math.max(
0,
Math.ceil(150-p)
)
}

return 0

}

/* =========================
MENU FILTERING
========================= */

function updateThemeButtons(){

const unlocks=
getUnlocks()

document
.querySelectorAll("[data-theme]")
.forEach(btn=>{

const th=
btn.dataset.theme

/* admin/hacker hidden */

if(
(th==="admin-dark"||
th==="hacker-dark")
&&
!unlocks.includes(th)
){

btn.style.display="none"
return

}

btn.style.display="block"

/* locked playtime themes */

if(
!unlocks.includes(th)
&&
(
th==="sunset-dark"||
th==="moon-dark"||
th==="void-dark"
)
){

btn.textContent=
btn.dataset.label+
" 🔒 ("+
getRemaining(th)+
"h)"

}else{

btn.textContent=
btn.dataset.label

}

})

}

setInterval(
updateThemeButtons,
3000
)

window.addEventListener(
"load",
updateThemeButtons
)

/* =========================
SET APPEARANCE
========================= */

window.setAppearance=function(name){

let u=getUnlocks()

const locked=[
"sunset-dark",
"moon-dark",
"void-dark",
"admin-dark",
"hacker-dark"
]

if(
locked.includes(name)
&&
!u.includes(name)
){

if(
name==="sunset-dark"||
name==="moon-dark"||
name==="void-dark"
){

alert(
"Locked\n\n"+
getRemaining(name)+
" more hours required"
)

}else{

alert("Theme Locked")

}

return

}

localStorage.setItem(
TH,
name
)

applyTheme()

}

/* =========================
APPLY THEME
========================= */

function applyTheme(){

document.body.className=""

let t=
localStorage.getItem(TH)
||"default-dark"

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

applyTheme()

/* =========================
FIRST TIME SETUP
========================= */

if(
!localStorage.getItem(
"schoolClockInitialized"
)
){

localStorage.setItem(
UNLOCKS,
"[]"
)

localStorage.setItem(
PT,
"0"
)

localStorage.setItem(
"schoolClockInitialized",
"1"
)

}

/* =========================
SECRET COMBOS
========================= */

const held={}
let promptOpen=false

function resetKeys(){

for(let k in held)
delete held[k]

}

/* =========================
KEY DOWN
========================= */

window.addEventListener(
"keydown",
e=>{

if(promptOpen)return

held[
e.key.toLowerCase()
]=true

/* =========================
ADMIN
========================= */

if(
held.a&&
held.d&&
held.m
){

promptOpen=true

setTimeout(()=>{

let c=
prompt("Admin Code")

if(
c===
"Asfidj shduifhy ah48395287349052ew45 v3/e'd.. /.wZd"
){

saveUnlock(
"admin-dark"
)

localStorage.setItem(
TH,
"admin-dark"
)

applyTheme()

updateThemeButtons()

alert(
"Admin Theme Unlocked"
)

}

resetKeys()

promptOpen=false

},50)

}

/* =========================
HACKER
========================= */

if(
held.h&&
held.c&&
held.k
){

promptOpen=true

setTimeout(()=>{

let c=
prompt("Hacker Code")

if(
c==="Hacking"
){

saveUnlock(
"hacker-dark"
)

localStorage.setItem(
TH,
"hacker-dark"
)

applyTheme()

updateThemeButtons()

alert(
"Hacker Theme Unlocked"
)

}

resetKeys()

promptOpen=false

},50)

}

/* =========================
TIME CHEAT
========================= */

if(
held.t&&
held.i&&
held.m&&
held.e
){

promptOpen=true

setTimeout(()=>{

let c=
prompt("Time Code")

if(
c==="nah id win"
){

let hrs=
prompt(
"Hours To Add"
)

if(
hrs!==null
){

let p=
Number(
localStorage.getItem(
PT
)||0
)

localStorage.setItem(
PT,
p+
(
(Number(hrs)||0)
*3600
)
)

updatePlaytimeUnlocks()
updateThemeButtons()

alert(
"Added "+hrs+" hours"
)

}

}

resetKeys()

promptOpen=false

},50)

}

})

/* =========================
KEY UP
========================= */

window.addEventListener(
"keyup",
e=>{

delete held[
e.key.toLowerCase()
]

})

/* =========================
INITIAL REFRESH
========================= */

updateThemeButtons()