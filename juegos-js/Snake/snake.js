const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 15;

const CELL_X = 20;
const CELL_Y = 20;

canvas.width = CELL_SIZE * CELL_X;
canvas.height = CELL_SIZE * CELL_Y;

// Variables de juego
let counter = 0;

// teclas
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

/* VARIABLES DE LA SERPIENTE */
let snakeSize = 2;
let snakeDirection = 0;
let snake = [
    { x: CELL_SIZE * (CELL_X-1)/2, y: CELL_SIZE * CELL_Y/2},
    { x: CELL_SIZE * CELL_X/2, y: CELL_SIZE * CELL_Y/2}
];

/* VARIABLES DE LA COMIDA */
let food = { x: CELL_SIZE * Math.floor(Math.random() * CELL_X), y: CELL_SIZE * Math.floor(Math.random() * CELL_Y) };

function drawFood(){
    ctx.beginPath();
    ctx.rect(food.x, food.y, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawSnake(){
    for(let i = snakeSize-1; i >= 0; i--){
        ctx.beginPath();
        ctx.rect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    }
}

function snakeMovement(){
    if(snakeDirection === -1)
        return;
    if(snakeDirection === 0)
        snake.push({ x: snake[snakeSize-1].x + CELL_SIZE, y: snake[snakeSize-1].y });
    else if(snakeDirection === 180)
        snake.push({ x: snake[snakeSize-1].x - CELL_SIZE, y: snake[snakeSize-1].y });
    else if(snakeDirection === 90)
        snake.push({ x: snake[snakeSize-1].x, y: snake[snakeSize-1].y - CELL_SIZE });
    else if(snakeDirection === 270)
        snake.push({ x: snake[snakeSize-1].x, y: snake[snakeSize-1].y + CELL_SIZE });
    snake.splice(0, 1);
}

function snakeDirectionHandler(){
    if(rightPressed && snakeDirection !== 180){
        snakeDirection = 0;
    } else if(leftPressed && snakeDirection !== 0){
        snakeDirection = 180;
    } else if(upPressed && snakeDirection !== 270){
        snakeDirection = 90;
    } else if(downPressed && snakeDirection !== 90){
        snakeDirection = 270;
    }
}

function collisionDetection(){
    const head = snake[snakeSize-1];
    
    // Colissions with walls
    const LEFT_WALL = head.x <= 0 && snakeDirection === 180;
    const RIGHT_WALL = head.x >= canvas.width - CELL_SIZE && snakeDirection === 0;
    const TOP_WALL = head.y <= 0 && snakeDirection === 90;
    const BOTTOM_WALL = head.y >= canvas.height - CELL_SIZE && snakeDirection === 270;
    if(LEFT_WALL || RIGHT_WALL || TOP_WALL || BOTTOM_WALL){
        snakeDirection = -1;
    }

    // Colissions with food
    if(head.x === food.x && head.y === food.y){
        snake.unshift({ x: snake[0].x, y: snake[0].y })
        snakeSize++;
        food = { x: CELL_SIZE * Math.floor(Math.random() * CELL_X), y: CELL_SIZE * Math.floor(Math.random() * CELL_Y) };
    }

    // self collision
    for(let i = 0; i < snakeSize-1; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            snakeDirection = -1;
        }
    }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents(){
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
}

function keyDownHandler(e){
    const { key } = e;
    if(key === 'Right' || key === 'ArrowRight'){
        rightPressed = true;
    } else if(key === 'Left' || key === 'ArrowLeft'){
        leftPressed = true;
    } else if(key === 'Up' || key === 'ArrowUp'){
        upPressed = true;
    } else if(key === 'Down' || key === 'ArrowDown'){
        downPressed = true;
    }
}

function keyUpHandler(e){
    const { key } = e;
    if(key === 'Right' || key === 'ArrowRight'){
        rightPressed = false;
    } else if(key === 'Left' || key === 'ArrowLeft'){
        leftPressed = false;
    } else if(key === 'Up' || key === 'ArrowUp'){
        upPressed = false;
    } else if(key === 'Down' || key === 'ArrowDown'){
        downPressed = false;
    }
}

let speed = 10;
function draw(){
    clearCanvas();
    // Dibujar elementos
    drawSnake();
    drawFood();

    // Colisiones y movimientos
    snakeMovement();
    snakeDirectionHandler();
    collisionDetection();
    
    // Llamar a la función draw() 60 veces por segundo
    setTimeout(() => {
        window.requestAnimationFrame(draw);
    }, 1000 / speed);
}

draw();
initEvents();