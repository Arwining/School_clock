/* THEMES */

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

document.body.className=""

let theme=
localStorage.getItem(
TH
)||"default-dark"

if(theme.includes("light"))
document.body.classList.add(
"light"
)

if(theme.includes("sunset"))
document.body.classList.add(
"theme-sunset"
)

if(theme.includes("moon"))
document.body.classList.add(
"theme-moon"
)

if(theme.includes("void"))
document.body.classList.add(
"theme-void"
)

if(theme.includes("admin"))
document.body.classList.add(
"theme-admin"
)

if(theme.includes("hacker"))
document.body.classList.add(
"theme-hacker"
)

}

applyTheme()