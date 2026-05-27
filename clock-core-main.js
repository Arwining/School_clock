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
JSON.stringify({
schedule:s
})
)

}

function loadLocal(){

try{

let d=JSON.parse(
localStorage.getItem(LS)
)

if(d?.schedule?.length){

s=d.schedule

}

}catch{}

if(!s.length){

s=[

{
name:"PC",
start:"08:31",
end:"08:46",
type:"period"
},

{
name:"Transition",
start:"08:46",
end:"08:48",
type:"transition"
},

{
name:"Period 1",
start:"08:48",
end:"09:48",
type:"period"
},

{
name:"Transition",
start:"09:48",
end:"09:50",
type:"transition"
},

{
name:"Period 2",
start:"09:50",
end:"10:50",
type:"period"
},

{
name:"Lunch",
start:"10:50",
end:"11:30",
type:"period"
},

{
name:"Transition",
start:"11:30",
end:"11:32",
type:"transition"
},

{
name:"Period 3",
start:"11:32",
end:"12:32",
type:"period"
},

{
name:"Transition",
start:"12:32",
end:"12:34",
type:"transition"
},

{
name:"Period 4",
start:"12:34",
end:"13:34",
type:"period"
},

{
name:"Recess",
start:"13:34",
end:"13:54",
type:"period"
},

{
name:"Transition",
start:"13:54",
end:"13:56",
type:"transition"
},

{
name:"Period 5",
start:"13:56",
end:"14:56",
type:"period"
}

]

saveLocal()

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
q("i"+last)?.classList.remove("active")

if(cur){

last=cur.i

q("i"+cur.i)?.classList.add("active")

t.textContent=
cur.type=="transition"
?"Between Classes"
:"Current: "+cur.name

cd.textContent=
fm(cur.en-now)

pb.style.width=
((now-cur.st)/
(cur.en-cur.st)
*100)+"%"

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

if(prev){

pb.style.width=
Math.min(
100,
((now-prev)/
(nextP.st-prev)
*100)
)+"%"

}else{

pb.style.width="0%"

}

}else{

let tomorrow=new Date()

tomorrow.setDate(
tomorrow.getDate()+1
)

let[a,b]=s[0].start
.split(":")
.map(Number)

tomorrow.setHours(a,b,0,0)

t.textContent=
"School Finished"

n.textContent=
"Tomorrow Starts In"

cd.textContent=
fm(tomorrow-now)

let midnight=new Date()

midnight.setHours(0,0,0,0)

pb.style.width=
Math.min(
100,
((now-midnight)/
(tomorrow-midnight)
*100)
)+"%"

}

}

}

window.render=render
window.update=update
window.saveLocal=saveLocal
window.is24Hour=is24Hour

loadLocal()

render()

update()

setInterval(update,1000)