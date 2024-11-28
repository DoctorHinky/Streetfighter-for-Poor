// initialyse canvas
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// draw game background
function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Skyblue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
drawBackground();

// character placeholder
const player1 = {
    x: 100,
    y: 300,
    width: 50,
    height: 100,
    color: 'blue',
    speed: 5,
};

const player2 = {
    x: 600,
    y: 300,
    width: 50,
    height: 100,
    color: 'green',
    speed: 5,
};

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

//character movement
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function update() {
    // movement player 1
    if (keys['w']) player1.y -= player1.speed;
    if (keys['s']) player1.y += player1.speed;
    if (keys['a']) player1.x -= player1.speed;
    if (keys['d']) player1.x += player1.speed;

    // movement player 2
    if (keys['ArrowUp']) player2.y -= player2.speed;
    if (keys['ArrowDown']) player2.y += player2.speed;
    if (keys['ArrowLeft']) player2.x -= player2.speed;
    if (keys['ArrowRight']) player2.x += player2.speed;

    // boundary check
    player1.x = Math.max(0, Math.min(canvas.width - player1.width, player1.x));
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));

    player2.x = Math.max(0, Math.min(canvas.width - player2.width, player2.x));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer(player1);
    drawPlayer(player2);
    update();
    requestAnimationFrame(gameLoop);
}
gameLoop();

