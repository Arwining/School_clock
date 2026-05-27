const CONFIG_URL=
"https://arwining.github.io/School_clock/config.json"

const LS="schoolClockLocal"
const H="schoolClock24Hour"
const O="schoolClockOffset"
const PT="schoolClockPlaytime"
const TH="schoolClockThemeUnlock"

const q=i=>document.getElementById(i)

const c=q("clock")
const mc=q("miniClock")
const mn=q("miniNext")
const mcd=q("miniCountdown")
const d=q("date")
const t=q("title")
const n=q("next")
const cd=q("countdown")
const pb=q("progressBar")
const l=q("list")
const m=q("menu")
const b=q("broadcast")
const bt=q("broadcastText")

let s=[]
let last=-1

/* MENU */

q("menuBtn").onclick=e=>{

e.stopPropagation()

m.classList.toggle("show")

}

m.onclick=e=>e.stopPropagation()

document.onclick=()=>{

m.classList.remove("show")

}

/* PLAYTIME */

function getPlaytime(){

return Number(
localStorage.getItem(PT)||0
)

}

function addPlaytime(){

let p=getPlaytime()

p+=1

localStorage.setItem(PT,p)

}

setInterval(addPlaytime,1000)

function hoursPlayed(){

return Math.floor(
getPlaytime()/3600
)

}

/* THEME UNLOCKS */

function unlockedThemes(){

let h=hoursPlayed()

return{

default:true,
sunset:h>=50,
moon:h>=100,
void:h>=150

}

}

function equippedTheme(){

return localStorage.getItem(TH)||"default"

}

function equipTheme(name){

let u=unlockedThemes()

if(!u[name]){

alert(
"Theme Locked\n\nSpend more time on the clock to unlock it."
)

return

}

localStorage.setItem(TH,name)

applyTheme()

}

/* APPLY THEMES */

function applyTheme(){

document.body.classList.remove(
"theme-sunset",
"theme-moon",
"theme-void"
)

let t=equippedTheme()

if(t=="sunset")
document.body.classList.add("theme-sunset")

if(t=="moon")
document.body.classList.add("theme-moon")

if(t=="void")
document.body.classList.add("theme-void")

}

/* APPEARANCE MENU */

function appearanceMenu(){

let u=unlockedThemes()

let h=hoursPlayed()

alert(

`CLOCK APPEARANCES

Hours Played: ${h}

1. Default
Unlocked

2. Sunset Sky
${u.sunset?"Unlocked":"Locked (50h)"}

3. Moon Rain
${u.moon?"Unlocked":"Locked (100h)"}

4. Void
${u.void?"Unlocked":"Locked (150h)"}

Use:
equipTheme("default")
equipTheme("sunset")
equipTheme("moon")
equipTheme("void")

inside console for now.`

)

}

/* OFFSET */

function getOffset(){

return Number(
localStorage.getItem(O)||0
)

}

function changeOffset(){

let current=getOffset()

let v=prompt(
"Clock offset in seconds",
current
)

if(v===null)return

v=Number(v)

if(isNaN(v)){

alert("Invalid Number")

return

}

localStorage.setItem(O,v)

}

/* THEME MODE */

function toggleTheme(){

document.body.classList.toggle("light")

}

/* 24 HOUR */

function is24Hour(){

return localStorage.getItem(H)=="1"

}

function toggle24Hour(){

localStorage.setItem(
H,
is24Hour()?"0":"1"
)

render()

}

/* FORMAT */

function formatClock(date){

return date.toLocaleTimeString([],{

hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:!is24Hour()

})

}

function fmtScheduleTime(v){

if(is24Hour()) return v

let[h,m]=v.split(":").map(Number)

let ap=h>=12?"PM":"AM"

h=h%12||12

return `${h}:${String(m).padStart(2,"0")} ${ap}`

}

function td(v){

let[a,b]=v.split(":").map(Number)

let d=new Date()

d.setHours(a,b,0,0)

return d

}

function fm(ms){

let x=Math.max(0,(ms/1000)|0)

let h=(x/3600)|0
let m=((x%3600)/60)|0
let s=x%60

return[h,m,s]
.map(v=>String(v).padStart(2,"0"))
.join(":")

}

