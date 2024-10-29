function collisionDetection() {
    let allBricksBroken = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                allBricksBroken = false;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;
                    score += (b.status === 0) ? 1 : 0;

                    if (score % 10 === 0 && score > lastScore) {
                        lives++;
                    }
                }
            }
        }
    }
    
    if (allBricksBroken) {
        currentLevel++;
        if (currentLevel <= 3) {
            document.getElementById("nextLevel").innerText = currentLevel; // 設置下一關的文本
            $('#levelCompleteModal').modal('show'); // 顯示模態框
        } else {
            gameOver = true;
            document.getElementById("finalScore").innerText = score;
            document.querySelector(".game-over").style.display = "block";
            document.getElementById("gameCanvas").style.display = "none";
        }
    }
}
