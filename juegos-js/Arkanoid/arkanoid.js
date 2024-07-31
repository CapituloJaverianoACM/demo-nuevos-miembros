/**
 * Explicar que el document viene del DOM o para manipular el DOM
 * 
 * Explicar el ctx o lo que se peude llegar a hacer con Canvas en realidad
 */

/*
Document Object Model, es una interfaz de programación que trata un documento HTML o XML 
como una estructura jerárquica de objetos. Esta estructura permite a los desarrolladores 
interactuar con el contenido y el diseño de una página web de manera dinámica, 


*/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

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


/**
 * 
 * Escribir en el taller esta función estaría bien, explicar el porque de las cosas
 * Y de las validaciones
 * 
 * Resaltar que esta función hace parte de las que se ejecuta en cada frame.
 */
////////////////

function collisionDetection() {
    // Colisiones con las paredes
    // Verifica si la bola toca los bordes izquierdo o derecho del canvas
    if(ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        // Si es así, invierte la dirección horizontal de la bola
        ballSpeedX = -ballSpeedX;
    }

    // Verifica si la bola toca el borde superior del canvas
    if(ballY + ballSpeedY < ballRadius) {
        // Si es así, invierte la dirección vertical de la bola
        ballSpeedY = -ballSpeedY;
    }

    // Verifica si la bola toca el borde inferior del canvas
    if(ballY + ballSpeedY > canvas.height - ballRadius) {
        // Si es así, muestra un mensaje de "Game Over" y recarga la página
        console.log('Game Over');
        document.location.reload();
    }

    // Colisiones con la paleta
    // Verifica si la bola está dentro del rango horizontal de la paleta y justo en la altura de la paleta
    if(ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ballSpeedY === paddleY) {
        // Si es así, invierte la dirección vertical de la bola
        ballSpeedY = -ballSpeedY;
    }

    // Colisiones con los ladrillos
    // Recorre cada columna de ladrillos
    // Let es una variable control de bloque y no es redeclarable 
    for (let c = 0; c < brickColumnCount; c++) {
        // Recorre cada fila de ladrillos en la columna actual
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r]; // Obtiene el ladrillo en la posición actual
            // Verifica si el ladrillo está activo
            if (brick.status === BRICK_STATUS.ACTIVE) {
                // Determina si la bola colisiona con el ladrillo
                const isBallSameXAsBrick = ballX + ballRadius > brick.x && ballX - ballRadius < brick.x + brickWidth;
                const isBallSameYAsBrick = ballY + ballRadius > brick.y && ballY - ballRadius < brick.y + brickHeight;

                // Si hay colisión, invierte la dirección vertical de la bola y cambia el estado del ladrillo a "roto"
                if (isBallSameXAsBrick && isBallSameYAsBrick) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = BRICK_STATUS.BROKEN;
                }
            }
        }
    }
}

//////////////
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

    /** 
     * Explicar para que sirve esta función con respecto al objeto Window y que se puede hacer
     * Explicar a grandes rasgos que es una función asíncrona que usa el callback Draw
     */

    // es un método que indica al navegador que se desea realizar una animación
    // y solicita que el navegador programe el repintado de la ventana para el próximo ciclo de animación.
    // draw es una función que se llama justo antes de que el navegador vuelva a dibujar la pantalla.

    window.requestAnimationFrame(draw);
    
}

draw();
initEvents();
