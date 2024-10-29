const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x, y, dx, dy;
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
let lives; // 定義生命變數
let gameOver = false;

// 尾跡位置記錄
let trail = [];
const maxTrailLength = 10; // 最大尾跡長度

const backgrounds = [
    'url("images/1.png")',
    'url("images/2.png")',
    'url("images/3.png")'
];

const brickStrengths = {
    easy: 1,
    medium: 2,
    hard: 3
};

const brickColors = {
    1: "red",
    2: "#FFD700",
    3: "#90EE90"
};

let currentDifficulty;
let lastScore = 0; // 上一分數，用於檢查是否達到增加生命的條件
let paddleJumpCooldown = false; // 冷卻狀態
const paddleJumpDistance = 30; // 擋板向上移動的距離
const jumpCooldownTime = 5000; // 冷卻時間（毫秒）
let originalPaddleY; // 擋板原始Y座標
let paddleY; // 擋板當前Y座標
let jumpActive = false; // 標記是否跳躍中

function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    document.getElementById("background").style.backgroundImage = backgrounds[randomIndex];
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    switch (difficulty) {
        case 'easy':
            dx = 2;  // 較慢的球速
            dy = -2;
            brickRowCount = 2;  // 磚塊數量
            lives = 3; // 簡單模式 3 生命
            break;
        case 'medium':
            dx = 3;  // 中等球速
            dy = -3;
            brickRowCount = 3;  // 磚塊數量
            lives = 2; // 中等模式 2 生命
            break;
        case 'hard':
            dx = 4;  // 快速球速
            dy = -4;
            brickRowCount = 4;  // 磚塊數量
            lives = 1; // 困難模式 1 生命
            break;
    }
    brickColumnCount = 3; // 固定列數
}

function startGame(difficulty) {
    setRandomBackground(); // 每次開始遊戲時設置隨機背景
    setDifficulty(difficulty);
    init();
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("gameTitle").style.display = "none"; // 隱藏遊戲標題
    document.getElementById("gameCanvas").style.display = "block"; // 顯示畫布
}

function init() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    originalPaddleY = canvas.height - paddleHeight; // 記錄擋板的原始Y座標
    paddleY = originalPaddleY; // 初始化擋板的當前Y座標
    gameOver = false;
    score = 0;
    lastScore = 0; // 重置 lastScore

    brickOffsetLeft = (canvas.width - (brickWidth * brickColumnCount + brickPadding * (brickColumnCount - 1))) / 2;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: brickStrengths[currentDifficulty] }; // 根據難度設置擊中次數
        }
    }

    dy = -Math.abs(dx);
    draw();
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.getElementById("restartBtn").addEventListener("click", function() {
    document.querySelector(".game-over").style.display = "none"; 
    document.getElementById("gameCanvas").style.display = "block"; // 顯示畫布
    setRandomBackground(); // 重新設置隨機背景
    init(); // 重新開始遊戲
});
document.getElementById("menuBtn").addEventListener("click", function() {
    document.getElementById("difficultySelection").style.display = "block"; 
    document.querySelector(".game-over").style.display = "none"; 
    document.getElementById("gameCanvas").style.display = "none"; 
    document.getElementById("background").style.backgroundImage = ""; // 重置背景為白色
    document.getElementById("gameTitle").style.display = "block"; // 顯示遊戲標題
});

// 新增鼠標點擊事件以實現擋板跳躍
canvas.addEventListener("click", function(event) {
    if (!paddleJumpCooldown) {
        paddleJumpCooldown = true; // 設置冷卻狀態
        jumpActive = true; // 標記跳躍狀態
        paddleY -= paddleJumpDistance; // 擋板跳躍

        setTimeout(() => {
            paddleY = originalPaddleY; // 半秒後將擋板恢復到原始位置
            paddleJumpCooldown = false; // 冷卻結束
            jumpActive = false; // 重置跳躍狀態
        }, 500); // 半秒後恢復擋板
    }
});

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--; // 磚塊狀態減少
                    score += (b.status === 0) ? 1 : 0;

                    // 檢查分數是否增加到10的倍數
                    if (score % 10 === 0 && score > lastScore) {
                        lives++;
                    }
                }
            }
        }
    }
    lastScore = score; // 更新 lastScore
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight); // 使用擋板的當前Y座標
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                const brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                b.x = brickX;
                b.y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[b.status] || "#0095DD";
                ctx.fill();
                ctx.closePath();

                // 顯示擊中次數在磚塊中心
                ctx.fillStyle = "#fff"; // 白色字體
                ctx.font = "16px Arial";
                ctx.fillText(b.status, brickX + brickWidth / 2 - 10, brickY + brickHeight / 2 + 5);
            }
        }
    }
}

function drawHUD() {
    // 畫分數和生命
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`分數: ${score}`, 8, 20);
    ctx.fillText(`生命: ${lives}`, canvas.width - 70, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 繪製尾跡
    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = "red"; // 不透明的紅色
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // 添加當前球的位置到尾跡
    trail.push({ x, y });
    if (trail.length > maxTrailLength) {
        trail.shift(); // 限制尾跡的最大長度
    }

    drawBricks();
    drawBall();
    drawPaddle(); // 使用擋板的當前Y座標
    drawHUD(); // 繪製分數和生命
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth && !jumpActive) {
            dy = -dy;
            const angleOffset = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            dx += angleOffset * 0.5;
        } else if (jumpActive && y + dy > paddleY - ballRadius) {
            // 如果在跳躍狀態，檢查球是否與跳躍後的擋板相交
            dy = -dy;
            const angleOffset = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
            dx += angleOffset * 0.5;
        } else {
            lives--; // 減少生命
            if (lives <= 0) {
                gameOver = true;
                document.getElementById("finalScore").innerText = score;
                document.querySelector(".game-over").style.display = "block";
                document.getElementById("gameCanvas").style.display = "none"; 
                return;
            } else {
                // 重置球的位置
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = (currentDifficulty === 'hard') ? 4 : (currentDifficulty === 'medium') ? 3 : 2; // 根據難度設定速度
                dy = -Math.abs(dx); // 確保 dy 是負值
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// 開始遊戲
