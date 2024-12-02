// Initialisiere Canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const background = new Image();
background.src = './assets/background/Rusted_4.webp'; 
// Hintergrund zeichnen/async damit der background laden kann

background.onload = () => {
  drawBackground()
}

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
}



// initialisiere sprite sheet
const player1SpriteSheet = new Image();
player1SpriteSheet.src ="./assets/sprites/Bancho/Sprite_Sheet/Bancho_Idle.png"; 

const player2SpriteSheet = new Image();
player2SpriteSheet.src ="./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Idle.png";

// Animationseinstellungen
const spriteConfig = {
    frameWidth: 100, // Width of each frame in the sprite sheet
    frameHeight: 100, // Height of each frame in the sprite sheet
    animationSpeed: 100, // Time (ms) per frame
    player1Frame: 0, // Current frame for Player 1
    player2Frame: 0, // Current frame for Player 2
    totalFrames: 8, // Total frames in the sprite sheet
    frameTimer: 0, // Timer to track animation updates

  };

// Charakter-Objekte


class player {
  constructor(x, color) {
    this.x = x,
    this.y = 150,
    this.color = color,

    this.width = 200,
    this.height = 200,
    this.speed = 5,
    this.velocityY = 0;
    this. isJumping = false,
    this.jumpStrength = -17,
    this.gravity = 0.8,
    this.action = null,
    this.health = 300,
    this.hitbox = { x: 0, y: 0, width: 0, height: 0, active: false },
    this.canAttack = true,
    this.damageAttack1 = 5,
    this.damageAttack2 = 10
  }
}

const player1 = new player(100, 'blue');
const player2 = new player(500, 'green');



// Spieler zeichnen (mit Animation)
function drawPlayer(player, sprite, currentFrame) {
    ctx.drawImage(
      sprite, // The sprite sheet
      currentFrame * spriteConfig.frameWidth, // Source X (current frame)
      0, // Source Y (first row only)
      spriteConfig.frameWidth, // Frame width
      spriteConfig.frameHeight, // Frame height
      player.x, // Destination X
      player.y, // Destination Y
      player.width, // Drawn width
      player.height, // Drawn height
    );
  }
  
  let lastSpriteUpdateTime = 0; // Tracks the last time the sprite frame was updated

  function updateAnimationFrames(currentTime) {
    const spriteAnimationSpeed = 100; // Milliseconds per frame (adjust for slower/faster animation)
  
    // Only update the frame if enough time has passed
    if (currentTime - lastSpriteUpdateTime >= spriteAnimationSpeed) {
      lastSpriteUpdateTime = currentTime;
  
      // Update player1's animation frame
      if (player1.action === "jump") {
        spriteConfig.player1Frame = (spriteConfig.player1Frame + 1) % 4; // 4 frames for jump
      } else if (player1.action === "attack1") {
        spriteConfig.player1Frame = (spriteConfig.player1Frame + 1) % 6; // 6 frames for attack
      } else {
        spriteConfig.player1Frame = (spriteConfig.player1Frame + 1) % 7; // Default idle (3 frames)
      }
  
      // Update player2's animation frame
      if (player2.action === "jump") {
        spriteConfig.player2Frame = (spriteConfig.player2Frame + 1) % 4;
      } else if (player2.action === "attack1") {
        spriteConfig.player2Frame = (spriteConfig.player2Frame + 1) % 6;
      } else {
        spriteConfig.player2Frame = (spriteConfig.player2Frame + 1) % 7;
      }
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
    if (checkModelOverlap(player1, player2)) {
      player2.x += player2.speed; // Bewegung rückgängig machen
    }
  }
  if (keys["ArrowRight"]) {
    player2.x += player2.speed;
    if (checkModelOverlap(player1, player2)) {
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
    if (player1.y >= 150) {
      player1.y = 150;
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
    if (player2.y >= 150) {
      player2.y = 150;
      player2.velocityY = 0;
      player2.isJumping = false;
    }
  }

  // Begrenzung der Spieler im Canvas
  player1.x = Math.max(-18, Math.min(canvas.width - player1.width, player1.x));
  player2.x = Math.max(-18, Math.min(canvas.width - player2.width, player2.x));
}
//Überprüfe Modellkollision
const margin = 42; // Margin to shrink the hitbox
function checkModelOverlap(player1, player2) {
  return (
    player1.x + margin < player2.x + player2.width - margin &&
    player1.x + player1.width - margin > player2.x + margin &&
    player1.y + margin < player2.y + player2.height - margin &&
    player1.y + player1.height - margin > player2.y + margin
  );
}



// Aktionen verwalten
function handleAnimations() {
  function handlePlayerAction(player, key, action, canAttackDelay, resetDelay) {
    if (keys[key] && player.canAttack) {
      player.action = action;
      player.canAttack = false;
      resetAction(player, resetDelay);
      setTimeout(() => {
        player.canAttack = true;
      }, canAttackDelay);
    }
  }

  // Aktionen für Spieler 1
  handlePlayerAction(player1, "j", "attack1", 500, 200);
  handlePlayerAction(player1, "k", "attack2", 500, 200);
  if (keys["s"]) {
    player1.action = "block";
    resetAction(player1, 300);
  }

  // Aktionen für Spieler 2
  handlePlayerAction(player2, "1", "attack1", 500, 200);
  handlePlayerAction(player2, "2", "attack2", 500, 200);
  if (keys["ArrowDown"]) {
    player2.action = "block";
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
function gameLoop(currentTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  updateAnimationFrames(currentTime);
  drawPlayer(player1, player1SpriteSheet, spriteConfig.player1Frame);
  drawPlayer(player2, player2SpriteSheet, spriteConfig.player2Frame);
  drawHitbox(player1);
  drawHitbox(player2);
  updateHitbox(player1);
  updateHitbox(player2);
  handleCollisions();
  updateHealth();
  update();
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


let isPaused = false;
// Timer
{
    let timer = 120;
    const timerDisplay = document.getElementById('timer');
    const div = timerDisplay.parentElement
    

    if (timerDisplay) { // Vermeide Fehler, wenn das Element fehlt
        const timerInterval = setInterval(() => {
            if (timer > 0 && isPaused === false) {
                timer--;
                timerDisplay.textContent = timer;
            } else if(timer > 0 && isPaused === true) {} else {
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

const pause = document.getElementById('pause')
pause.addEventListener('click', pauseGame);

function pauseGame(){
  if(isPaused === false){
    pause.textContent = 'play';
    return isPaused = true;
  }else{
    pause.textContent = "pause"
    return isPaused = false;
  }
}