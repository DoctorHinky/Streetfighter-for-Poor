// Initialisiere Canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Hintergrund zeichnen
function drawBackground() {
  const img = new Image();
  img.src = 'assets/background/Rusted_4.png';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
}

const player1Sprite = new Image();
player1Sprite.src = "assets/sprites/Bancho/Sprite Sheets/Bancho_Idle-png"; // Pfad zum Bild für Spieler 1

const player2Sprite = new Image();
player2Sprite.src = "sprites/player2.png"; // Pfad zum Bild für Spieler 2

// Animationseinstellungen
const spriteConfig = {
  frameWidth: 64, // Breite eines Frames im Spritesheet
  frameHeight: 64, // Höhe eines Frames im Spritesheet
  animationSpeed: 10, // Anzahl Frames pro Sekunde
  player1Frame: 0, // aktueller Frame für Spieler 1
  player2Frame: 0, // aktueller Frame für Spieler 2
};

// Charakter-Objekte
const player1 = {
  x: 100,
  y: 300,
  width: 50,
  height: 100,
  color: "blue",
  speed: 5,
  velocityY: 0,
  isJumping: false,
  jumpStrength: -15,
  gravity: 0.8,
  action: null,
  health: 300,
  hitbox: { x: 0, y: 0, width: 0, height: 0, active: false },
  canAttack: true,
  damageAttack1: 5,
  damageAttack2: 10,
};

const player2 = {
  x: 600,
  y: 300,
  width: 50,
  height: 100,
  color: "green",
  speed: 5,
  velocityY: 0,
  isJumping: false,
  jumpStrength: -15,
  gravity: 0.8,
  action: null,
  health: 300,
  hitbox: { x: 0, y: 0, width: 0, height: 0, active: false },
  canAttack: true,
  damageAttack1: 5,
  damageAttack2: 10,
};

// Spieler zeichnen
function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  if (player.action === 'block') {
    ctx.fillStyle = 'yellow'; 
    ctx.fillRect(player.x, player.y, player.width, player.height);
}
}

// Tastenverwaltung
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Bewegung und Sprunglogik
function update() {
  // Bewegung von Spieler 1
  if (keys["a"]) {
    player1.x -= player1.speed;
    if (checkModelOverlap(player1, player2)) {
      player1.x += player1.speed; // Bewegung rückgängig machen
    }
  }
  if (keys["d"]) {
    player1.x += player1.speed;
    if (checkModelOverlap(player1, player2)) {
      player1.x -= player1.speed; // Bewegung rückgängig machen
    }
  }

  // Bewegung von Spieler 2
  if (keys["ArrowLeft"]) {
    player2.x -= player2.speed;
    if (checkModelOverlap(player2, player1)) {
      player2.x += player2.speed; // Bewegung rückgängig machen
    }
  }
  if (keys["ArrowRight"]) {
    player2.x += player2.speed;
    if (checkModelOverlap(player2, player1)) {
      player2.x -= player2.speed; // Bewegung rückgängig machen
    }
  }

  // Sprunglogik für Spieler 1
  if (keys["w"] && !player1.isJumping) {
    player1.velocityY = player1.jumpStrength;
    player1.isJumping = true;
    player1.action = "jump";
    resetAction(player1, 500);
  }

  if (player1.isJumping) {
    player1.y += player1.velocityY;
    player1.velocityY += player1.gravity;
    if (player1.y >= 300) {
      player1.y = 300;
      player1.velocityY = 0;
      player1.isJumping = false;
    }
  }

  // Sprunglogik für Spieler 2
  if (keys["ArrowUp"] && !player2.isJumping) {
    player2.velocityY = player2.jumpStrength;
    player2.isJumping = true;
    player2.action = "jump";
    resetAction(player2, 500);
  }

  if (player2.isJumping) {
    player2.y += player2.velocityY;
    player2.velocityY += player2.gravity;
    if (player2.y >= 300) {
      player2.y = 300;
      player2.velocityY = 0;
      player2.isJumping = false;
    }
  }

  // Begrenzung der Spieler im Canvas
  player1.x = Math.max(0, Math.min(canvas.width - player1.width, player1.x));
  player2.x = Math.max(0, Math.min(canvas.width - player2.width, player2.x));
}

// Überprüfe Modellkollision
function checkModelOverlap(player1, player2) {
  return (
    player1.x < player2.x + player2.width &&
    player1.x + player1.width > player2.x &&
    player1.y < player2.y + player2.height &&
    player1.y + player1.height > player2.y
  );
}

