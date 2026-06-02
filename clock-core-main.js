const q=e=>document.querySelector(e)

const c=q("#clock")
const d=q("#date")
const n=q("#next")
const cd=q("#countdown")
const l=q("#list")
const pb=q("#progressBar")
const t=q("#title")

const DEFAULT_SCHEDULE=[
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
name:"First Break",
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

let s

try{

s=JSON.parse(
localStorage.getItem(
"schoolClockSchedule"
)
)

if(!Array.isArray(s))
s=DEFAULT_SCHEDULE

}catch{

s=DEFAULT_SCHEDULE

}

function saveLocal(){

localStorage.setItem(
"schoolClockSchedule",
JSON.stringify(s)
)

}

function tm(v){

let[a,b]=v.split(":").map(Number)

return a*60+b

}

function formatCountdown(sec){

let h=Math.floor(sec/3600)
let m=Math.floor((sec%3600)/60)
let s2=sec%60

return (
String(h).padStart(2,"0")
+":"
+String(m).padStart(2,"0")
+":"
+String(s2).padStart(2,"0")
)

}

function is24Hour(){

return localStorage.getItem(
"schoolClock24Hour"
)=="1"

}

/* NEW: schedule display formatter */

function displayScheduleTime(time){

let [h,m]=time.split(":").map(Number)

if(is24Hour()){

return (
String(h).padStart(2,"0")
+":"
+String(m).padStart(2,"0")
)

}

let ampm=h>=12?"PM":"AM"

h=h%12||12

return (
h
+":"
+String(m).padStart(2,"0")
+" "
+ampm
)

}

function formatTime(date){

let h=date.getHours()
let m=date.getMinutes()
let sec=date.getSeconds()

if(is24Hour()){

return (
String(h).padStart(2,"0")
+":"
+String(m).padStart(2,"0")
+":"
+String(sec).padStart(2,"0")
)

}

let ampm=h>=12?"PM":"AM"

h=h%12||12

return (
h
+":"
+String(m).padStart(2,"0")
+":"
+String(sec).padStart(2,"0")
+" "
+ampm
)

}

function render(currentName){

l.innerHTML=""

s.forEach(p=>{

let div=
document.createElement("div")

div.className=
"item"+
(
p.name===currentName
?" active"
:""
)

div.innerHTML=
`
<div>${p.name}</div>
<div>${displayScheduleTime(p.start)} - ${displayScheduleTime(p.end)}</div>
`

l.appendChild(div)

})

}

function update(){

let off=
Number(
localStorage.getItem(
"schoolClockOffset"
)||0
)*1000

let now=
new Date(Date.now()+off)

c.textContent=
formatTime(now)

d.textContent=
now.toDateString()

let mins=
now.getHours()*60+
now.getMinutes()

let secs=
now.getSeconds()

let cur=null
let next=null

for(let p of s){

let st=tm(p.start)
let en=tm(p.end)

if(mins>=st&&mins<en)
cur=p

if(st>mins&&!next)
next=p

}

render(
cur?.name
)

if(cur){

t.textContent="Current"

n.textContent=cur.name

let left=
(
tm(cur.end)*60
)-
(
mins*60+secs
)

cd.textContent=
formatCountdown(left)

let total=
(tm(cur.end)-tm(cur.start))*60

let prog=
(1-left/total)*100

pb.style.width=
Math.max(
0,
Math.min(100,prog)
)+"%"

}else{

t.textContent="Next"

if(next){

n.textContent=
next.name

let left=
(
tm(next.start)*60
)-
(
mins*60+secs
)

cd.textContent=
formatCountdown(left)

let first=
tm(s[0].start)

let prog=
(mins/first)*100

pb.style.width=
Math.max(
0,
Math.min(100,prog)
)+"%"

}else{

n.textContent=
"School Finished"

let first=
(tm(s[0].start)+1440)*60

let left=
first-
(mins*60+secs)

cd.textContent=
formatCountdown(left)

pb.style.width="100%"

}

}

}

update()

setInterval(update,1000)