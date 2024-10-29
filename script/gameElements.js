function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
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
                ctx.fillStyle = "#fff"; 
                ctx.font = "16px Arial";
                ctx.fillText(b.status, brickX + brickWidth / 2 - 10, brickY + brickHeight / 2 + 5);
            }
        }
    }
}

function drawHUD() {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`分數: ${score}`, 8, 20);
    ctx.fillText(`生命: ${lives}`, canvas.width - 70, 20);
}
