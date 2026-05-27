/* =========================
THEMES + UNLOCKS
========================= */

const PT="schoolClockPlaytime"

const TH="schoolClockTheme"

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

function hoursPlayed(){

return Math.floor(

Number(
localStorage.getItem(PT)||0
)/3600

)

}

function unlocked(name){

if(
name.includes("default")
)
return true

if(
name.includes("sunset")
)
return hoursPlayed()>=50

if(
name.includes("moon")
)
return hoursPlayed()>=100

if(
name.includes("void")
)
return hoursPlayed()>=150

if(
name.includes("admin")
)
return localStorage.getItem(
"adminUnlocked"
)=="1"

if(
name.includes("hacker")
)
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

function applyTheme(){

document.body.className=""

let theme=
localStorage.getItem(
TH
)||"default-dark"

if(
theme.includes("light")
){

document.body.classList.add(
"light"
)

}

if(
theme.includes("sunset")
){

document.body.classList.add(
"theme-sunset"
)

}

if(
theme.includes("moon")
){

document.body.classList.add(
"theme-moon"
)

}

if(
theme.includes("void")
){

document.body.classList.add(
"theme-void"
)

}

if(
theme.includes("admin")
){

document.body.classList.add(
"theme-admin"
)

}

if(
theme.includes("hacker")
){

document.body.classList.add(
"theme-hacker"
)

}

}

/* SECRET THEMES */

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

alert(
"Admin Theme Unlocked"
)

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

alert(
"Hacker Theme Unlocked"
)

}

}

/* TIME CHEAT */

if(
keys.t &&
keys.i &&
keys.m &&
keys.e
){

let c=prompt(
"Time Code"
)

if(c=="nah id win"){

let hrs=prompt(
"Hours To Add"
)

hrs=Number(hrs)

if(!isNaN(hrs)){

let cur=
Number(
localStorage.getItem(
PT
)||0
)

localStorage.setItem(
PT,
cur+(hrs*3600)
)

alert(
hrs+
" hours added"
)

}

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