//Canvas setup
const canvas = document.getElementById('main_canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let maxScore = 0;
ctx.font = '50px Georgia'


//Mouse controls
let canvasPositon = canvas.getBoundingClientRect();
console.log(canvasPositon)
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function (event){
    mouse.x = event.x - canvasPositon.left;
    mouse.y = event.y - canvasPositon.top;
    mouse.click = true;
    console.log(mouse.x, mouse.y)
})

canvas.addEventListener('mouseup', function (){
    mouse.click = false;
})
//Player
class Player{
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteHeight = 0;
        this.spriteWidth = 0;
    }

    update(){
        const speed = 20;   //lower is faster
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if(this.x !== mouse.x){
            this.x -= dx / speed;
        }
        if(this.y !== mouse.y){
            this.y -= dy / speed;
        }
    }

    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}
const player = new Player()

//Animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    ctx.fillText(score + '/' + maxScore, 10, 50);
    requestAnimationFrame(animate);
}
animate();