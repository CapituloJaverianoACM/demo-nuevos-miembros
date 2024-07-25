// 

const $sprites = document.querySelector('#sprites');
const $bricks = document.querySelector('#bricks');

canvas.width = 448;
canvas.height = 600;

// Variables de juego
let counter = 0;

/* VARIABLES DE LA PELOTA */
const ballRadius = 4;
// posicion
let ballX = canvas.width / 2 - ballRadius;
let ballY = canvas.height - 50;
// velocidad
let ballSpeedX = 2;
let ballSpeedY = -2;

/* VARIABLES DE LA PALETA */
const paddleWidth = 60;
const paddleHeight = 10;
// posicion
let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleY = ballY + ballRadius;
// teclas
let rightPressed = false;
let leftPressed = false;

/* VARIABLES DE LADRILLOS */
const brickRowCount = 10;
const brickColumnCount = 9;
const brickWidth = (canvas.width - 50) / brickColumnCount - 2;
const brickHeight = 15;
const brickPadding = 2;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    BROKEN: 0
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        const random = Math.floor(Math.random() * 20);
        bricks[c][r] = { x: brickX, y: brickY, status: BRICK_STATUS.ACTIVE, color: random };
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.drawImage(
        $sprites, 31, 174, 45, 10,
        paddleX, paddleY, paddleWidth, paddleHeight
    )
}

function drawBricks(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === BRICK_STATUS.ACTIVE) {
                /**
                 * Explicar el DrawImage y porque funciona
                 */
                ctx.drawImage(
                    $bricks, bricks[c][r].color * 16, 0, 16, 7,
                    bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight
                )
            }
        }
    }
}


// 


function ballMovement(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function paddleMovement(){
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 4;
    } else if(leftPressed && paddleX > 0){
        paddleX -= 4;
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
    }
}

function keyUpHandler(e){
    const { key } = e;
    if(key === 'Right' || key === 'ArrowRight'){
        rightPressed = false;
    } else if(key === 'Left' || key === 'ArrowLeft'){
        leftPressed = false;
    }
}

function draw(){
    // Dibujar elementos
    clearCanvas();
    drawBall();
    drawPaddle();
    drawBricks();

    // Colisiones y movimientos
    collisionDetection();
    ballMovement();
    paddleMovement();

    // 
}

draw();
initEvents();