/* STORAGE */

function saveLocal(){

localStorage.setItem(
LS,
JSON.stringify(s)
)

}

function loadLocal(){

try{

let d=JSON.parse(
localStorage.getItem(LS)
)

if(d?.length){

s=d

}

}catch{}

}

/* RENDER */

function render(){

l.innerHTML=s.map((p,i)=>`

<div
class="item ${p.type=="transition"?"thin":""}"
id="i${i}"
>

<span>${p.name}</span>

<span>

${fmtScheduleTime(p.start)}
-
${fmtScheduleTime(p.end)}

</span>

</div>

`).join("")

}

/* IMPORT */

function importSchedule(){

q("fileInput").click()

}

q("fileInput").onchange=e=>{

let f=e.target.files[0]

if(!f)return

let r=new FileReader()

r.onload=v=>{

try{

let d=JSON.parse(v.target.result)

s=d.schedule||d.periods||d

saveLocal()

render()

alert("Schedule Imported")

}catch{

alert("Invalid JSON")

}

}

r.readAsText(f)

}

/* EXPORT */

function exportSchedule(){

let b=new Blob(

[JSON.stringify(
{schedule:s},
null,
2
)],

{type:"application/json"}

)

let a=document.createElement("a")

a.href=URL.createObjectURL(b)

a.download="schedule.json"

a.click()

}

/* REMOTE */

async function loadRemote(){

try{

let r=await fetch(
CONFIG_URL+"?t="+Date.now(),
{
cache:"no-store"
}
)

let remote=await r.json()

if(remote.schedule?.length){

s=remote.schedule

saveLocal()

render()

}

if(
remote.messageEnabled &&
remote.message &&
Date.now()<remote.messageEnd
){

b.style.display="block"

bt.textContent=remote.message

}else{

b.style.display="none"

}

}catch(err){

console.log(err)

}

}

/* UPDATE */

function update(){

let now=new Date()

now=new Date(
now.getTime()+(getOffset()*1000)
)

let time=formatClock(now)

c.textContent=time

if(mc) mc.textContent=time

d.textContent=
now.toLocaleDateString([],{

weekday:"long",
month:"long",
day:"numeric"

})

let cur=null
let nextP=null

for(let i=0;i<s.length;i++){

let p=s[i]

let st=td(p.start)
let en=td(p.end)

if(now>=st&&now<en)
cur={...p,st,en,i}

if(!nextP&&st>now)
nextP={...p,st}

}

if(last!=-1)
q("i"+last)?.classList.remove("active")

if(cur){

last=cur.i

q("i"+cur.i)?.classList.add("active")

t.textContent=
cur.type=="transition"
?"Between Classes"
:"Current: "+cur.name

let rem=cur.en-now

let remTxt=fm(rem)

cd.textContent=remTxt

if(mcd)
mcd.textContent=remTxt

pb.style.width=
((now-cur.st)/(cur.en-cur.st)*100)
+"%"

n.textContent=
nextP
?"Next: "+nextP.name
:"🏠 Home Time"

if(mn){

mn.textContent=
nextP
?nextP.name
:"Home"

}

}else{

last=-1

if(nextP){

t.textContent="Next Period"

n.textContent=nextP.name

let remTxt=fm(nextP.st-now)

cd.textContent=remTxt

if(mcd)
mcd.textContent=remTxt

pb.style.width="0%"

if(mn)
mn.textContent=nextP.name

}else{

let tm=new Date()

tm.setDate(tm.getDate()+1)

let[a,b]=s[0].start
.split(":")
.map(Number)

tm.setHours(a,b,0,0)

let remTxt=fm(tm-now)

t.textContent="School Finished"

n.textContent="Tomorrow Starts In"

cd.textContent=remTxt

if(mcd)
mcd.textContent=remTxt

pb.style.width="100%"

if(mn)
mn.textContent="Tomorrow"

}

}

}

/* START */

loadLocal()

if(!s.length){

s=[

{
name:"Period 1",
start:"08:40",
end:"09:40",
type:"period"
}

]

}

applyTheme()

render()

loadRemote()

update()

setInterval(update,1000)