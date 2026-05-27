const m=q("menu")
const ap=q("appearancePanel")

q("menuBtn").onclick=e=>{

e.stopPropagation()

m.classList.toggle("show")

}

m.onclick=e=>{

e.stopPropagation()

}

document.onclick=e=>{

if(
!m.contains(e.target)
){

m.classList.remove("show")

}

}

window.toggleAppearancePanel=function(){

ap.classList.toggle(
"showAppear"
)

}

/* RESET */

window.resetDefaultSchedule=function(){

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

saveLocal()
render()
update()

}

/* SCHEDULE EDITOR */

window.editSchedule=function(){

let txt=prompt(
"Paste Schedule JSON",
JSON.stringify(
{s},
null,
2
)
)

if(!txt)return

try{

let d=JSON.parse(txt)

s=
d.schedule||
d.periods||
d.s||
d

saveLocal()

render()
update()

alert("Saved")

}catch{

alert("Invalid JSON")

}

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

update()

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

update()

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

a.href=
URL.createObjectURL(b)

a.download="schedule.json"

a.click()

}