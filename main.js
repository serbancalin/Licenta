//Canvas setup
const canvas = document.getElementById('main_canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 650;

let gameframe = 0;
let gameOver = false;
ctx.font = '50px Georgia';

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

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 20;   //lower is faster
        this.frame = 0;
        this.spriteHeight = 155;
        this.spriteWidth = 150;


        this.playerRight = new Image();
        this.playerRight.src = "./assets/mouseR.png";
        this.playerLeft = new Image();
        this.playerLeft.src = "./assets/mouseL.png";
        this.playerIdle = new Image();
        this.playerIdle.src = "./assets/mouseIdle.png";

        this.isInvincible = false;
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        this.x -= dx / this.speed;
        this.y -= dy / this.speed;

        if (gameframe % 15 === 0) {
            this.frame++;
            this.frame %= 3;
        }
    }

    showHitbox(){
        ctx.fillStyle = 'grey';
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
            ctx.drawImage(this.playerRight, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth - 10, this.spriteHeight);
        } else if (this.x > mouse.x + this.radius){
            ctx.drawImage(this.playerLeft, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth - 10, this.spriteHeight);
        } else {
            ctx.drawImage(this.playerIdle, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2 - 10, this.spriteWidth, this.spriteHeight);
        }
    }
}

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

class Wall{
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.radius = 20;
        this.distance = 0;
        this.image = new Image()
        this.loadImage();

    }

    loadImage(){
        const which = Math.random();
        if(which <= 0.25){
            this.image.src = "./assets/spilledDrink.png";
            this.xcoordOffset = 60;
            this.ycoordOffset = 25;
            this.sizeOffset = 6;
        } else if (which <= 0.5) {
            this.image.src = "./assets/salt.png";
            this.xcoordOffset = 25;
            this.ycoordOffset = 20;
            this.sizeOffset = 3.75;
        } else if (which <= 0.75){
            this.image.src = "./assets/brokenCup.png";
            this.xcoordOffset = 25;
            this.ycoordOffset = 40;
            this.sizeOffset = 4.5;
        } else {
            this.image.src = "./assets/brokenPlate.png";
            this.xcoordOffset = 30;
            this.ycoordOffset = 20;
            this.sizeOffset = 4.5;
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

class Cats{
    constructor(x, y, player = null, type, xFinish = 0, yFinish = 0, objToProtectRadius = 0) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.type = type;
        this.radius = 30;
        this.speed = 35;   //lower is faster
        this.distance = 0;

        this.frame = 0;
        this.spriteHeight = 0;
        this.spriteWidth = 0;

        this.xStart = x;
        this.yStart = y;
        this.xFinish = xFinish;
        this.yFinish = yFinish;

        this.counter = 0;
        this.oldPlayerX = player.x;
        this.oldPlayerY = player.y;
        this.playerIsIdle = false;
        this.objToProtectRadius = objToProtectRadius;
    }

    patrol(){
        const offset = 5;
        const dx = this.x - this.xFinish;
        const dy = this.y - this.yFinish;
        //console.log(dx, dy);

        if(Math.abs(dx) < offset && Math.abs(dy) < offset){
            const xTmp = this.xFinish   //Swap the x coordinates
            this.xFinish = this.xStart;
            this.xStart = xTmp;

            const yTmp = this.yFinish; //Swap the y coordinates
            this.yFinish = this.yStart;
            this.yStart = yTmp;

        } else {
            this.moveToLocation(dx, dy, this.speed);
        }
    }

    moveToLocation(dx, dy, speed){
        this.x -= dx / speed;
        this.y -= dy / speed;
        //console.log(dx, dy);
    }

    positionBetweenPlayerAndCheese(){
        const offset = 5;

        const xLocation = (this.player.x - this.xFinish) / offset + this.xFinish;
        const yLocation = (this.player.y - this.yFinish) / offset + this.yFinish;
        //console.log(xLocation, yLocation);

        const dx = this.x - xLocation;
        const dy = this.y - yLocation;

        this.moveToLocation(dx, dy, this.speed - 5);
    }

    guardAndChase(dx, dy) {
        //Get into position
        if(this.playerIsIdle === false) {
            this.positionBetweenPlayerAndCheese();
        }

        //Check if player is idle
        const offset = 5;
        const player_dx = this.oldPlayerX - this.player.x;
        const player_dy = this.oldPlayerY - this.player.y;

        if(Math.abs(player_dx) < offset && Math.abs(player_dy) < offset){
            this.counter++;
            //console.log(this.counter);
            if(this.counter >= 15 * offset){    //If player is idle, move towards him
                this.playerIsIdle = true;
                this.moveToLocation(dx, dy, this.speed);
            }
        }else{
            this.counter = 0;
            this.playerIsIdle = false;
        }
        this.oldPlayerX = this.player.x;
        this.oldPlayerY = this.player.y;

        //See if player colected cheese
        const dxPlayerCheese = this.player.x - this.xFinish;
        const dyPlayerCheese = this.player.y - this.yFinish;

        const dPlayerCheese = Math.sqrt(dxPlayerCheese * dxPlayerCheese + dyPlayerCheese * dyPlayerCheese);
        if(dPlayerCheese < this.player.radius + this.objToProtectRadius){
            this.type = 2;
        }
    }

    update(){
        const dx = this.x - this.player.x;
        const dy = this.y - this.player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        switch (this.type){
            case 1: this.patrol(); break;                               //Patrols
            case 2: this.moveToLocation(dx, dy, this.speed); break;     //Chases
            case 3: this.guardAndChase(dx, dy); break;                  //Guards and chases
        }
        if (gameframe % 15 === 0) {
            this.frame++;
            this.frame %= 3;
        }
    }

    showHitbox(){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    draw() {
        this.showHitbox();
    }

}

class Level{
    constructor(current_level, background) {
        this.finished = false;
        this.failed = false;
        this.currentLevel = current_level;
        this.background = new Image();
        this.background.src = background;

        this.score = 0;
        this.maxScore = -1;
        this.scoreAchieved = false;

        this.toWait = -1;
        this.timesUp = false;

        this.cheeseArray = [];
        this.wallsArray = [];
        this.catsArray = [];
        this.initializeCurrentLevel();
    }

    initializeCurrentLevel(){
        switch (this.currentLevel){
            case 1: this.initializeLevel1(); break;
            case 2: this.initializeLevel2(); break;
            case 3: this.initializeLevel3(); break;
            case 4: this.initializeLevel4(); break;
        }
    }

    //Background
    handleBackground() {
        ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    }

    //Score
    handleScore(){
        ctx.fillStyle = 'black';
        ctx.fillText(this.score + '/' + this.maxScore, 10, 50);
        if (this.score === this.maxScore){
            this.scoreAchieved = true;
        }
    }

    wait(seconds){
        if(this.toWait === -1){
            this.toWait = gameframe;
        }
        const time = seconds - (gameframe - this.toWait) / 60;
        if(time <= 0){
            this.toWait = -1;
        }
        return time;
    }

    //Time
    handleTime(howManySeconds){
        const timeLeft = this.wait(howManySeconds);
        ctx.fillStyle = 'black';
        ctx.fillText(timeLeft.toFixed(1).toString(), canvas.width - 100, 50);
        if(timeLeft <= 0){
            this.timesUp = true;
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
            case 3: this.handleLevel3(); break;
            case 4: this.handleLevel4(); break;
        }
        this.handlePlayer();
    }

    rollCredits(){
        this.player.isInvincible = true;
        ctx.fillStyle = 'black';
        ctx.fillText("Congratulations!", canvas.width / 10 * 3, canvas.height / 2);
        const timeLeft = this.wait(3);
        if(timeLeft === 0) {
            this.finished = true;
        }
    }

    run(){
        this.handleCurrentLevel();
    }

    /////////////////////////////////////////        Level 1         ////////////////////////////////////////////////

    initializeLevel1(){
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
        this.player = new Player(mouse.x, mouse.y);
        this.createRandomCats(2, 3, 1);
        this.createRandomCheese(2, 4);
    }

    //Cheese
    createRandomCheese(minNumberCheese, maxNumberCheese){
        const offset = 50;
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

    //Cats
    createRandomCats(minNumberCats, maxNumberCats, type){
        const howMany = Math.floor(Math.random()  * (maxNumberCats - minNumberCats + 1)) + minNumberCats;
        for(let i = 1; i <= howMany; ++i){
            let xStart = Math.random() * canvas.width;
            let yStart = Math.random() * canvas.height;
            let xFinish = Math.random() * canvas.width;
            let yFinish = Math.random() * canvas.height;
            this.catsArray.push(new Cats(xStart, yStart, this.player, type, xFinish, yFinish));
        }
    }

    handleCats(){
        for(let i = 0; i < this.catsArray.length; ++i) {
            this.catsArray[i].update();
            this.catsArray[i].draw();
            if(this.catsArray[i].distance < this.catsArray[i].radius + this.player.radius && this.player.isInvincible === false){
                this.failed = true;
                //console.log("Collision " + this.catsArray[i].type + " " + i + " Distance " + this.catsArray[i].distance);
            }
        }
    }

    handleLevel1(){
        this.handleCheese();
        this.handleCats();
        this.handleScore();
        if(this.scoreAchieved === true){
           this.rollCredits();
        }
    }

    /////////////////////////////////////////        Level 2         ////////////////////////////////////////////////

    initializeLevel2(){
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
        this.player = new Player(mouse.x, mouse.y);
        this.createRandomCheese(2, 4);
        this.createRandomWalls(5, 7);
    }

    createRandomWalls(minNumberWalls, maxNumberWalls){
        const offset = 50;
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
        this.handleScore();
        if(this.scoreAchieved === true){
            this.rollCredits();
        }
    }

    /////////////////////////////////////////        Level 3         ////////////////////////////////////////////////

    initializeLevel3(){
        mouse.x = canvas.width / 5 * 4;
        mouse.y = canvas.height / 5 * 4;
        this.player = new Player(mouse.x, mouse.y);
        this.catsArray.push(new Cats(canvas.width / 5, canvas.height / 5, this.player, 2));
    }

    handleLevel3(){
        this.handleCats();
        if(this.timesUp === false){
            this.handleTime(10);
        } else {
            this.rollCredits();
        }
    }

    /////////////////////////////////////////        Level 4         ////////////////////////////////////////////////

    initializeLevel4(){
        mouse.x = canvas.width / 5 * 4;
        mouse.y = canvas.height / 5;
        this.player = new Player(mouse.x, mouse.y);

        const cheese_x = canvas.width / 6;
        const cheese_y = canvas.height / 6 * 5;
        this.cheeseArray.push(new Cheese(cheese_x, cheese_y, this.player));
        this.catsArray.push(new Cats(canvas.width / 5, canvas.height / 5 * 4, this.player, 3, cheese_x, cheese_y, this.cheeseArray[0].radius));
        this.maxScore = 1;
    }

    handleLevel4(){
        this.handleScore();
        this.handleCats();
        this.handleCheese();
        if(this.scoreAchieved === true){
            if(this.timesUp === false){
                this.handleTime(10);
            } else {
                this.rollCredits();
            }
        }
    }
}

let currentLoaded = new Level(0, "./assets/cheese1.png");
currentLoaded.finished = true;
let checkpoint = 0;

function levelManager() {
    if (currentLoaded.finished === true){
        checkpoint = currentLoaded.currentLevel;
        switch (currentLoaded.currentLevel){
            case 0:
                let level1 = new Level(1, "./assets/kitchen1.jpg");
                currentLoaded = level1;
                break;
            case 1:
                let level2 = new Level(2, "./assets/kitchen2.jpg");
                currentLoaded = level2;
                break;
            case 2:
                let level3 = new Level(3, "./assets/kitchen3.jpg");
                currentLoaded = level3;
                break;
            case 3:
                let level4 = new Level(4, "./assets/kitchen4.jpg");
                currentLoaded = level4;
                break;
            default:
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'steelblue';
                ctx.fillText("YOU WIN", canvas.width / 8 * 3, canvas.height / 2);
                gameOver = true;
                break;
        }
    }
    if (currentLoaded.failed === true) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillText("GAME OVER", canvas.width / 3, canvas.height / 2);
        gameOver = true;
    }
}

//Animation
function animate(){
    gameframe++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    levelManager();
    if(!gameOver) currentLoaded.run();
    requestAnimationFrame(animate);
    if(gameOver && mouse.click){
        gameOver = false;
        currentLoaded.currentLevel = checkpoint;
        currentLoaded.finished = true;
    }
}

animate();
