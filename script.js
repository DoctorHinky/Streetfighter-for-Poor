// Initialisiere Canvas
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Hintergrund zeichnen
function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Himmelblau
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Charakter-Objekte
const player1 = {
    x: 100,
    y: 300,
    width: 50,
    height: 100,
    color: 'blue',
    speed: 5,
    action: null, // Hinzugefügt: Initialzustand
};

const player2 = {
    x: 600,
    y: 300,
    width: 50,
    height: 100,
    color: 'green',
    speed: 5,
    action: null, // Hinzugefügt: Initialzustand
};

// Spieler zeichnen
function drawPlayer(player) {
    if (player.action === 'jump') {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y - 50, player.width, player.height);
    } else if (player.action === 'attack') {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x + 20, player.y, player.width, player.height);
    } else if (player.action === 'block') {
        ctx.fillStyle = 'yellow'; // Block-Farbe
        ctx.fillRect(player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

// Tastenverwaltung
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Spieler aktualisieren
function update() {
    // Bewegung für Spieler 1
    if (keys['a']) player1.x -= player1.speed;
    if (keys['d']) player1.x += player1.speed;

    // Bewegung für Spieler 2
    if (keys['ArrowLeft']) player2.x -= player2.speed;
    if (keys['ArrowRight']) player2.x += player2.speed;

    // Begrenzungen
    player1.x = Math.max(0, Math.min(canvas.width - player1.width, player1.x));
    player2.x = Math.max(0, Math.min(canvas.width - player2.width, player2.x));
}

// Aktionen verwalten
function handleAnimations() {
    // Aktionen für Spieler 1
    if (keys['j']) {
        player1.action = 'attack';
        resetAction(player1, 200); // Aktion nach 200ms zurücksetzen
    }
    if (keys['w']) {
        player1.action = 'jump';
        resetAction(player1, 500);
    }
    if (keys['s']) {
        player1.action = 'block';
        resetAction(player1, 300);
    }

    // Aktionen für Spieler 2
    if (keys['1']) {
        player2.action = 'attack';
        resetAction(player2, 200);
    }
    if (keys['ArrowUp']) {
        player2.action = 'jump';
        resetAction(player2, 500);
    }
    if (keys['ArrowDown']) {
        player2.action = 'block';
        resetAction(player2, 300);
    }
}

// Aktion zurücksetzen
function resetAction(player, delay) {
    setTimeout(() => {
        player.action = null; // Aktion zurücksetzen
    }, delay);
}

// Spiel-Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    handleAnimations(); // Aktionen aktualisieren
    drawPlayer(player1);
    drawPlayer(player2);
    update();
    requestAnimationFrame(gameLoop);
}
gameLoop();

// Timer
{
    let timer = 120; 
    const timerDisplay = document.getElementById('timer');

    if (timerDisplay) { // Vermeide Fehler, wenn das Element fehlt
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerDisplay.textContent = timer;
            } else {
                clearInterval(timerInterval);
                alert('Timer up');
            }
        }, 1000);
    } else {
        console.warn('Timer-Element nicht gefunden!');
    }
}
