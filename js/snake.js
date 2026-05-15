const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";

const boardSize = canvas.height;
const tileCount = 20;
const tileSize = boardSize/tileCount;

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class SnakeHead {
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.nextPart = null;
    }

    getX() {
        return this.posX;
    }

    getY() {
        return this.posY;
    }

    move(x, y) {
        this.posX += x;
        if (this.posX < 0) this.posX = boardSize - tileSize;
        if (this.posX >= boardSize) this.posX = 0;

        this.posY += y;
        if (this.posY < 0) this.posY = boardSize - tileSize;
        if (this.posY >= boardSize) this.posY = 0;
    }

    addPart() {
        if (this.nextPart === null) {
            this.nextPart = new SnakePart(this.getX(), this.getY(), this)
        }
        else this.nextPart.addPart();
    }
}

class SnakePart extends SnakeHead {
    constructor(x, y, prevPart) {
        super(x, y);
        this.prevPart = prevPart;
        this.nextX = this.prevPart.getX();
        this.nextY = this.prevPart.getY();
    }

    updatePos() {
        this.posX = this.nextX;
        this.posY = this.nextY;
        this.nextX = this.prevPart.getX();
        this.nextY = this.prevPart.getY();
    }
}

class Pellet {
    constructor() {
        this.posX = tileSize*randomNumber(0, tileCount - 1);
        this.posY = tileSize*randomNumber(0, tileCount - 1);
    }

    move() {
        this.posX = tileSize*randomNumber(0, tileCount - 1);
        this.posY = tileSize*randomNumber(0, tileCount - 1);
    }
}

let vX = 0;
let vY = 0;

const snake = new SnakeHead(boardSize/2, boardSize/2)
snake.addPart();
snake.move(tileSize, 0);

const pellet = new Pellet();

const gameLoop = () => {
    // Clear canvas
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Draw and move Snake
    ctx.fillStyle = "white";

    snake.move(tileSize*vX, tileSize*vY);
    ctx.fillRect(snake.getX(), snake.getY(), tileSize, tileSize);

    let part = snake.nextPart;
    while (part != null) {
        part.updatePos();
        ctx.fillRect(part.getX(), part.getY(), tileSize, tileSize);
        part = part.nextPart;
    }

    // Draw pellet
    ctx.fillStyle = "red";
    ctx.fillRect(pellet.posX, pellet.posY, tileSize, tileSize);
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
        case 'p':
            vX = 0;
            vY = 0;
            break;
    }
});

setInterval(gameLoop, 100);