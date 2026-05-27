const matrixCanvas=
document.getElementById(
"matrixCanvas"
)

const ctx=
matrixCanvas.getContext("2d")

function resizeMatrix(){

matrixCanvas.width=
window.innerWidth

matrixCanvas.height=
window.innerHeight

}

window.addEventListener(
"resize",
resizeMatrix
)

resizeMatrix()

const letters=
"ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*"

const fontSize=16

let columns=
matrixCanvas.width/fontSize

const drops=[]

for(let i=0;i<columns;i++){

drops[i]=1

}

function drawMatrix(){

ctx.fillStyle=
"rgba(0,0,0,0.08)"

ctx.fillRect(
0,
0,
matrixCanvas.width,
matrixCanvas.height
)

ctx.fillStyle="#00ff66"

ctx.font=
fontSize+"px monospace"

for(let i=0;i<drops.length;i++){

const text=
letters[
Math.floor(
Math.random()*letters.length
)
]

ctx.fillText(
text,
i*fontSize,
drops[i]*fontSize
)

if(
drops[i]*fontSize>
matrixCanvas.height &&
Math.random()>0.975
){

drops[i]=0

}

drops[i]++

}

requestAnimationFrame(
drawMatrix
)

}

drawMatrix()