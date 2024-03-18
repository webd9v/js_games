// HTML Elements
const rulesBtn = document.getElementById("showRulesBtn");
const closeBtn = document.getElementById("closeRulesBtn");
const rulesCarousel = document.getElementById("rulesCarousel");

// Event Listeners
rulesBtn.addEventListener("click", () => {
    rulesCarousel.classList.add("show"); // Add the 'show' class
});

closeBtn.addEventListener("click", () => {
    rulesCarousel.classList.remove("show"); // Remove the 'show' class
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Score
let score = 0;

// Brick, Paddle, and Ball Info (You've already defined these)
const brickInfo = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
};

// Paddle setup
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    visible: true,
};

// Ball setup
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true,
};

// Create bricks
const brickRowCount = 9;
const brickColumnCount = 5;
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
        const y =
            j * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

// Initial Drawing
draw();

function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.w) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

// Key press event listeners
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Ball Movement & Collisions
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Wall collisions (left/right)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // Reverse direction
    }
    // Wall collision (top)
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }
    // Paddle collision
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.dy; // Reverse ball's vertical direction
    }
    // Brick collisions
    bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
                if (
                    ball.x > brick.x && // Ball right side past brick left side
                    ball.x < brick.x + brick.width && // Ball right side past brick left side
                    ball.y + ball.size > brick.y && // Ball bottom past brick top
                    ball.y - ball.size < brick.y + brick.height // Ball top past brick bottom
                ) {
                    ball.dy *= -1;
                    brick.visible = false; // Hide the brick
                    increaseScore();
                }
            }
        });
    });
    // Bottom edge - Game Over
    if (ball.y + ball.size > canvas.height) {
        resetGame();
    }
}

function resetGame() {
    // Reset ball
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = -4;

    // Reset score
    score = 0;

    // Reset bricks
    showAllBricks();
}

function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBricks();
    }
}

function showAllBricks() {
    bricks.forEach((column) => {
        column.forEach((brick) => (brick.visible = true));
    });
}

// Update function
function update() {
    movePaddle();
    moveBall();
    // Future logic for ball movement, collision detection, etc.

    draw(); // Redraw the scene
    requestAnimationFrame(update);
}

// Game loop (call the update function repeatedly)
update();
