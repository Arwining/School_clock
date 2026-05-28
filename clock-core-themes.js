const PT="schoolClockPlaytime"
const TH="schoolClockTheme"

/* =========================
TRACK PLAYTIME
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

function hoursPlayed(){

return Math.floor(
Number(
localStorage.getItem(PT)||0
)/3600)

}

/* =========================
UNLOCK SYSTEM
========================= */

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

/* =========================
APPLY THEMES
========================= */

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

/* =========================
SECRET KEY COMBOS
========================= */

const keys={}

window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]=true

/* =========================
ADMIN THEME
A + D + M
========================= */

if(
keys["a"] &&
keys["d"] &&
keys["m"]
){

setTimeout(()=>{

let code=prompt(
"Admin Code"
)

if(
code===
";kdf7s7fasuj3ijas;o8fjaso;jdskjfa dsalk fjsa;ja;sfdjasdf'asd;//a/sdfja/372a9afsl"
){

localStorage.setItem(
"adminUnlocked",
"1"
)

alert(
"Admin Theme Unlocked"
)

}

},50)

}

/* =========================
HACKER THEME
H + C + K
========================= */

if(
keys["h"] &&
keys["c"] &&
keys["k"]
){

setTimeout(()=>{

let code=prompt(
"Hacker Code"
)

if(
code==="Hacking"
){

localStorage.setItem(
"hackerUnlocked",
"1"
)

alert(
"Hacker Theme Unlocked"
)

}

},50)

}

/* =========================
TIME CHEAT
T + I + M + E
========================= */

if(
keys["t"] &&
keys["i"] &&
keys["m"] &&
keys["e"]
){

setTimeout(()=>{

let code=prompt(
"Time Code"
)

if(
code==="nah id win"
){

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
(
Number(hrs)||0
)*3600
)

alert(
"Time Added"
)

}

},50)

}

})

window.addEventListener(
"keyup",
e=>{

delete keys[
e.key.toLowerCase()
]

})

/* =========================
HACKER MATRIX EFFECT
========================= */

const c=
document.getElementById(
"matrixCanvas"
)

if(c){

const x=
c.getContext("2d")

function rs(){

c.width=innerWidth
c.height=innerHeight

}

rs()

addEventListener("resize",rs)

const letters=
"01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ"

const size=16

let cols=
Math.floor(
innerWidth/size
)

let drops=
Array(cols).fill(1)

function draw(){

if(
!document.body.classList.contains(
"theme-hacker"
)
)return

x.fillStyle=
"rgba(0,0,0,.08)"

x.fillRect(
0,
0,
c.width,
c.height
)

x.fillStyle="#00ff88"

x.font=
size+"px monospace"

for(
let i=0;
i<drops.length;
i++
){

const t=
letters[
Math.floor(
Math.random()*
letters.length
)
]

x.fillText(
t,
i*size,
drops[i]*size
)

if(
drops[i]*size>
c.height &&
Math.random()>.975
){

drops[i]=0

}

drops[i]++

}

requestAnimationFrame(draw)

}

draw()

}