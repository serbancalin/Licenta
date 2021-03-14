//Canvas setup
const canvas = document.getElementById('main_canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 650;

let gameframe = 0;
let gameOver = false;
ctx.font = '50px Georgia'

//Mouse controls
let canvasPositon = canvas.getBoundingClientRect();
window.addEventListener('resize', function(){
    canvasPositon = canvas.getBoundingClientRect();
})

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
const playerRight = new Image();
playerRight.src = "./assets/mouseR.png";
const playerLeft = new Image();
playerLeft.src = "./assets/mouseL.png";
const playerIdle = new Image();
playerIdle.src = "./assets/mouseIdle.png";

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.frame = 0;
        this.spriteHeight = 155;
        this.spriteWidth = 150;
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
        if (gameframe % 15 === 0) {
            this.frame++;
            this.frame %= 3;
        }
    }

    showHitbox(){
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        //this.showHitbox();

        if (this.x < mouse.x - this.radius) {
            ctx.drawImage(playerRight, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth - 10, this.spriteHeight);
        } else if (this.x > mouse.x + this.radius){
            ctx.drawImage(playerLeft, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth - 10, this.spriteHeight);
        } else {
            ctx.drawImage(playerIdle, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth, this.spriteHeight);
        }
    }
}

//Cheese
class Cheese{
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.radius = 15;
        this.distance = 0;
        this.image = new Image()
        this.image.src = Math.random() > 0.5 ? "./assets/cheese1.png" : "./assets/cheese2.png";
    }
    update(){
        const dx = this.x - this.player.x;
        const dy = this.y - this.player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    showHitbox(){
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    draw(){
        //this.showHitbox();
        ctx.drawImage(this.image, this.x - this.radius - 10, this.y - this.radius - 10, this.radius * 3, this.radius * 3);
    }
}

//Walls
class Wall{
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.radius = 20;
        this.distance = 0;
        this.image = new Image()
        if(Math.random() > 0.5){
            this.image.src = "./assets/spilledDrink.png";
            this.xcoordOffset = 60;
            this.ycoordOffset = 20;
            this.sizeOffset = 6;
        } else {
            this.image.src = "./assets/salt.png";
            this.xcoordOffset = 25;
            this.ycoordOffset = 20;
            this.sizeOffset = 3.75;
        }
    }
    update(){
        const dx = this.x - this.player.x;
        const dy = this.y - this.player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    showHitbox(){
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    draw(){
        //this.showHitbox();
        ctx.drawImage(this.image, this.x - this.radius - this.xcoordOffset, this.y - this.radius - this.ycoordOffset,
            this.radius * this.sizeOffset, this.radius * this.sizeOffset);
    }
}

//Background
const background1 = new Image();
background1.src = "./assets/kitchen1.jpg";
const background2 = new Image();
background2.src = "./assets/kitchen2.jpg";
const background3 = new Image();
background3.src = "./assets/kitchen3.jpg";

//Level
class Level{
    constructor(current_level, background) {
        this.finished = false;
        this.failed = false;
        this.currentLevel = current_level;
        this.background = background;
        this.score = 0;
        this.maxScore = 0;
        this.cheeseArray = [];
        this.wallsArray = []
        this.initializeCurrentLevel();
    }

    initializeCurrentLevel(){
        switch (this.currentLevel){
            case 1: this.initializeLevel1(); break;
            case 2: this.initializeLevel2(); break;
            //case 3: this.initializeLevel3(); break;
            //case 4: this.initializeLevel4(); break;
        }
    }

    //Background
    handleBackground() {
        ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    }

    //Score
    handleScore(){
        ctx.fillText(this.score + '/' + this.maxScore, 10, 50);
        if (this.score === this.maxScore){
            ctx.fillText("Congratulations!", canvas.width / 4, canvas.height / 2);
            if(gameframe % 500 === 0){
                this.finished = true;
            }
        }
    }

    //Player
    handlePlayer(){
        this.player.update();
        this.player.draw();
    }

    handleCurrentLevel(){
        this.handleBackground();
        switch (this.currentLevel){
            case 1: this.handleLevel1(); break;
            case 2: this.handleLevel2(); break;
            //case 3: this.handleLevel3(); break;
            //case 4: this.handleLevel4(); break;
        }
        this.handleScore();
        this.handlePlayer();
    }

    run(){
        this.handleCurrentLevel();
    }

    /////////////////////////////////////////        Level 1         ////////////////////////////////////////////////

    initializeLevel1(){
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
        this.player = new Player(canvas.width / 2, canvas.height / 2);
        this.createRandomCheese();
    }

    //Cheese
    createRandomCheese(){
        const offset = 50;
        const minNumberCheese = 2;
        const maxNumberCheese = 4;
        this.maxScore = Math.floor(Math.random()  * (maxNumberCheese - minNumberCheese + 1)) + minNumberCheese;
        for(let i = 1; i <= this.maxScore; ++i){
            let x = canvas.width / (this.maxScore + 1) * i + (Math.random() - 0.5) * offset;
            let y = (Math.random() * (canvas.height - 50)) + 25;
            this.cheeseArray.push(new Cheese(x, y, this.player));
        }
    }

    handleCheese(){
        for(let i = 0; i < this.cheeseArray.length; ++i){
            this.cheeseArray[i].update();
            this.cheeseArray[i].draw();
            if(this.cheeseArray[i].distance < this.cheeseArray[i].radius + this.player.radius){
                this.cheeseArray.splice(i, 1);
                this.score++;
            }
        }
    }

    handleLevel1(){
        this.handleCheese()
    }

    /////////////////////////////////////////        Level 2         ////////////////////////////////////////////////

    initializeLevel2(){
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
        this.player = new Player(canvas.width / 2, canvas.height / 2);
        this.createRandomCheese();
        this.createRandomWalls();
    }

    createRandomWalls(){
        const offset = 50;
        const minNumberWalls = 5;
        const maxNumberWalls = 10;
        const howMany = Math.floor(Math.random()  * (maxNumberWalls - minNumberWalls + 1)) + minNumberWalls;
        for(let i = 1; i <= howMany; ++i){
            let x = canvas.width / (howMany + 1) * i + (Math.random() - 0.5) * offset;
            let y = (Math.random() * (canvas.height - 50)) + 25;
            this.wallsArray.push(new Wall(x, y, this.player))
        }
    }

    handleWalls(){
        for(let i = 0; i < this.wallsArray.length; ++i){
            this.wallsArray[i].update();
            this.wallsArray[i].draw();
            if(this.wallsArray[i].distance < this.wallsArray[i].radius + this.player.radius){
                let offset = this.wallsArray[i].radius + this.player.radius + 5;
                if(this.player.x < this.wallsArray[i].x){
                    mouse.x = this.wallsArray[i].x - offset;
                }
                else{
                    mouse.x = this.wallsArray[i].x + offset;
                }
                if(this.player.y < this.wallsArray[i].y){
                    mouse.y = this.wallsArray[i].y - offset;
                }
                else{
                    mouse.y = this.wallsArray[i].y + offset;
                }
            }
        }
    }

    handleLevel2(){
        this.handleCheese();
        this.handleWalls();
    }
}

const level1 = new Level(1, background1);
const level2 = new Level(2, background2);

let currentLoaded = level2;

function levelManager() {
    if (currentLoaded.finished === true){
        switch (currentLoaded.currentLevel){
            case 1:
                currentLoaded = level2;
                break;
            default:
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillText("GAME OVER", canvas.width / 10 * 3, canvas.height / 2);
                gameOver = true;
                break;
        }
    }
}

//Animation
function animate(){
    gameframe++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentLoaded.run();
    levelManager();
    if(!gameOver) requestAnimationFrame(animate);
}

animate();
