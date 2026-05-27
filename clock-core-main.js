/* =========================
MAIN CLOCK ENGINE
========================= */

window.CONFIG_URL=
"https://arwining.github.io/School_clock/config.json"

window.LS="schoolClockSchedule"
window.H="schoolClock24Hour"
window.O="schoolClockOffset"

window.q=i=>document.getElementById(i)

window.c=q("clock")
window.d=q("date")
window.t=q("title")
window.n=q("next")
window.cd=q("countdown")
window.pb=q("progressBar")
window.l=q("list")

window.broadcast=q("broadcast")
window.broadcastText=q("broadcastText")

window.s=[]

window.last=-1

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

function is24Hour(){

return localStorage.getItem(H)=="1"

}

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

function getOffset(){

return Number(
localStorage.getItem(O)||0
)

}

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

if(!s.length){

s=[
{
name:"PC",
start:"08:31",
end:"08:46",
type:"period"
}
]

}

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

async function loadRemote(){

try{

let r=await fetch(
CONFIG_URL+"?t="+Date.now(),
{
cache:"no-store"
}
)

let cfg=await r.json()

if(cfg.schedule?.length){

s=cfg.schedule

saveLocal()

render()

}

if(
cfg.messageEnabled &&
cfg.message &&
Date.now()<cfg.messageEnd
){

broadcast.style.display="block"

broadcastText.textContent=
cfg.message

}else{

broadcast.style.display="none"

}

}catch(err){

console.log(err)

}

}

function update(){

let now=new Date()

now=new Date(
now.getTime()+
(getOffset()*1000)
)

c.textContent=formatClock(now)

d.textContent=
now.toLocaleDateString([],{
weekday:"long",
month:"long",
day:"numeric"
})

let cur=null
let nextP=null
let prev=null

for(let i=0;i<s.length;i++){

let p=s[i]

let st=td(p.start)
let en=td(p.end)

if(now>=st&&now<en)
cur={...p,st,en,i}

if(en<=now)
prev=en

if(!nextP&&st>now)
nextP={...p,st}

}

if(last!=-1)
q("i"+last)?.classList.remove(
"active"
)

if(cur){

last=cur.i

q("i"+cur.i)?.classList.add(
"active"
)

t.textContent=
cur.type=="transition"
?"Between Classes"
:"Current: "+cur.name

let rem=cur.en-now

cd.textContent=fm(rem)

pb.style.width=
((now-cur.st)/
(cur.en-cur.st)
*100)
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

cd.textContent=
fm(nextP.st-now)

pb.style.width=
prev
?((now-prev)/
(nextP.st-prev)
*100)+"%"
:"0%"

}else{

let tm=new Date()

tm.setDate(
tm.getDate()+1
)

let[a,b]=s[0].start
.split(":")
.map(Number)

tm.setHours(a,b,0,0)

t.textContent=
"School Finished"

n.textContent=
"Tomorrow Starts In"

cd.textContent=
fm(tm-now)

pb.style.width="100%"

}

}

}

window.render=render
window.update=update
window.saveLocal=saveLocal
window.loadRemote=loadRemote
window.is24Hour=is24Hour

loadLocal()
render()
loadRemote()
update()

setInterval(update,1000)
setInterval(loadRemote,60000)