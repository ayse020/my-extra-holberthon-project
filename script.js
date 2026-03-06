const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

let score = 0;
let gameActive = false;
let playerPos = window.innerWidth / 2 - 40; // Mərkəzdən başlasın

// Hello Kitty-nin şəkli
player.style.backgroundImage = "url('visuals/hello-kitty.png')";

const catchSound = document.getElementById('sound-catch');
const explosionSound = document.getElementById('sound-explosion');
const fuseSound = document.getElementById('sound-bomb-fuse');
const startSound = document.getElementById('sound-start');

// OYUNA BAŞLAMA
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameActive = true;
    score = 0;
    document.getElementById('score').innerText = "Xal: 0";
    startSound.play();
    startGame();
});

// KOMPYUTER ÜÇÜN İDARƏETMƏ (Klaviatura)
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key === 'ArrowLeft' && playerPos > 0) playerPos -= 40;
    if (e.key === 'ArrowRight' && playerPos < window.innerWidth - 80) playerPos += 40;
    player.style.left = playerPos + 'px';
});

// TELEFON ÜÇÜN İDARƏETMƏ (Toxunuş)
document.addEventListener('touchstart', (e) => {
    if (!gameActive) return;
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2) {
        // Ekranın soluna toxunanda sola get
        if (playerPos > 0) playerPos -= 40;
    } else {
        // Ekranın sağına toxunanda sağa get
        if (playerPos < screenWidth - 80) playerPos += 40;
    }
    player.style.left = playerPos + 'px';
});

function createFallingObject() {
    if (!gameActive) return;

    const obj = document.createElement('div');
    const isBomb = Math.random() < 0.3; // 30% bomba ehtimalı
    obj.className = isBomb ? 'bomb' : 'candy';
    
    // Şəkillər visuals qovluğundan
    if (isBomb) {
        obj.style.backgroundImage = "url('visuals/bomb.png')";
        fuseSound.currentTime = 0;
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
        } else if (!gameActive) {
            clearInterval(fallInterval);
            obj.remove();
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
            catchSound.currentTime = 0;
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
    // Hər 1 saniyədən bir yeni obyekt düşsün
    const gameLoop = setInterval(() => {
        if (!gameActive) {
            clearInterval(gameLoop);
            return;
        }
        createFallingObject();
    }, 1000);
}
