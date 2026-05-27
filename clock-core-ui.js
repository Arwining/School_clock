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

/* TABLE EDITOR */

window.editSchedule=function(){

let old=
document.getElementById(
"scheduleEditor"
)

if(old)old.remove()

let wrap=
document.createElement("div")

wrap.id="scheduleEditor"

wrap.style=`
position:fixed;
inset:0;
background:#0009;
z-index:99999;
display:flex;
align-items:center;
justify-content:center;
padding:20px;
`

let box=
document.createElement("div")

box.style=`
width:min(1000px,95vw);
max-height:90vh;
overflow:auto;
background:#111;
border:1px solid #444;
border-radius:20px;
padding:20px;
display:flex;
flex-direction:column;
gap:10px;
`

box.innerHTML=`

<h2 style="
margin-bottom:10px;
">
Schedule Editor
</h2>

<table
id="schedTable"
style="
width:100%;
border-collapse:collapse;
">
<thead>
<tr>
<th>Name</th>
<th>Start</th>
<th>End</th>
<th>Type</th>
<th></th>
</tr>
</thead>
<tbody></tbody>
</table>

<div style="
display:flex;
gap:10px;
flex-wrap:wrap;
">

<button id="addRow">
Add Period
</button>

<button id="saveSched">
Save
</button>

<button id="closeSched">
Close
</button>

</div>

`

wrap.appendChild(box)

document.body.appendChild(wrap)

const tb=
box.querySelector("tbody")

function row(p={}){

let tr=
document.createElement("tr")

tr.innerHTML=`

<td>
<input value="${
p.name||""
}">
</td>

<td>
<input type="time"
value="${
p.start||"08:00"
}">
</td>

<td>
<input type="time"
value="${
p.end||"09:00"
}">
</td>

<td>
<select>
<option ${
p.type=="period"?
"selected":""
}>period</option>

<option ${
p.type=="transition"?
"selected":""
}>transition</option>
</select>
</td>

<td>
<button class="del">
X
</button>
</td>

`

tb.appendChild(tr)

tr.querySelector(".del")
.onclick=()=>tr.remove()

}

s.forEach(row)

box.querySelector("#addRow")
.onclick=()=>row()

box.querySelector("#closeSched")
.onclick=()=>wrap.remove()

box.querySelector("#saveSched")
.onclick=()=>{

let ns=[]

tb.querySelectorAll("tr")
.forEach(tr=>{

let i=
tr.querySelectorAll(
"input,select"
)

ns.push({

name:i[0].value,
start:i[1].value,
end:i[2].value,
type:i[3].value

})

})

s=ns

saveLocal()

render()
update()

alert("Saved")

wrap.remove()

}

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

/* OTHER */

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