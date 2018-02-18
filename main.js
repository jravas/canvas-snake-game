// set up canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Get the width and height from the canvas element
var width = canvas.width;
var height = canvas.height;

// creating 10by10px blocks on canvas
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// score variable set to 0
var score = 0;

// draw border around canvas
var drawBorder = function () {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// draw score on canvas
var drawScore = function () {
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + score, blockSize, blockSize);
};

// drawing game over text
var gameOver = function () {
    clearInterval(intervalId);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', width / 2, height / 2);
};

// Draw a circle function
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

// invisible grid block
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// draw square method
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

// draw apple method
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var CenterY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, CenterY, blockSize / 2, true);
};

// method for blocks location compare
Block.prototype.equal = function (otherBlock) {
    return this.col == otherBlock.col && this.row === otherBlock.row;
};
// snake
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
};

// drawing the snake
Snake.prototype.draw = function () {
    for( var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare('Blue');
    }
};

// Snake moving method
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;
    
    this.direction = this.nextDirection;

    if (this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row -1);
    }
    // stop the game if new head collides with other elements
    if (this.checkCollision(newHead)){
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

// checking for collisions each time we set new loaction for the snake's head
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);
    // checking has snake collided with a wall
    var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    // by default snake hasn't collided with itself
    var selfCollision = false;
    // checking has snake collided with self
    for (var i = 0; i < this.segments.length; i++){
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

// setDirection method checks whether the player is trying to make an illegal turn
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection === 'down'){
        return;
    } else if (this.direction === 'right' && newDirection === 'left'){
        return;
    } else if (this.direction === 'down' && newDirection === 'up'){
        return;
    } else if (this.direction === 'left' && newDirection === 'right'){
        return;
    }
    // set direction to new direction if isn't illegal
    this.nextDirection = newDirection;
};

// apple constructor creates a new block object in position 10,10
var Apple = function () {
    this.position = new Block(10, 10);
};

// drawing the apple on canvas
Apple.prototype.draw = function () {
    this.position.drawCircle('LimeGreen');
};

// moves the apple to a random new position within the game area
Apple.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks -2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks -2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

// create apple and snake objects
var snake = new Snake();
var apple = new Apple();

// animating draw functions every 100 ms
var intervalId = setInterval(function (){
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    //
    // var apple = new Apple();
    // apple.move();
    // apple.draw();
}, 100);

// key codes for directions
var directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

// adding event handler on keydown
var body = document.getElementById('body');
body.onkeydown = function (event){
    var newDirection = directions[event.keyCode];
    // check if key code matches codes in directions
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
};
