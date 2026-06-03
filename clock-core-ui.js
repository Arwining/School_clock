const m=q("#menu")
const ap=q("#appearancePanel")

q("#menuBtn").onclick=e=>{
  e.stopPropagation()
  m.classList.toggle("show")
}

m.onclick=e=>e.stopPropagation()

document.onclick=e=>{
  if(!m.contains(e.target))
  m.classList.remove("show")
}

window.toggleAppearancePanel=function(){
  ap.classList.toggle("showAppear")
}

window.toggle24Hour=function(){
  localStorage.setItem(
    "schoolClock24Hour",
    is24Hour()?"0":"1"
  )
  update()
}

window.changeOffset=function(){
  let v=prompt(
    "Offset Seconds",
    localStorage.getItem(
      "schoolClockOffset"
    )||0
  )
  if(v!==null){
    localStorage.setItem(
      "schoolClockOffset",
      Number(v)||0
    )
  }
}

window.editSchedule=function(){
  let old=
  document.getElementById("scheduleEditor")
  if(old)old.remove()

  let wrap=document.createElement("div")
  wrap.id="scheduleEditor"
  wrap.style=`
    position:fixed;
    inset:0;
    background:#0009;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:99999;
    padding:20px;
  `
  let box=document.createElement("div")
  box.style=`
    background:#111;
    padding:20px;
    border-radius:20px;
    width:min(1000px,95vw);
    max-height:90vh;
    overflow:auto;
    color:white;
  `
  box.innerHTML=`
<h2 style="margin-bottom:12px">
Schedule Editor
</h2>

<table style="
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
<br>
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

  const tb=box.querySelector("tbody")
  function row(p={}){

    let tr=
    document.createElement("tr")
    tr.innerHTML=`
<td>
<input value="${p.name||""}">
</td>
<td>
<input type="time" value="${p.start||"08:00"}">
</td>
<td>
<input type="time" value="${p.end||"09:00"}">
</td>
<td>
<select>
<option ${p.type=="period"?"selected":""}>period</option>
<option ${p.type=="transition"?"selected":""}>transition</option>
</select>
</td>
<td>
<button class="del">X</button>
</td>
`
    tb.appendChild(tr)
    tr.querySelector(".del").onclick=()=>tr.remove()
  }
  s.forEach(row)
  box.querySelector("#addRow").onclick=()=>row()
  box.querySelector("#closeSched").onclick=()=>wrap.remove()
  box.querySelector("#saveSched").onclick=()=>{
    let ns=[]
    tb.querySelectorAll("tr").forEach(tr=>{
      let i=tr.querySelectorAll("input,select")
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
    wrap.remove()
  }
}

window.importSchedule=function(){
  q("#fileInput").click()
}

q("#fileInput").onchange=e=>{
  let f=e.target.files[0]
  if(!f)return
  let r=new FileReader()
  r.onload=v=>{
    try{
      let d=JSON.parse(v.target.result)
      s=d.schedule||d.periods||d
      saveLocal()
      render()
      update()
    }catch{
      alert("Invalid JSON")
    }
  }
  r.readAsText(f)
}

window.exportSchedule=function(){
  let b=new Blob([JSON.stringify({schedule:s},null,2)],{type:"application/json"})
  let a=document.createElement("a")
  a.href=URL.createObjectURL(b)
  a.download="schedule.json"
  a.click()
}

window.resetDefaultSchedule=function(){
  localStorage.removeItem("schoolClockSchedule")
  location.reload()
}

// -- Add toggleNotes() function --
function toggleNotes() {
  const modal = document.getElementById('notesModal');
  if (modal.style.display === 'none' || !modal.style.display) {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
}

// Ensure modal is hidden on load
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('notesModal');
  if (modal) modal.style.display = 'none';
});