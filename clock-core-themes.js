const TH="schoolClockTheme"

window.setAppearance=function(name){

localStorage.setItem(
TH,
name
)

applyTheme()

}

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

applyTheme()

const held={}
let lock=false

window.addEventListener(
"keydown",
e=>{

if(lock)return

held[e.key.toLowerCase()]=true

if(
held.a&&held.d&&held.m
){

lock=true

setTimeout(()=>{

let c=
prompt("Admin Code")

if(
c===
"Definitely not the admin appearance"
){

localStorage.setItem(
"schoolClockTheme",
"admin-dark"
)

applyTheme()

}

held.a=
held.d=
held.m=
false

lock=false

},50)

}

if(
held.h&&held.c&&held.k
){

lock=true

setTimeout(()=>{

let c=
prompt("Hacker Code")

if(c==="Hacking"){

localStorage.setItem(
"schoolClockTheme",
"hacker-dark"
)

applyTheme()

}

held.h=
held.c=
held.k=
false

lock=false

},50)

}

})