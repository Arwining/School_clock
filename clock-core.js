const VERSION_URL=
"https://arwining.github.io/School_clock/version.json"

const CONFIG_URL=
"https://arwining.github.io/School_clock/config.json"

const LS="schoolClockLocal"
const H="schoolClock24Hour"

const q=i=>document.getElementById(i)

const c=q("clock")
const mc=q("miniClock")
const t=q("title")
const n=q("next")
const cd=q("countdown")
const pb=q("progressBar")
const l=q("list")
const m=q("menu")
const b=q("broadcast")

let s=[]
let last=-1
let currentVersion="2"
let localOverride=false

q("menuBtn").onclick=x=>{
x.stopPropagation()
m.classList.toggle("show")
}

document.onclick=()=>{
m.classList.remove("show")
}

function toggleTheme(){
document.body.classList.toggle("light")
}

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

function formatClock(d){

return d.toLocaleTimeString([],{
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

function saveLocal(){

localStorage.setItem(
LS,
JSON.stringify(s)
)

}

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

function openEditor(){

let txt=prompt(
"Paste schedule JSON",
JSON.stringify(s,null,2)
)

if(!txt)return

try{

s=JSON.parse(txt)

localOverride=true

saveLocal()

render()

alert("Saved")

}catch{

alert("Invalid JSON")

}

}

function useRemoteSchedule(){

localOverride=false

loadRemote()

alert("Remote schedule enabled")

}

async function checkVersion(){

try{

let r=await fetch(
VERSION_URL+"?t="+Date.now()
)

let v=await r.json()

if(v.version!=currentVersion){

currentVersion=v.version

location.reload()

}

}catch(err){

console.log(err)

}

}

async function loadRemote(){

try{

let r=await fetch(
CONFIG_URL+"?t="+Date.now()
)

let remote=await r.json()

if(
remote.forceSchedule &&
remote.schedule?.length &&
!localOverride
){

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
b.textContent=remote.message

}else{

b.style.display="none"

}

if(remote.forceTheme){

if(remote.forceTheme=="light")
document.body.classList.add("light")
else if(remote.forceTheme=="dark")
document.body.classList.remove("light")

}

if(remote.background){

document.body.style.background=
`linear-gradient(#0007,#0007),
url(${remote.background}) center/cover fixed`

}

}catch(err){

console.log(err)

}

}

function loadLocal(){

try{

let d=JSON.parse(localStorage.getItem(LS))

if(d?.length){

s=d

render()

}

}catch{}

}

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

s=d.periods||d.schedule||d

localOverride=true

saveLocal()

render()

alert("Imported")

}catch{

alert("Invalid JSON")

}

}

r.readAsText(f)

}

function exportSchedule(){

let b=new Blob(
[JSON.stringify({schedule:s},null,2)],
{type:"application/json"}
)

let a=document.createElement("a")

a.href=URL.createObjectURL(b)

a.download="schedule.json"

a.click()

}

function update(){

let now=new Date()

let time=formatClock(now)

c.textContent=time
mc.textContent=time

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

cd.textContent=fm(rem)

pb.style.width=
((now-cur.st)/(cur.en-cur.st)*100)
+"%"

n.textContent=
nextP
?"Next: "+nextP.name
:"🏠 Home Time"

}else{

last=-1

if(nextP){

t.textContent="Next Period"

n.textContent=nextP.name

cd.textContent=fm(nextP.st-now)

pb.style.width="0%"

}else{

let tm=new Date()

tm.setDate(tm.getDate()+1)

let[a,b]=s[0].start
.split(":")
.map(Number)

tm.setHours(a,b,0,0)

t.textContent="School Finished"

n.textContent="Tomorrow Starts In"

cd.textContent=fm(tm-now)

pb.style.width="100%"

}

}

}

loadLocal()
loadRemote()

setInterval(loadRemote,5000)
setInterval(checkVersion,10000)

update()

setInterval(update,1000)