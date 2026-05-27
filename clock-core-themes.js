/* =========================
THEMES + UNLOCKS
========================= */

const PT="schoolClockPlaytime"
const TH="schoolClockTheme"

setInterval(()=>{

let p=
Number(localStorage.getItem(PT)||0)

localStorage.setItem(
PT,
p+1
)

},1000)

function hoursPlayed(){

return Math.floor(
Number(
localStorage.getItem(PT)||0
)/3600
)

}

function unlocked(name){

if(name=="default")
return true

if(name=="sunset")
return hoursPlayed()>=50

if(name=="moon")
return hoursPlayed()>=100

if(name=="void")
return hoursPlayed()>=150

if(name=="admin")
return localStorage.getItem(
"adminUnlocked"
)=="1"

if(name=="hacker")
return localStorage.getItem(
"hackerUnlocked"
)=="1"

return false

}

window.setAppearance=function(name){

if(!unlocked(name)){

alert("Theme Locked")

return

}

localStorage.setItem(
TH,
name
)

applyTheme()

}

window.toggleMode=function(){

let mode=
localStorage.getItem(
"schoolClockMode"
)||"dark"

mode=
mode=="dark"
?"light"
:"dark"

localStorage.setItem(
"schoolClockMode",
mode
)

applyTheme()

}

function applyTheme(){

document.body.className=""

let mode=
localStorage.getItem(
"schoolClockMode"
)||"dark"

if(mode=="light"){

document.body.classList.add(
"light"
)

}

let theme=
localStorage.getItem(
TH
)||"default"

if(theme!="default"){

document.body.classList.add(
"theme-"+theme
)

}

}

let keys={}

document.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]=true

/* ADMIN */

if(
keys.a &&
keys.d &&
keys.m
){

let c=prompt("Code")

if(
c==
"Definitely not the admin appearance"
){

localStorage.setItem(
"adminUnlocked",
"1"
)

updateSecretThemes()

alert("Admin Theme Unlocked")

}

}

/* HACKER */

if(
keys.h &&
keys.c &&
keys.k
){

let c=prompt("Code")

if(c=="Hacking"){

localStorage.setItem(
"hackerUnlocked",
"1"
)

updateSecretThemes()

alert("Hacker Theme Unlocked")

}

}

setTimeout(()=>{

keys={}

},700)

})

function updateSecretThemes(){

if(
localStorage.getItem(
"adminUnlocked"
)=="1"
){

q("adminThemeBtn")
.style.display="block"

}

if(
localStorage.getItem(
"hackerUnlocked"
)=="1"
){

q("hackerThemeBtn")
.style.display="block"

}

}

updateSecretThemes()

applyTheme()