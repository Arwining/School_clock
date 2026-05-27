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
Number(localStorage.getItem(PT)||0)/3600
)

}

function unlocked(name){

if(name.includes("default"))
return true

if(name.includes("sunset"))
return hoursPlayed()>=50

if(name.includes("moon"))
return hoursPlayed()>=100

if(name.includes("void"))
return hoursPlayed()>=150

if(name.includes("admin"))
return localStorage.getItem(
"adminUnlocked"
)=="1"

if(name.includes("hacker"))
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

document.body.classList.remove(
"light",
"theme-sunset",
"theme-moon",
"theme-void",
"theme-admin",
"theme-hacker"
)

let theme=
localStorage.getItem(TH)
||"default-dark"

if(theme.includes("light"))
document.body.classList.add("light")

if(theme.includes("sunset"))
document.body.classList.add("theme-sunset")

if(theme.includes("moon"))
document.body.classList.add("theme-moon")

if(theme.includes("void"))
document.body.classList.add("theme-void")

if(theme.includes("admin"))
document.body.classList.add("theme-admin")

if(theme.includes("hacker"))
document.body.classList.add("theme-hacker")

}

applyTheme()

/* SECRET COMBOS */

const held={}
let promptOpen=false

function clearHeld(){

for(let k in held)
delete held[k]

}

window.addEventListener(
"keydown",
e=>{

if(promptOpen)return

held[e.key.toLowerCase()]=true

/* ADMIN */

if(
held["a"] &&
held["d"] &&
held["m"]
){

promptOpen=true

setTimeout(()=>{

let code=prompt(
"Admin Code"
)

if(
code===
"Definitely not the admin appearance"
){

localStorage.setItem(
"adminUnlocked",
"1"
)

alert(
"Admin Theme Unlocked"
)

}

clearHeld()

promptOpen=false

},50)

}

/* HACKER */

if(
held["h"] &&
held["c"] &&
held["k"]
){

promptOpen=true

setTimeout(()=>{

let code=prompt(
"Hacker Code"
)

if(code==="Hacking"){

localStorage.setItem(
"hackerUnlocked",
"1"
)

alert(
"Hacker Theme Unlocked"
)

}

clearHeld()

promptOpen=false

},50)

}

/* TIME */

if(
held["t"] &&
held["i"] &&
held["m"] &&
held["e"]
){

promptOpen=true

setTimeout(()=>{

let code=prompt(
"Time Code"
)

if(code==="nah id win"){

let hrs=prompt(
"Hours To Add"
)

let p=
Number(
localStorage.getItem(PT)||0
)

localStorage.setItem(
PT,
p+
(Number(hrs)||0)*3600
)

alert("Time Added")

}

clearHeld()

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