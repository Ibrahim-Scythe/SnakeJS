const isMobile = window.innerWidth <= 768;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const boardSize = canvas.height;
const tileCount = 20;
const tileSize = boardSize/tileCount;

const pointsDisplay = document.getElementById("points");
let points = 0;

class Snake {
    constructor() {
        this.positions = [
            [boardSize/4, boardSize/2 + tileSize],
            [boardSize/4 + tileSize, boardSize/2 + tileSize]
        ];
    }

    getPos(n) {
        return this.positions[n];
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

    checkCollision() {
        const headPos = this.getHeadPos()
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

    getPos() {
        return this.pos;
    }
}

let vX = 0;
let vY = 0;

let nextvX = 1;
let nextvY = 0;

const pellet = new Pellet();

// Loads font and draws start screen
async function initialScreen() {
    await document.fonts.ready;

    ctx.fillStyle = "white";
    for (let i = 0; i < snake.getLength(); i++) {
        let pos = snake.getPos(i);
        ctx.fillRect(pos[0],pos[1], tileSize, tileSize);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(pellet.pos[0], pellet.pos[1], tileSize, tileSize);

    ctx.font = '48px "Audiowide" ';
    ctx.textAlign = 'center';

    let startText = "Press Space to start"
    if (isMobile) {
        startText = "Double tap to start";
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(startText, boardSize/2, boardSize/2);


    ctx.fillStyle = "white";
    ctx.fillText(startText, boardSize/2, boardSize/2);
}

initialScreen();

let gameOver = false;

const gameLoop = () => {
    if (gameOver) {
        ctx.font = '48px "Audiowide" ';
        ctx.textAlign = 'center';

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText("Game Over", boardSize/2, boardSize/2);


        ctx.fillStyle = "white";
        ctx.fillText("Game Over", boardSize/2, boardSize/2);

        return;
    }
    
    // Collision Logic
    vX = nextvX;
    vY = nextvY;

    const headPos = snake.getHeadPos();
    const pelletPos = pellet.getPos();

    const nextX = headPos[0] + tileSize * vX;
    const nextY = headPos[1] + tileSize * vY;

    const willEat =
        nextX === pelletPos[0] &&
        nextY === pelletPos[1];

    snake.move(tileSize * vX, tileSize * vY, willEat);

    if (willEat) {
        pellet.move();
        points++;
        pointsDisplay.textContent = points;
    }

    // Clear canvas
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = "white";

    for (let i = 0; i < snake.getLength(); i++) {
        let pos = snake.getPos(i);
        ctx.fillRect(pos[0],pos[1], tileSize, tileSize);
    }

    // Draw Pellet
    ctx.fillStyle = "red";
    ctx.fillRect(pellet.pos[0], pellet.pos[1], tileSize, tileSize);

    gameOver = snake.checkCollision();
};

// Pressing the Space key will start/stop the race
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

// Keyboard Controls
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
        case 'arrowup': 
        case 'w':
            if (vY !== 1) {
                nextvX = 0;
                nextvY = -1;
            }
            break;

        case 'arrowdown':
        case 's':
            if (vY !== -1) { 
                nextvX = 0;
                nextvY = 1;
            }
            break;

        case 'arrowleft': 
        case 'a':
            if (vX !== 1) {
                nextvX = -1;
                nextvY = 0;
            }
            break;

        case 'arrowright': 
        case 'd':
            if (vX !== -1) {
                nextvX = 1;
                nextvY = 0;
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