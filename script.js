const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

let score = 0;
let gameActive = false;
let playerPos = window.innerWidth / 2;

// Hello Kitty-nin şəkli
player.style.backgroundImage = "url('visuals/hello-kitty.png')";

const catchSound = document.getElementById('sound-catch');
const explosionSound = document.getElementById('sound-explosion');
const fuseSound = document.getElementById('sound-bomb-fuse');

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameActive = true;
    document.getElementById('sound-start').play();
    startGame();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPos > 0) playerPos -= 30;
    if (e.key === 'ArrowRight' && playerPos < window.innerWidth - 80) playerPos += 30;
    player.style.left = playerPos + 'px';
});

function createFallingObject() {
    if (!gameActive) return;

    const obj = document.createElement('div');
    const isBomb = Math.random() < 0.3;
    obj.className = isBomb ? 'bomb' : 'candy';
    
    // Şəkillərin qovluq ünvanları
    if (isBomb) {
        obj.style.backgroundImage = "url('visuals/bomb.png')";
        fuseSound.play();
    } else {
        obj.style.backgroundImage = "url('visuals/candy.png')";
    }

    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top = '-50px';
    gameContainer.appendChild(obj);

    let fallInterval = setInterval(() => {
        let top = parseInt(obj.style.top);
        if (top > window.innerHeight) {
            clearInterval(fallInterval);
            obj.remove();
            if (isBomb) fuseSound.pause();
        } else {
            obj.style.top = top + 5 + 'px';
            checkCollision(obj, isBomb, fallInterval);
        }
    }, 20);
}

function checkCollision(obj, isBomb, interval) {
    const pRect = player.getBoundingClientRect();
    const oRect = obj.getBoundingClientRect();

    if (oRect.bottom > pRect.top && oRect.left < pRect.right && oRect.right > pRect.left) {
        clearInterval(interval);
        obj.remove();

        if (isBomb) {
            endGame();
        } else {
            score += 10;
            document.getElementById('score').innerText = "Xal: " + score;
            catchSound.play();
        }
    }
}

function endGame() {
    gameActive = false;
    explosionSound.play();
    fuseSound.pause();
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').innerText = "Xalın: " + score;
}

function startGame() {
    setInterval(createFallingObject, 1000);
}
