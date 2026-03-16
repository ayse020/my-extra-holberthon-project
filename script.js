const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const musicBtn = document.getElementById('music-btn');

let score = 0;
let gameActive = false;
let playerPos = window.innerWidth / 2 - 40;

let lives = 3;
let isImmune = false;
let musicMuted = false;

player.style.backgroundImage = "url('hello-kitty.png')";

const catchSound = document.getElementById('sound-catch');
const explosionSound = document.getElementById('sound-explosion');
const fuseSound = document.getElementById('sound-bomb-fuse');
const startSound = document.getElementById('sound-start');
const heartSound = document.getElementById('sound-heart');
const clickSound = document.getElementById('sound-click');

// === MUSİQİ DÜYMƏSI ===
musicBtn.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    musicMuted = !musicMuted;
    startSound.muted = musicMuted;

    if (musicMuted) {
        musicBtn.textContent = '🔇';
        musicBtn.classList.add('muted');
    } else {
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('muted');
    }
});

// === CAN GÖSTƏRİCİSİ ===
function createLivesDisplay() {
    let livesDiv = document.getElementById('lives-display');
    if (!livesDiv) {
        livesDiv = document.createElement('div');
        livesDiv.id = 'lives-display';
        gameContainer.appendChild(livesDiv);
    }
    livesDiv.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart' + (i < lives ? ' active' : ' lost');
        heart.style.backgroundImage = "url('heart.png')";
        heart.style.backgroundSize = 'contain';
        heart.style.backgroundRepeat = 'no-repeat';
        heart.style.backgroundPosition = 'center';
        heart.style.width = '32px';
        heart.style.height = '32px';
        heart.style.display = 'inline-block';
        livesDiv.appendChild(heart);
    }
}

// === OYUNA BAŞLAMA ===
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameActive = true;
    score = 0;
    lives = 3;
    isImmune = false;
    document.getElementById('score').innerText = "Xal: 0";
    createLivesDisplay();
    startSound.currentTime = 0;
    startSound.play();
    startGame();
});

// === KLAVIATURA ===
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key === 'ArrowLeft' && playerPos > 0) playerPos -= 40;
    if (e.key === 'ArrowRight' && playerPos < window.innerWidth - 80) playerPos += 40;
    player.style.left = playerPos + 'px';
});

// === TOXUNUŞ ===
document.addEventListener('touchstart', (e) => {
    if (!gameActive) return;
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    if (touchX < screenWidth / 2) {
        if (playerPos > 0) playerPos -= 40;
    } else {
        if (playerPos < screenWidth - 80) playerPos += 40;
    }
    player.style.left = playerPos + 'px';
});

// === DÜŞƏN OBYEKTLƏRİ YARAT ===
function createFallingObject() {
    if (!gameActive) return;

    const rand = Math.random();
    let type;
    if (rand < 0.25) {
        type = 'bomb';
    } else if (rand < 0.28) {
        type = 'heart';
    } else {
        type = 'candy';
    }

    const obj = document.createElement('div');

    if (type === 'bomb') {
        obj.className = 'bomb';
        obj.style.backgroundImage = "url('bomb.png')";
        fuseSound.currentTime = 0;
        fuseSound.play();
    } else if (type === 'heart') {
        obj.className = 'heart-item';
        obj.style.backgroundImage = "url('heart.png')";
        obj.style.backgroundSize = 'contain';
        obj.style.backgroundRepeat = 'no-repeat';
        obj.style.backgroundPosition = 'center';
    } else {
        obj.className = 'candy';
        obj.style.backgroundImage = "url('candy.png')";
    }

    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top = '-50px';
    gameContainer.appendChild(obj);

    let fallInterval = setInterval(() => {
        let top = parseInt(obj.style.top);
        if (top > window.innerHeight) {
            clearInterval(fallInterval);
            obj.remove();
            if (type === 'bomb') fuseSound.pause();
        } else if (!gameActive) {
            clearInterval(fallInterval);
            obj.remove();
        } else {
            obj.style.top = top + 5 + 'px';
            checkCollision(obj, type, fallInterval);
        }
    }, 20);
}

// === TOQQUŞMA YOXLA ===
function checkCollision(obj, type, interval) {
    const pRect = player.getBoundingClientRect();
    const oRect = obj.getBoundingClientRect();

    if (oRect.bottom > pRect.top && oRect.left < pRect.right && oRect.right > pRect.left) {
        clearInterval(interval);
        obj.remove();

        if (type === 'bomb') {
            handleBombHit();
        } else if (type === 'heart') {
            handleHeartCatch();
        } else {
            handleCandyCatch();
        }
    }
}

// === BOMBA DƏYMƏSI ===
function handleBombHit() {
    if (isImmune) return;

    fuseSound.pause();
    explosionSound.play();

    lives--;
    createLivesDisplay();

    if (lives <= 0) {
        endGame();
    } else {
        activateImmunity();
    }
}

// === ÜRƏK TUTULMASI ===
function handleHeartCatch() {
    if (lives < 3) {
        lives++;
        createLivesDisplay();
    }
    heartSound.currentTime = 0;
    heartSound.play();
}

// === KONFET TUTULMASI ===
function handleCandyCatch() {
    score += 10;
    document.getElementById('score').innerText = "Xal: " + score;
    catchSound.currentTime = 0;
    catchSound.play();
}

// === İMMUNİTET ===
function activateImmunity() {
    isImmune = true;
    player.classList.add('blinking');
    setTimeout(() => {
        isImmune = false;
        player.classList.remove('blinking');
    }, 2000);
}

// === OYUN BİTİR ===
function endGame() {
    gameActive = false;
    fuseSound.pause();
    startSound.pause();
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').innerText = "Xalın: " + score;
}

// === OYUN DÖNGÜSÜ ===
function startGame() {
    const gameLoop = setInterval(() => {
        if (!gameActive) {
            clearInterval(gameLoop);
            return;
        }
        createFallingObject();
    }, 1000);
}
