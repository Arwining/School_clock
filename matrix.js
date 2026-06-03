const canvas=
document.getElementById(
"matrixCanvas"
)

const ctx=
canvas.getContext("2d")

function resize(){

canvas.width=
window.innerWidth

canvas.height=
window.innerHeight

}

resize()

window.addEventListener(
"resize",
resize
)

const letters=
"01アイウエオカキクケコ"

const font=16

let cols=
Math.floor(
window.innerWidth/font
)

let drops=
Array(cols).fill(1)

function draw(){

ctx.fillStyle=
"rgba(0,0,0,.08)"

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
)

ctx.fillStyle="#00ff88"

ctx.font=
font+"px monospace"

for(
let i=0;
i<drops.length;
i++
){

let text=
letters[
Math.floor(
Math.random()*
letters.length
)
]

ctx.fillText(
text,
i*font,
drops[i]*font
)

if(
drops[i]*font>
canvas.height &&
Math.random()>.975
){
drops[i]=0
}

drops[i]++

}

requestAnimationFrame(draw)

}

draw()