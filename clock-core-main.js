```javascript
// clock-core-main.js

const clock=document.getElementById("clock")
const dateText=document.getElementById("date")
const next=document.getElementById("next")
const countdown=document.getElementById("countdown")
const progressBar=document.getElementById("progressBar")
const list=document.getElementById("list")

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

function getSchedule(){

try{

return JSON.parse(
localStorage.getItem(
"schoolClockSchedule"
)
)||DEFAULT_SCHEDULE

}catch{

return DEFAULT_SCHEDULE

}

}

function tm(t){

let p=t.split(":")

return(
Number(p[0])*60+
Number(p[1])
)

}

function formatCountdown(sec){

sec=Math.floor(sec)

let h=
Math.floor(sec/3600)

let m=
Math.floor((sec%3600)/60)

let s=
sec%60

return[
h,m,s
]
.map(v=>
String(v).padStart(2,"0")
)
.join(":")

}

function formatTimeDisplay(t){

let is24=
localStorage.getItem(
"schoolClock24Hour"
)==="1"

if(is24)return t

let p=t.split(":")
let h=Number(p[0])
let m=p[1]

let suffix=h>=12?" PM":" AM"

h=h%12

if(h===0)
h=12

return`${h}:${m}${suffix}`

}

function renderSchedule(current){

const s=getSchedule()

list.innerHTML=""

s.forEach(p=>{

let div=
document.createElement("div")

div.className="item"

if(current===p)
div.classList.add("active")

div.innerHTML=`
<div style="
font-weight:800;
margin-bottom:6px;
">
${p.name}
</div>

<div>
${formatTimeDisplay(p.start)}
 -
${formatTimeDisplay(p.end)}
</div>
`

list.appendChild(div)

})

}

function updateClock(){

const now=new Date()

let hrs=now.getHours()
let mins=now.getMinutes()
let secs=now.getSeconds()

let is24=
localStorage.getItem(
"schoolClock24Hour"
)==="1"

/* CLOCK */

let displayHour=hrs
let suffix=""

if(!is24){

suffix=hrs>=12?" PM":" AM"

displayHour=hrs%12

if(displayHour===0)
displayHour=12

}

clock.textContent=
`${String(displayHour).padStart(2,"0")}:${
String(mins).padStart(2,"0")
}:${
String(secs).padStart(2,"0")
}${suffix}`

dateText.textContent=
now.toDateString()

const s=getSchedule()

let current=null
let nextPeriod=null

let nowMin=
hrs*60+mins

let schoolStart=
tm(s[0].start)

let schoolEnd=
tm(
s[s.length-1].end
)

/* =========================
CURRENT PERIOD
========================= */

for(let i=0;i<s.length;i++){

let p=s[i]

let st=tm(p.start)
let et=tm(p.end)

if(nowMin>=st&&nowMin<et){

current=p

nextPeriod=s[i+1]

let remain=
(et*60)-
(mins*60+secs)

countdown.textContent=
formatCountdown(remain)

next.textContent=
p.name

let prog=
(
(nowMin-st)/
(et-st)
)*100

progressBar.style.width=
prog+"%"

break

}

}

/* =========================
BEFORE SCHOOL
========================= */

if(
!current &&
nowMin<schoolStart
){

next.textContent=
"School Starts"

let untilStart=
(
schoolStart-nowMin
)*60-secs

countdown.textContent=
formatCountdown(untilStart)

/* overnight progress */

let overnightLength=
(24*60-schoolEnd)+
schoolStart

let overnightPassed=
(24*60-schoolEnd)+
nowMin

let prog=
(
overnightPassed/
overnightLength
)*100

progressBar.style.width=
Math.max(
0,
Math.min(100,prog)
)+"%"

}

/* =========================
AFTER SCHOOL
========================= */

if(
!current &&
nowMin>=schoolEnd
){

next.textContent=
"School Starts"

let untilStart=
(
(24*60-nowMin)+
schoolStart
)*60-secs

countdown.textContent=
formatCountdown(untilStart)

/* overnight progress */

let overnightLength=
(24*60-schoolEnd)+
schoolStart

let overnightPassed=
nowMin-schoolEnd

let prog=
(
overnightPassed/
overnightLength
)*100

progressBar.style.width=
Math.max(
0,
Math.min(100,prog)
)+"%"

}

/* =========================
BETWEEN PERIODS
========================= */

if(
!current &&
nowMin>=schoolStart &&
nowMin<schoolEnd
){

for(let i=0;i<s.length;i++){

let p=s[i]

let st=tm(p.start)

if(nowMin<st){

nextPeriod=p

let remain=
(st*60)-
(mins*60+secs)

countdown.textContent=
formatCountdown(remain)

next.textContent=
p.name

progressBar.style.width="0%"

break

}

}

}

renderSchedule(current)

}

setInterval(updateClock,1000)

updateClock()
```
