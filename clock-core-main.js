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
}

]

saveLocal()

}

}

function render(){

l.innerHTML=s.map((p,i)=>`

<div class="item">

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

c.textContent=formatClock(now)

d.textContent=
now.toLocaleDateString()

}

window.render=render
window.update=update
window.saveLocal=saveLocal
window.is24Hour=is24Hour

loadLocal()

render()

update()

setInterval(update,1000)