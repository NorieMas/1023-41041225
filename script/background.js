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

function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    document.getElementById("background").style.backgroundImage = backgrounds[randomIndex];
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    switch (difficulty) {
        case 'easy':
            dx = 2;
            dy = -2;
            if(currentLevel==1) {
                brickRowCount = 1;
            } else if(currentLevel==2) {
                brickRowCount = 2;
            } else if(currentLevel==3) {
                brickRowCount = 3;
            }
            lives = 3; 
            break;
        case 'medium':
            dx = 2;
            dy = -2;
            if(currentLevel==1) {
                brickRowCount = 2;
            } else if(currentLevel==2) {
                brickRowCount = 3;
            } else if(currentLevel==3) {
                brickRowCount = 4;
            }
            lives = 2; 
            break;
        case 'hard':
            dx = 3;
            dy = -3;
            if(currentLevel==1) {
                brickRowCount = 3;
            } else if(currentLevel==2) {
                brickRowCount = 4;
            } else if(currentLevel==3) {
                brickRowCount = 5;
            }
            lives = 1; 
            break;
    }
    brickColumnCount = 5;
}
