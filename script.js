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
    velocityY: 0, 
    isJumping: false, // check for jump
    jumpStrength: -15, 
    gravity: 0.8, 
    action: null, 
};

const player2 = {
    x: 600,
    y: 300,
    width: 50,
    height: 100,
    color: 'green',
    speed: 5,
    velocityY: 0,
    isJumping: false,
    jumpStrength: -10,
    gravity: 0.8,
    action: null,
};

// Spieler zeichnen
function drawPlayer(player) {
    if (player.action === 'jump') {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y - 20, player.width, player.height); // player pause while jump init / animation confirmed
    } else if (player.action === 'attack') {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x + 20, player.y, player.width, player.height);
    } else if (player.action === 'block') {
        ctx.fillStyle = 'yellow'; 
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
    
    if (keys['a']) player1.x -= player1.speed;
    if (keys['d']) player1.x += player1.speed;

    
    if (keys['ArrowLeft']) player2.x -= player2.speed;
    if (keys['ArrowRight']) player2.x += player2.speed;

    
    if (keys['w'] && !player1.isJumping) {
        player1.velocityY = player1.jumpStrength;
        player1.isJumping = true;
        player1.action = 'jump';
        resetAction(player1, 500); // jump reset 500ms 
    }

    // Schwerkraft anwenden
    if (player1.isJumping) {
        player1.y += player1.velocityY;
        player1.velocityY += player1.gravity; // Schwerkraft anziehen
        if (player1.y >= 300) { // Spieler landet auf dem Boden
            player1.y = 300;
            player1.velocityY = 0;
            player1.isJumping = false; // Kein Sprung mehr
        }
    }

    // Sprung-Logik für Spieler 2
    if (keys['ArrowUp'] && !player2.isJumping) {
        player2.velocityY = player2.jumpStrength;
        player2.isJumping = true;
        player2.action = 'jump';
        resetAction(player2, 500); // Aktion nach 500ms zurücksetzen
    }

    // Schwerkraft anwenden für Spieler 2
    if (player2.isJumping) {
        player2.y += player2.velocityY;
        player2.velocityY += player2.gravity; // Schwerkraft anziehen
        if (player2.y >= 300) { // Spieler landet auf dem Boden
            player2.y = 300;
            player2.velocityY = 0;
            player2.isJumping = false;
        }
    }

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
        // Sprung wird über die update-Funktion verwaltet, daher hier keine Aktion nötig
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
        // Sprung wird über die update-Funktion verwaltet, daher hier keine Aktion nötig
    }
    if (keys['ArrowDown']) {
        player2.action = 'block';
        resetAction(player2, 300);
    }
}

//kollision
// Beispiel für Treffer-Logik
function handleCollisions() {
    if ((player1.action === 'attack' || player1.action === 'attack2') && player1.x + player1.width > player2.x && player1.x < player2.x + player2.width && player1.y + player1.height > player2.y) {
        player2.health -= 10;
        if (player2.health <= 0) player2.health = 0;
    }

    if ((player2.action === 'attack' || player2.action === 'attack2') && player2.x + player2.width > player1.x && player2.x < player1.x + player1.width && player2.y + player2.height > player1.y) {
        player1.health -= 10;
        if (player1.health <= 0) player1.health = 0;
    }
}

//gesundheitsbalken aktualisieren
// Beispiel für Health Balken Update
function updateHealth() {
    const player1HealthBar = document.getElementById('player1-health');
    const player2HealthBar = document.getElementById('player2-health');
    
    // Update der Balkenbreite basierend auf der Gesundheit
    player1HealthBar.style.width = `${player1.health}%`;
    player2HealthBar.style.width = `${player2.health}%`;
}

// Aufruf in der gameLoop()
updateHealth();



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
    handleCollisions();
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
