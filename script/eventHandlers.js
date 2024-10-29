function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

canvas.addEventListener("click", function(event) {
    if (!paddleJumpCooldown) {
        paddleJumpCooldown = true;
        paddleY -= paddleJumpDistance;

        setTimeout(() => {
            paddleY = originalPaddleY;
            paddleJumpCooldown = false;
        }, 500);
    }
});
