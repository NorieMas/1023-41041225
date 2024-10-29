const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x, y, dx, dy = 0;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX;
let brickRowCount, brickColumnCount;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft;
let bricks = [];
let score = 0;
let lives;
let gameOver = false;
let trail = [];
const maxTrailLength = 10;

let currentDifficulty;
let currentLevel = 1; // 新增變數來追蹤當前關卡
let lastScore = 0;
let paddleJumpCooldown = false;
const paddleJumpDistance = 30;
let originalPaddleY;
let paddleY;
const jumpCooldownTime = 5000;

function init() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    originalPaddleY = canvas.height - paddleHeight;
    paddleY = originalPaddleY;
    gameOver = false;
    lastScore = 0;

    setDifficulty(currentDifficulty);

    brickOffsetLeft = (canvas.width - (brickWidth * brickColumnCount + brickPadding * (brickColumnCount - 1))) / 2;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: brickStrengths[currentDifficulty] };
        }
    }

    draw();
}

function startGame(difficulty) {
    setRandomBackground();
    setDifficulty(difficulty);
    init();
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("gameTitle").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
}

function restartGame(difficulty) {
    score = 0;
    currentLevel = 1;
    setRandomBackground();
    init();
}

function draw() {
    if (gameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    trail.push({ x, y });
    if (trail.length > maxTrailLength) {
        trail.shift();
    }

    drawBricks();
    drawBall();
    drawPaddle();
    drawHUD();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
            dy = -dy;
            const angleOffset = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            dx += angleOffset * 0.5;
        } else {
            lives--;
            if (lives <= 0) {
                gameOver = true;
                document.getElementById("finalScore").innerText = score;
                document.querySelector(".game-over").style.display = "block";
                document.getElementById("gameCanvas").style.display = "none";
            } else {
                resetBall();
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = (currentDifficulty === 'hard') ? 3 : (currentDifficulty === 'medium') ? 2 : 1;
    dy = -Math.abs(dx);
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.getElementById("restartBtn").addEventListener("click", function() {
    document.querySelector(".game-over").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    restartGame();
});

document.getElementById("menuBtn").addEventListener("click", function() {
    document.getElementById("difficultySelection").style.display = "block";
    document.querySelector(".game-over").style.display = "none";
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("background").style.backgroundImage = "";
    document.getElementById("gameTitle").style.display = "block";
});

// 處理模態框的繼續按鈕
$('#continueBtn').on('click', function() {
    $('#levelCompleteModal').modal('hide');
    init(); // 重新初始化以開始新關卡
});
