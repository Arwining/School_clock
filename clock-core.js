const CONFIG_URL=
"https://arwining.github.io/School_clock/config.json"

const LS="schoolClockLocal"
const H="schoolClock24Hour"

const q=i=>document.getElementById(i)

const c=q("clock")
const mc=q("miniClock")
const mn=q("miniNext")
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
let localOverride=false

/* MENU */

q("menuBtn").onclick=e=>{

e.stopPropagation()

m.classList.toggle("show")

}

m.onclick=e=>e.stopPropagation()

document.onclick=()=>{

m.classList.remove("show")

}

/* THEME */

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

localOverride=true

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

function useRemoteSchedule(){

localOverride=false

loadRemote()

alert("Remote Schedule Enabled")

}

/* EDITOR */

function openEditor(){

m.classList.remove("show")

let bg=document.createElement("div")

bg.style=`

position:fixed;
inset:0;
background:#0009;
display:flex;
align-items:center;
justify-content:center;
z-index:99999;
backdrop-filter:blur(10px)

`

let box=document.createElement("div")

box.style=`

width:min(1100px,96vw);
max-height:92vh;
overflow:auto;
background:#0f172a;
border-radius:28px;
padding:24px;
border:1px solid #ffffff22;
color:white

`

function draw(){

box.innerHTML=`

<h1 style="
margin-bottom:20px;
font-size:2rem;
">
Customize Schedule
</h1>

<div id="rows"></div>

<div style="
display:flex;
flex-wrap:wrap;
gap:10px;
margin-top:20px;
">

<button id="addBtn">
+ Add Period
</button>

<button id="saveBtn">
Save Schedule
</button>

<button id="remoteBtn">
Use Remote Schedule
</button>

<button id="importBtn">
Import Schedule
</button>

<button id="exportBtn">
Export Schedule
</button>

<button id="closeBtn">
Close
</button>

</div>

<style>

.editWrap{
display:flex;
flex-direction:column;
gap:10px
}

.editRow{
display:grid;
grid-template-columns:
1fr
130px
130px
150px
90px;
gap:10px
}

.editRow input,
.editRow select{

padding:14px;
border:none;
border-radius:14px;
background:#ffffff12;
color:white

}

.editRow button{

border:none;
border-radius:14px;
background:#ff6767;
color:white;
font-weight:700;
cursor:pointer

}

#addBtn,
#saveBtn,
#remoteBtn,
#importBtn,
#exportBtn,
#closeBtn{

padding:14px 18px;
border:none;
border-radius:14px;
cursor:pointer;
font-weight:700;
background:#7cffb2;
color:black

}

@media(max-width:900px){

.editRow{
grid-template-columns:1fr
}

}

</style>

`

const rows=box.querySelector("#rows")

rows.className="editWrap"

rows.innerHTML=s.map((p,i)=>`

<div class="editRow">

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

rows.querySelectorAll("input,select")
.forEach(el=>{

el.oninput=()=>{

let i=Number(el.dataset.i)
let k=el.dataset.k

s[i][k]=el.value

}

})

rows.querySelectorAll("[data-del]")
.forEach(btn=>{

btn.onclick=()=>{

s.splice(Number(btn.dataset.del),1)

draw()

}

})

box.querySelector("#addBtn").onclick=()=>{

s.push({

name:"New Period",
start:"08:00",
end:"09:00",
type:"period"

})

draw()

}

box.querySelector("#saveBtn").onclick=()=>{

localOverride=true

saveLocal()

render()

alert("Schedule Saved")

}

box.querySelector("#remoteBtn").onclick=()=>{

localOverride=false

loadRemote()

render()

alert("Remote Schedule Enabled")

}

box.querySelector("#closeBtn").onclick=()=>{

bg.remove()

}

box.querySelector("#importBtn").onclick=()=>{

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

draw()

alert("Imported")

}catch{

alert("Invalid JSON")

}

}

r.readAsText(f)

}

inp.click()

}

box.querySelector("#exportBtn").onclick=()=>{

exportSchedule()

}

}

draw()

bg.appendChild(box)

document.body.appendChild(bg)

}

/* REMOTE LOAD */

async function loadRemote(){

try{

let r=await fetch(
CONFIG_URL+"?t="+Date.now()
)

let remote=await r.json()

if(
remote.forceSchedule &&
remote.schedule &&
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

bt.textContent=remote.message

}else{

b.style.display="none"

}

if(remote.forceTheme){

if(remote.forceTheme=="light")
document.body.classList.add("light")

if(remote.forceTheme=="dark")
document.body.classList.remove("light")

}

if(remote.background){

document.body.style.background=
`linear-gradient(#0008,#0008),
url(${remote.background})
center/cover fixed`

}

}catch(err){

console.log(err)

}

}

/* UPDATE */

function update(){

let now=new Date()

let time=formatClock(now)

c.textContent=time

if(mc) mc.textContent=time

if(d){

d.textContent=
now.toLocaleDateString([],{

weekday:"long",
month:"long",
day:"numeric"

})

}

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

cd.textContent=fm(nextP.st-now)

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

t.textContent="School Finished"

n.textContent="Tomorrow Starts In"

cd.textContent=fm(tm-now)

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

render()

loadRemote()

update()

setInterval(update,1000)
setInterval(loadRemote,10000)