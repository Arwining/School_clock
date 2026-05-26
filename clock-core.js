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

let bg=document.createElement("div")

bg.style=`
position:fixed;
inset:0;
background:#0008;
display:flex;
align-items:center;
justify-content:center;
z-index:99999;
backdrop-filter:blur(8px)
`

let box=document.createElement("div")

box.style=`
width:min(1000px,95vw);
max-height:90vh;
overflow:auto;
background:#0f172a;
border:1px solid #ffffff22;
border-radius:28px;
padding:24px;
color:white;
font-family:Arial,sans-serif
`

function renderTable(){

box.innerHTML=`

<h1 style="
margin-bottom:20px;
font-size:2rem;
">
Customize Schedule
</h1>

<div id="table"></div>

<div style="
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:20px;
">

<button id="addBtn">+ Add Period</button>

<button id="importBtn">
Import Schedule
</button>

<button id="exportBtn">
Export Schedule
</button>

<button id="saveBtn">
Save Schedule
</button>

<button id="remoteBtn">
Use Remote Schedule
</button>

<button id="closeBtn">
Close
</button>

</div>

<style>

.editorTable{
display:flex;
flex-direction:column;
gap:8px
}

.editorRow{
display:grid;
grid-template-columns:
1fr
120px
120px
140px
80px;
gap:10px
}

.editorRow input,
.editorRow select{
padding:12px;
border:none;
border-radius:12px;
background:#ffffff12;
color:white
}

.editorRow button{
border:none;
border-radius:12px;
background:#ff5c5c;
color:white;
font-weight:700;
cursor:pointer
}

#addBtn,
#importBtn,
#exportBtn,
#saveBtn,
#closeBtn,
#remoteBtn{
padding:14px 18px;
border:none;
border-radius:14px;
cursor:pointer;
font-weight:700;
background:#7cffb2;
color:black
}

@media(max-width:850px){

.editorRow{
grid-template-columns:1fr
}

}

</style>
`

let table=
box.querySelector("#table")

table.className="editorTable"

table.innerHTML=s.map((p,i)=>`

<div class="editorRow">

<input
value="${p.name}"
data-i="${i}"
data-k="name">

<input
type="time"
value="${p.start}"
data-i="${i}"
data-k="start">

<input
type="time"
value="${p.end}"
data-i="${i}"
data-k="end">

<select
data-i="${i}"
data-k="type">

<option
value="period"
${p.type=="period"?"selected":""}>
Period
</option>

<option
value="transition"
${p.type=="transition"?"selected":""}>
Transition
</option>

</select>

<button data-del="${i}">
Delete
</button>

</div>

`).join("")

table.querySelectorAll("input,select")
.forEach(el=>{

el.oninput=()=>{

let i=el.dataset.i
let k=el.dataset.k

s[i][k]=el.value

}

})

table.querySelectorAll("[data-del]")
.forEach(btn=>{

btn.onclick=()=>{

s.splice(btn.dataset.del,1)

renderTable()

}

})

document.getElementById("addBtn")
.onclick=()=>{

s.push({

name:"New Period",
start:"08:00",
end:"09:00",
type:"period"

})

renderTable()

}

document.getElementById("saveBtn")
.onclick=()=>{

localOverride=true

saveLocal()

render()

alert("Schedule Saved")

}

document.getElementById("remoteBtn")
.onclick=()=>{

localOverride=false

loadRemote()

render()

alert("Remote Schedule Enabled")

}

document.getElementById("closeBtn")
.onclick=()=>{

bg.remove()

}

document.getElementById("exportBtn")
.onclick=()=>{

let b=new Blob(
[JSON.stringify({schedule:s},null,2)],
{type:"application/json"}
)

let a=document.createElement("a")

a.href=URL.createObjectURL(b)

a.download="schedule.json"

a.click()

}

document.getElementById("importBtn")
.onclick=()=>{

let inp=document.createElement("input")

inp.type="file"

inp.accept=".json"

inp.onchange=e=>{

let f=e.target.files[0]

if(!f)return

let r=new FileReader()

r.onload=v=>{

try{

let d=JSON.parse(v.target.result)

s=d.schedule||d.periods||d

localOverride=true

saveLocal()

render()

renderTable()

alert("Imported")

}catch{

alert("Invalid JSON")

}

}

r.readAsText(f)

}

inp.click()

}

}

renderTable()

bg.appendChild(box)

document.body.appendChild(bg)

}

function useRemoteSchedule(){

localOverride=false

loadRemote()

alert("Remote Schedule Enabled")

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