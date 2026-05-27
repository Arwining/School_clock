window.addEventListener("load",()=>{

const canvas=document.getElementById("matrixCanvas")

if(!canvas)return

const ctx=canvas.getContext("2d")

function resize(){

canvas.width=canvas.offsetWidth
canvas.height=canvas.offsetHeight

}

resize()

window.addEventListener("resize",resize)

const chars="01ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const size=16

let drops=[]

function resetDrops(){

drops=[]

for(let i=0;i<canvas.width/size;i++){

drops[i]=1

}

}

resetDrops()

function draw(){

ctx.fillStyle="rgba(0,0,0,.08)"

ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#00ff66"

ctx.font=size+"px monospace"

for(let i=0;i<drops.length;i++){

const text=
chars[Math.floor(Math.random()*chars.length)]

ctx.fillText(
text,
i*size,
drops[i]*size
)

if(
drops[i]*size>canvas.height &&
Math.random()>.975
){
drops[i]=0
}

drops[i]++

}

requestAnimationFrame(draw)

}

draw()

})