

//select level
let speed = 5;
const levelSelector = document.getElementById('level');
levelSelector.addEventListener('change', (e) => {
    speed = e.target.value;
    init();
});

//select size
var blockSize = 20;
const sizeSelector = document.getElementById('size');
sizeSelector.addEventListener('change', e => {
    blockSize = e.target.value;
    init();
})

//board
var rows;
var cols;
var board;
var context;

//snake head
var snakeX;
var snakeY;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

var gameover = false;

//board
board = document.getElementById("board");
board.height = 600;
board.width = 600;
context = board.getContext("2d"); //used for drawing on the board

//cover
const cover = document.getElementById('cover');
cover.addEventListener('click', (e) => {
    console.log(cover.style.backdropFilter = 'blur(1px)');
    cover.innerHTML = '';
    if(snakeX == blockSize * 5 && snakeY == blockSize * 5) {
        velocityX = 1;
        velocityY = 0;
    }
})

//score
const playerScore = document.getElementById('score');
const playerHighScore = document.getElementById('highScore');
score = 0;
highScore  = localStorage.getItem('highScore');
if(!highScore){
    localStorage.setItem('highScore', 0);
}
playerScore.innerHTML = score;
playerHighScore.innerHTML = highScore;
//other
let gameFrame = 0;

function food() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function init() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    rows = 600 / blockSize;
    cols = 600 / blockSize;
    food();
}

function draw() {
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, blockSize, blockSize); 
    
    context.fillStyle="lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0;  i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

function game(){
    context.clearRect(0, 0, board.width, board.height);
    
    if (gameover) {
        if(score > highScore) {
            localStorage.setItem('highScore', score);
            playerHighScore.innerHTML = score;
        }
        return;
    }
    draw();
    if(gameFrame % speed == 0) {
        update();
    }
    gameFrame++;
    requestAnimationFrame(game);
}


function update() {
    if(snakeX == foodX && snakeY == foodY) {
        score++;
        snakeBody.push([foodX, foodY]);
        playerScore.innerHTML = score;
        if(score > highScore) playerHighScore.innerHTML = score;
        food();
    }
    
    for(let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if(snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    
    //game over condition
    if(snakeX < 0 || snakeX >= 600 || snakeY < 0 || snakeY >= 600) {
        gameover = true;
        alert("Game Over");
    }
    
    for(let i = 0; i < snakeBody.length; i++) {
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameover = true;
            alert("Game Over");
        }
    }
}   

document.addEventListener("keydown", (e) => {
    if(e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
});

function restart() {
    if(snakeX == blockSize * 5 && snakeY == blockSize * 5) return;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    rows = 600 / blockSize;
    cols = 600 / blockSize;
    gameover = false;
    score = 0;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    gameFrame = 0;
    cover.style.backdropFilter = 'blur(5px)';
    cover.innerHTML = 'Click';
    food();
    game();
}

init();
game();