import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoresList = document.getElementById('high-scores-list');

canvas.width = 800;
canvas.height = 400;

const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    speed: 5,
    jumpForce: 10,
    velocityY: 0,
    isJumping: false
};

const platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 150, width: 100, height: 20 }
];

let score = 0;
let gameLoop;
const gravity = 0.5;
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function updatePlayer() {
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }
    if (keys['Space'] && !player.isJumping) {
        player.velocityY = -player.jumpForce;
        player.isJumping = true;
    }

    player.velocityY += gravity;
    player.y += player.velocityY;

    // Collision detection
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    // Keep player within canvas
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
    player.y = Math.min(player.y, canvas.height - player.height);

    // Update score
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'green';
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    backend.addHighScore(score);
    updateHighScores();
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

function resetGame() {
    player.x = 50;
    player.y = 200;
    player.velocityY = 0;
    player.isJumping = false;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    startGame();
}

function startGame() {
    gameLoop = requestAnimationFrame(update);
}

function update() {
    updatePlayer();
    drawGame();

    if (player.y >= canvas.height - player.height) {
        gameOver();
    } else {
        gameLoop = requestAnimationFrame(update);
    }
}

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = score;
        highScoresList.appendChild(li);
    });
}

updateHighScores();
startGame();
