const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

let score = 0;
let gameActive = false;
let playerPos = window.innerWidth / 2;

// Səslər
const catchSound = document.getElementById('sound-catch');
const explosionSound = document.getElementById('sound-explosion');
const fuseSound = document.getElementById('sound-bomb-fuse');

// Başla düyməsi
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameActive = true;
    document.getElementById('sound-start').play();
    startGame();
});

// Hello Kitty-ni hərəkət etdir
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPos > 0) playerPos -= 30;
    if (e.key === 'ArrowRight' && playerPos < window.innerWidth - 80) playerPos += 30;
    player.style.left = playerPos + 'px';
});

function createFallingObject() {
    if (!gameActive) return;

    const obj = document.createElement('div');
    const isBomb = Math.random() < 0.3; // 30% ehtimalla bomba düşür
    obj.className = isBomb ? 'bomb' : 'candy';
    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top = '-50px';
    gameContainer.appendChild(obj);

    if (isBomb) fuseSound.play(); // Bomba çıxanda yanan fitili səsi

    let fallInterval = setInterval(() => {
        let top = parseInt(obj.style.top);
        if (top > window.innerHeight) {
            clearInterval(fallInterval);
            obj.remove();
            if (isBomb) fuseSound.pause(); // Bomba düşüb itəndə səs kəsilsin
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