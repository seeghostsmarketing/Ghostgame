const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let score = 0;
let timeLeft = 30;
let gameInterval;
let ghostInterval;
let ghostFloatIntervals = {}; // 儲存每個鬼魂的漂浮計時器

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    gameArea.innerHTML = ''; // 清空所有鬼魂
    startButton.style.display = 'none';
    gameOverModal.style.display = 'none';

    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    ghostInterval = setInterval(createGhost, 800); // 每 0.8 秒出現一隻鬼
}

function createGhost() {
    const ghost = document.createElement('div');
    ghost.classList.add('ghost');

    // 隨機生成鬼魂位置，確保在遊戲區域內
    const gameAreaRect = gameArea.getBoundingClientRect();
    const ghostWidth = 60; // 與 CSS 中設定的鬼魂寬度一致
    const ghostHeight = 60; // 與 CSS 中設定的鬼魂高度一致

    const randomX = Math.random() * (gameAreaRect.width - ghostWidth);
    const randomY = Math.random() * (gameAreaRect.height - ghostHeight);

    ghost.style.left = `${randomX}px`;
    ghost.style.top = `${randomY}px`;

    ghost.addEventListener('click', () => {
        if (timeLeft > 0) { // 只有在遊戲進行中才能點擊得分
            score++;
            scoreDisplay.textContent = score;
            hitGhost(ghost);
            createSpellEffect(ghost.style.left, ghost.style.top);
        }
    });

    gameArea.appendChild(ghost);
}

function hitGhost(ghost) {
    ghost.classList.add('hit'); // 添加 hit 類觸發動畫
    clearInterval(ghostFloatIntervals[ghost.id]); // 清除漂浮計時器
    delete ghostFloatIntervals[ghost.id];

    // 等待動畫結束後移除鬼魂
    ghost.addEventListener('animationend', () => {
        ghost.remove();
    }, { once: true });
}

function createSpellEffect(x, y) {
    const spell = document.createElement('div');
    spell.classList.add('spell-effect');
    spell.style.left = x;
    spell.style.top = y;
    gameArea.appendChild(spell);

    // 移除特效
    spell.addEventListener('animationend', () => {
        spell.remove();
    }, { once: true });
}


function endGame() {
    clearInterval(gameInterval);
    clearInterval(ghostInterval);
    // 清除所有鬼魂的漂浮計時器
    for (const id in ghostFloatIntervals) {
        clearInterval(ghostFloatIntervals[id]);
    }
    ghostFloatIntervals = {}; // 清空儲存的計時器

    // 移除所有剩餘的鬼魂
    document.querySelectorAll('.ghost').forEach(ghost => ghost.remove());

    finalScoreDisplay.textContent = score;
    gameOverModal.style.display = 'flex'; // 顯示遊戲結束彈窗
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);