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

//Cheese
const cheeseArray = [];
class Cheese{
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 15;
        this.distance = 0;
    }
    update(){
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

function createRandomCheese(){
    const minNumberCheese = 1;
    const maxNumberCheese = 4;
    const howMany = Math.floor(Math.random()  * (maxNumberCheese - minNumberCheese + 1)) + minNumberCheese;
    maxScore = howMany;
    for(let i = 0; i < howMany; ++i){
        cheeseArray.push(new Cheese())
    }
}

function handleCheese(){
    for(let i = 0; i < cheeseArray.length; ++i){
        cheeseArray[i].update();
        cheeseArray[i].draw();
        if(cheeseArray[i].distance < cheeseArray[i].radius + player.radius){
            cheeseArray.splice(i, 1);
            score++;
        }
    }
}

//Walls
const wallsArray = []
class Wall{
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 20;
        this.distance = 0;
    }
    update(){
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw(){
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}


function createRandomWalls(){
    const minNumberWalls = 1;
    const maxNumberWalls = 4;
    const howMany = Math.floor(Math.random()  * (maxNumberWalls - minNumberWalls + 1)) + minNumberWalls;
    for(let i = 0; i < howMany; ++i){
        wallsArray.push(new Wall())
    }
}

function handleWalls(){
    for(let i = 0; i < wallsArray.length; ++i){
        wallsArray[i].update();
        wallsArray[i].draw();
        if(wallsArray[i].distance < wallsArray[i].radius + player.radius){
            let offset = wallsArray[i].radius + player.radius + 5;
            if(player.x < wallsArray[i].x){
                mouse.x = wallsArray[i].x - offset;
            }
            else{
                mouse.x = wallsArray[i].x + offset;
            }
            if(player.y < wallsArray[i].y){
                mouse.y = wallsArray[i].y - offset;
            }
            else{
                mouse.y = wallsArray[i].y + offset;
            }
        }
    }
}

//Animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleCheese();
    handleWalls();
    player.update();
    player.draw();
    ctx.fillText(score + '/' + maxScore, 10, 50);
    requestAnimationFrame(animate);
}
createRandomCheese();
createRandomWalls();
animate();