// Aktionen verwalten
function handleAnimations() {
  // Aktionen für Spieler 1
  if (keys["j"] && player1.canAttack) {
    player1.action = "attack1";
    player1.canAttack = false;
    resetAction(player1, 200);
    setTimeout(() => {
      player1.canAttack = true;
    }, 500);
  }

  if (keys["k"] && player1.canAttack) {
    player1.action = "attack2";
    player1.canAttack = false;
    resetAction(player1, 200);
    setTimeout(() => {
      player1.canAttack = true;
    }, 500);
  }
  if (keys['s']) {
    player1.action = 'block';
    resetAction(player1, 300);
}

  // Aktionen für Spieler 2
  if (keys["1"] && player2.canAttack) {
    player2.action = "attack1";
    player2.canAttack = false;
    resetAction(player2, 200);
    setTimeout(() => {
      player2.canAttack = true;
    }, 500);
  }

  if (keys["2"] && player2.canAttack) {
    player2.action = "attack2";
    player2.canAttack = false;
    resetAction(player2, 200);
    setTimeout(() => {
      player2.canAttack = true;
    }, 500);
  }
  if (keys['ArrowDown']) {
    player2.action = 'block';
    resetAction(player2, 300);
}
}

// Kollision mit Hitbox
function handleCollisions() {
  if (player1.hitbox.active && checkHitboxOverlap(player1.hitbox, player2)) {
    player2.health -= player1.damageAttack1;
    if (player2.health < 0) player2.health = 0;
  }

  if (player2.hitbox.active && checkHitboxOverlap(player2.hitbox, player1)) {
    player1.health -= player2.damageAttack1;
    if (player1.health < 0) player1.health = 0;
  }
}

// Überprüfe Hitbox-Kollision
function checkHitboxOverlap(hitbox, player) {
  return (
    hitbox.x < player.x + player.width &&
    hitbox.x + hitbox.width > player.x &&
    hitbox.y < player.y + player.height &&
    hitbox.y + hitbox.height > player.y
  );
}

// Hitbox-Position aktualisieren
function updateHitbox(player) {
  if (player.action === "attack1") {
    player.hitbox.active = true;
    player.hitbox.x = player.x + player.width;
    player.hitbox.y = player.y + 20;
    player.hitbox.width = 30;
    player.hitbox.height = 60;
  } else if (player.action === "attack2") {
    player.hitbox.active = true;
    player.hitbox.x = player.x + player.width;
    player.hitbox.y = player.y + 20;
    player.hitbox.width = 40;
    player.hitbox.height = 80;
  } else {
    player.hitbox.active = false;
  }
}

// Hitbox zeichnen (Debugging)
function drawHitbox(player) {
  if (player.hitbox.active) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.hitbox.x, player.hitbox.y, player.hitbox.width, player.hitbox.height);
  }
}

// Gesundheitsbalken aktualisieren
function updateHealth() {
  const player1HealthBar = document.getElementById("player1-health");
  const player2HealthBar = document.getElementById("player2-health");
  player1HealthBar.style.width = `${(player1.health / 300) * 100}%`;
  player2HealthBar.style.width = `${(player2.health / 300) * 100}%`;
}

// Aktion zurücksetzen
function resetAction(player, delay) {
    setTimeout(() => {
        player.action = null;
    }, delay);
  setTimeout(() => {
    player.action = null;
  }, delay);
}

// Spiel-Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  handleAnimations();
  drawPlayer(player1);
  drawPlayer(player2);
  drawHitbox(player1);
  drawHitbox(player2);
  updateHitbox(player1);
  updateHitbox(player2);
  handleCollisions();
  updateHealth();
  update();
  requestAnimationFrame(gameLoop);
}
gameLoop();


{
    let timer = 120;
    const timerDisplay = document.getElementById('timer');
    const div = timerDisplay.parentElement
    

    if (timerDisplay) { // Vermeide Fehler, wenn das Element fehlt
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerDisplay.textContent = timer;
            } else {
                clearInterval(timerInterval);  
                if(player1.health > player2.health){
                    div.textContent = "PLAYER 1 WON!"
                }else if(player2.health > player1.health){
                    div.textContent = 'PLAYER 2 WON!';
                }else{
                    div.textContent = "TIME OVER IT'S A TIE!"
                }
            }
        }, 1000);
    } else {
        console.warn('Timer-Element nicht gefunden!');
    }
}