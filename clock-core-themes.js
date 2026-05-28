```javascript id="corethemesfull"
// clock-core-themes.js

const TH="schoolClockTheme"
const PT="schoolClockPlaytime"
const UNLOCKS="schoolClockUnlocks"

/* =========================
PLAYTIME
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

return[]

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
AUTO UNLOCK
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

updatePlaytimeUnlocks()

setInterval(
updatePlaytimeUnlocks,
5000
)

/* =========================
HIDE LOCKED
========================= */

function updateThemeButtons(){

const unlocks=
getUnlocks()

document
.querySelectorAll("[data-theme]")
.forEach(btn=>{

const th=
btn.dataset.theme

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

})

}

/* =========================
APPLY THEME
========================= */

function applyTheme(){

document.body.className=""

let t=
localStorage.getItem(TH)
||"default-dark"

if(t==="default-light")
document.body.classList.add("light")

if(t==="sunset-dark")
document.body.classList.add("theme-sunset")

if(t==="moon-dark")
document.body.classList.add("theme-moon")

if(t==="void-dark")
document.body.classList.add("theme-void")

if(t==="admin-dark")
document.body.classList.add("theme-admin")

if(t==="hacker-dark")
document.body.classList.add("theme-hacker")

}

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

alert("Theme Locked")
return

}

localStorage.setItem(
TH,
name
)

applyTheme()

}

/* =========================
INITIAL
========================= */

applyTheme()
updateThemeButtons()

/* =========================
SECRET COMBOS
========================= */

const held={}
let promptOpen=false

function resetKeys(){

for(let k in held)
delete held[k]

}

window.addEventListener(
"keydown",
e=>{

if(promptOpen)return

held[
e.key.toLowerCase()
]=true

/* ADMIN */

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

/* HACKER */

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

})

window.addEventListener(
"keyup",
e=>{

delete held[
e.key.toLowerCase()
]

})
```
