const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const boardSize = canvas.height;
const tileCount = 20;
const tileSize = boardSize/tileCount;

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Snake {
    constructor(x,y) {
        this.positions = [];
        this.positions.push([x,y]);
        this.length = 1;
    }

    getPos(n) {
        return this.positions[n];
    }

    getLength() {
        return this.length;
    }

    move(x,y) {
        const oldPos = this.getPos(this.positions.length-1);

        let newX = oldPos[0] + x;
        if (newX < 0) newX = boardSize-tileSize;
        if (newX >= boardSize) newX = 0;

        let newY = oldPos[1] + y;
        if (newY < 0) newY = boardSize-tileSize;
        if (newY >= boardSize) newY = 0;

        this.positions.push([newX, newY]);

        while (this.positions.length > this.length) {
            this.positions.shift();
        }
    }

    addPart() {
        this.length++;
    }
}

class Pellet {
    constructor() {
        this.pos = [tileSize*randomNumber(0, tileCount - 1), tileSize*randomNumber(0, tileCount - 1)];
    }

    move() {
        this.pos = [tileSize*randomNumber(0, tileCount - 1), tileSize*randomNumber(0, tileCount - 1)];
    }

    getPos() {
        return this.pos;
    }
}

let vX = 1;
let vY = 0;

const snake = new Snake(boardSize/2, boardSize/2)
snake.addPart();
snake.move(tileSize, 0);

const pellet = new Pellet();

const gameLoop = () => {
    // Clear canvas
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Draw and move Snake
    ctx.fillStyle = "white";

    snake.move(tileSize*vX, tileSize*vY);
    
    for (let i = 0; i < snake.getLength(); i++) {
        let pos = snake.getPos(i);
        ctx.fillRect(pos[0],pos[1], tileSize, tileSize);
    }

    // Draw pellet
    const headPos = snake.getPos(snake.getLength()-1);
    const pelletPos = pellet.getPos()
    if (headPos[0] === pelletPos[0] && headPos[1] === pelletPos[1]) {
        pellet.move();
        snake.addPart();
    }

    ctx.fillStyle = "red";
    ctx.fillRect(pellet.pos[0], pellet.pos[1], tileSize, tileSize);
};

document.addEventListener('keydown', function(event) {
    event.preventDefault();
    switch (event.key) {
        case 'ArrowUp': 
            vX = 0;
            vY = -1;
            break;
        case 'ArrowDown': 
            vX = 0;
            vY = 1;
            break;
        case 'ArrowLeft': 
            vX = -1;
            vY = 0;
            break;
        case 'ArrowRight': 
            vX = 1;
            vY = 0;
            break;
    }
});

// Pressing the button or the key p will start/stop the race
const button = document.getElementById("startBtn");
let intervalID = null;

const startAndStop = () => {
    if (intervalID == null) {
        intervalID = setInterval(gameLoop, 100);
        button.textContent = "Stop";
    }
    else {
        clearInterval(intervalID);
        intervalID = null;
        button.textContent = "Start";
    }
}

button.addEventListener("click", startAndStop);
button.addEventListener("keydown", e => {
    if (e.key == 'p') startAndStop();
});