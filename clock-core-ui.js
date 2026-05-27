const m=q("menu")

q("menuBtn").onclick=e=>{

e.stopPropagation()

m.classList.toggle("show")

}

document.onclick=()=>{

m.classList.remove("show")

}

window.toggleAppearancePanel=function(){

const p=q("appearancePanel")

p.style.display=
p.style.display=="flex"
?"none"
:"flex"

}

window.toggle24Hour=function(){

localStorage.setItem(
"schoolClock24Hour",
is24Hour()?"0":"1"
)

render()
update()

}

window.changeOffset=function(){

let current=
localStorage.getItem(
"schoolClockOffset"
)||0

let v=prompt(
"Offset Seconds",
current
)

if(v===null)return

localStorage.setItem(
"schoolClockOffset",
Number(v)||0
)

}

window.importSchedule=function(){

q("fileInput").click()

}

q("fileInput").onchange=e=>{

let f=e.target.files[0]

if(!f)return

let r=new FileReader()

r.onload=v=>{

try{

let d=JSON.parse(v.target.result)

s=
d.schedule||
d.periods||
d

saveLocal()

render()

alert("Imported")

}catch{

alert("Invalid JSON")

}

}

r.readAsText(f)

}

window.exportSchedule=function(){

let b=new Blob(
[
JSON.stringify(
{schedule:s},
null,
2
)
],
{
type:"application/json"
}
)

let a=document.createElement("a")

a.href=URL.createObjectURL(b)

a.download="schedule.json"

a.click()

}