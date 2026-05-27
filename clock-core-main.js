const q=e=>document.querySelector(e)

const c=q("#clock")
const d=q("#date")
const n=q("#next")
const cd=q("#countdown")
const l=q("#list")
const pb=q("#progressBar")
const t=q("#title")

let s=
JSON.parse(
localStorage.getItem(
"schoolClockSchedule"
)
||"null"
)
||
[
{
name:"PC",
start:"08:31",
end:"08:46",
type:"period"
}
]

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

function is24Hour(){

return localStorage.getItem(
"schoolClock24Hour"
)=="1"

}

function formatTime(date){

let h=date.getHours()
let m=date.getMinutes()
let sec=date.getSeconds()

if(is24Hour()){

return
String(h).padStart(2,"0")
+":"+
String(m).padStart(2,"0")
+":"+
String(sec).padStart(2,"0")

}

let ampm=
h>=12?"PM":"AM"

h=h%12||12

return
h+":"
+String(m).padStart(2,"0")
+":"
+String(sec).padStart(2,"0")
+" "+ampm

}

function render(){

l.innerHTML=""

s.forEach(p=>{

let div=
document.createElement("div")

div.className="item"

div.innerHTML=
`
<div>${p.name}</div>
<div>${p.start} - ${p.end}</div>
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

if(cur){

t.textContent="Current"

n.textContent=cur.name

let left=
tm(cur.end)-mins

cd.textContent=
left+" min"

let total=
tm(cur.end)-tm(cur.start)

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
tm(next.start)-mins

cd.textContent=
left+" min"

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
tm(s[0].start)+1440

let left=
first-mins

cd.textContent=
left+" min"

pb.style.width="100%"

}

}

}

render()
update()

setInterval(update,1000)