const isMobile = window.innerWidth <= 768;

// Draw Components
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const drawSquare = (pos, size) => {
    ctx.fillRect(pos[0],pos[1], size, size);
}

const drawText = (text) => {
    ctx.font = '48px "Audiowide" ';
    ctx.textAlign = 'center';

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(text, boardSize/2, boardSize/2);

    ctx.fillStyle = "white";
    ctx.fillText(text, boardSize/2, boardSize/2);
}


// Grid components
const boardSize = canvas.height;
const tileCount = 20;
const tileSize = boardSize/tileCount;

// SFX components
const pickupSound = new Audio('sfx/pickup.wav');
const gameOverSound = new Audio('sfx/gameover.wav');

// Points Counter Components
const pointsDisplay = document.getElementById("points");
let points = 0;


class Snake {
    constructor() {
        this.positions = [
            [boardSize/4, boardSize/2 + tileSize],
            [boardSize/4 + tileSize, boardSize/2 + tileSize]
        ];
        this.orientation = "R";
    }

    getAllPos() {
        return this.positions;
    }

    getHeadPos() {
        return this.positions[this.positions.length - 1];
    }

    getLength() {
        return this.positions.length;
    }

    move(x,y, grow = false) {
        const oldPos = this.getHeadPos();

        let newX = oldPos[0] + x;
        if (newX < 0) newX = boardSize-tileSize;
        if (newX >= boardSize) newX = 0;

        let newY = oldPos[1] + y;
        if (newY < 0) newY = boardSize-tileSize;
        if (newY >= boardSize) newY = 0;

        this.positions.push([newX, newY]);

        if (!grow) this.positions.shift();
    }

    draw() {
        ctx.fillStyle = "white";
        for (let i = 0; i < snake.positions.length; i++) {
            drawSquare(this.positions[i], tileSize);
        }

        this.drawEyes();
    }

    drawEyes() {
        const headPos = this.getHeadPos();
        const eyeSize = tileSize/5;

        const top = headPos[1]+tileSize*0.2;
        const bottom = headPos[1]+tileSize*0.6;
        const left = headPos[0]+tileSize*0.2;
        const right = headPos[0]+tileSize*0.6;

        ctx.fillStyle = "black";
        switch (this.orientation) {
            case "U":
                drawSquare([right, top], eyeSize);
                drawSquare([left, top], eyeSize);
                break;
            case "D":
                drawSquare([right, bottom], eyeSize);
                drawSquare([left, bottom], eyeSize);
                break;
            case "L":
                drawSquare([left, top], eyeSize);
                drawSquare([left, bottom], eyeSize);
                break;
            case "R":
                drawSquare([right, top], eyeSize);
                drawSquare([right, bottom], eyeSize);
                break;
        }
    }

    checkCollision() {
        const headPos = this.getHeadPos();
        for (let i = 0; i < this.positions.length - 1; i++) {
            let partPos = this.positions[i];
            if (headPos[0] === partPos[0] && headPos[1] === partPos[1]) {
                console.log("Collided");
                return true;
            }

        }
        return false;
    }
}

// Initialising snake
const snake = new Snake();


// Returns a random number between min and max inclusive
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Pellet {
    constructor() {
        // Spawns at a random position on right half of map
        this.pos = [tileSize*randomNumber(tileCount/2, tileCount - 1), tileSize*randomNumber(0, tileCount - 1)];
    }

    move() {
        this.pos = [tileSize*randomNumber(0, tileCount - 1), tileSize*randomNumber(0, tileCount - 1)];

        // Checks if pellet overlaps with snake body and rerolls if it does
        const snakePositions = snake.getAllPos();

        for (let i = 0; i < snake.getLength(); i++) {
            let partPos = snakePositions[i];

            if (partPos[0] === this.pos[0] && partPos[1] === this.pos[1]) {
                this.move();
                break;
            }
        }
    }

    draw() {
        ctx.fillStyle = "red";
        drawSquare(this.pos, tileSize);
    }

    getPos() {
        return this.pos;
    }
}

// Initialising pellet
const pellet = new Pellet();


let vX = 0;
let vY = 0;

let nextvX = tileSize;
let nextvY = 0;


// Loads font and draws start screen
async function initialScreen() {
    await document.fonts.ready;

    snake.draw();

    pellet.draw();

    let startText = "Press Space to start"
    if (isMobile) {
        startText = "Double tap to start";
    }

    drawText(startText);
}
initialScreen();

let gameOver = false;
const gameLoop = () => {
    if (gameOver) {
        drawText("Game Over");
        gameOverSound.play();
        startAndStop();
        return;
    }
    
    // Collision Logic
    vX = nextvX;
    vY = nextvY;

    const headPos = snake.getHeadPos();
    const pelletPos = pellet.getPos();

    let nextX = headPos[0] + vX;
    if (nextX < 0) nextX = boardSize-tileSize;
    if (nextX >= boardSize) nextX = 0;

    let nextY = headPos[1] + vY;
    if (nextY < 0) nextY = boardSize-tileSize;
    if (nextY >= boardSize) nextY = 0;

    const willEat =
        nextX === pelletPos[0] &&
        nextY === pelletPos[1];

    snake.move(vX, vY, willEat);

    if (willEat) {
        pellet.move();
        points++;
        pointsDisplay.textContent = points;
        pickupSound.play();
    }

    // Clear canvas and redraw
    ctx.clearRect(0,0,canvas.width, canvas.height);
    snake.draw();
    pellet.draw();

    // Check for self collisions
    gameOver = snake.checkCollision();
};

// Starts and pauses game
let intervalID = null;
const startAndStop = () => {
    if (intervalID === null) {
        intervalID = setInterval(gameLoop, 100);
    }
    else {
        clearInterval(intervalID);
        intervalID = null;
    }
}

// Display help Section
const helpSection = document.getElementById("helpSection");
const toggleHelpSection = () => {
    if (helpSection.style.display === '') helpSection.style.display = "block";
    else if (helpSection.style.display === "block") helpSection.style.display = '';
}

const helpBtn = document.getElementById("helpBtn");
helpBtn.addEventListener("click", toggleHelpSection);

const xBtn = document.getElementById("xBtn");
xBtn.addEventListener("click", toggleHelpSection);


// Keyboard Controls
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
        case 'arrowup': 
        case 'w':
            if (vY !== tileSize) {
                nextvX = 0;
                nextvY = -1*tileSize;
                snake.orientation = "U";
            }
            break;

        case 'arrowdown':
        case 's':
            if (vY !== -1*tileSize) { 
                nextvX = 0;
                nextvY = tileSize;
                snake.orientation = "D";
            }
            break;

        case 'arrowleft': 
        case 'a':
            if (vX !== tileSize) {
                nextvX = -1*tileSize;
                nextvY = 0;
                snake.orientation = "L";
            }
            break;

        case 'arrowright': 
        case 'd':
            if (vX !== -1*tileSize) {
                nextvX = tileSize;
                nextvY = 0;
                snake.orientation = "R";
            }
            break;

        case ' ':
        case 'p':
            startAndStop();
            break;

        case 'r':
            window.location.href = "index.html";
            break;
    }
});