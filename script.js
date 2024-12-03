// Initialisiere Canvas
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const background = new Image();
background.src = "./assets/background/Rusted_4.webp";

// Hintergrund zeichnen/async damit der Background laden kann
background.onload = () => {
  drawBackground();
};

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Zentrale Konfiguration für Charaktere und Animationen
const characterConfig = {
  bancho: {
    idle: {
      frames: 7,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_Idle.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    walk: {
      frames: 6,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_walk.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 200,
    },
    hurt: {
      frames: 3,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_Hurt.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    attack1: {
      frames: 8,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_attack3.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    attack2: {
      frames: 9,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_attack1.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    jump: {
      frames: 10,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_Jump.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
  },
  battingGirl: {
    idle: {
      frames: 15,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Idle-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    walk: {
      frames: 6,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Walk-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 200,
    },
    hurt: {
      frames: 4,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Hurt-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
    attack1: {
      frames: 5,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_attack01-Sheet.png",
      originalFrameWidth: 110,
      originalFrameHeight: 100,
    },
    attack2: {
      frames: 11,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_attack03-Sheet.png",
      originalFrameWidth: 110,
      originalFrameHeight: 100,
    },
    jump: {
      frames: 4,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Jump-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
    },
  },
  bruteArms: {
    idle: {
      frames: 7,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Idle.png",
      originalFrameWidth: 120,
      originalFrameHeight: 120,
    },
    walk: {
      frames: 6,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Walk.png",
      originalFrameWidth: 120,
      originalFrameHeight: 120,
      speed: 200,
    },
    hurt: {
      frames: 4,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Hurt.png",
      originalFrameWidth: 120,
      originalFrameHeight: 120,
    },
    attack1: {
      frames: 6,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_attack01.png",
      originalFrameWidth: 150,
      originalFrameHeight: 120,
    },
    attack2: {
      frames: 5,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_attack04.png",
      originalFrameWidth: 160,
      originalFrameHeight: 120,
    },
    jump: {
      frames: 4,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Jump.png",
      originalFrameWidth: 120,
      originalFrameHeight: 140,
    },
  },
};

function preloadSprites(config) {
  const promises = [];

  Object.entries(config).forEach(([character, actions]) => {
    Object.entries(actions).forEach(([action, details]) => {
      const sprite = new Image();
      sprite.src = details.src;
      details.sprite = sprite; // Sprite direkt speichern

      promises.push(
        new Promise((resolve, reject) => {
          sprite.onload = () => {
            console.log(`Loaded sprite for ${character} action ${action}`);
            resolve();
          };
          sprite.onerror = () => {
            console.error(
              `Failed to load sprite for ${character} action ${action}: ${details.src}`
            );
            reject();
          };
        })
      );
    });
  });

  return Promise.all(promises);
}

// Beim Start des Spiels
preloadSprites(characterConfig)
  .then(() => {
    console.log("All sprites loaded successfully!");
    requestAnimationFrame(gameLoop); // Startet erst nach vollständigem Laden
  })
  .catch(() => {
    console.error("Some sprites failed to load. Check your configuration.");
  });

// Spieler-Klasse
class Player {
  constructor(x, character) {
    this.x = x;
    this.y = 150;
    this.character = character || 'bancho'; // Standardcharakter
    this.width = 200; // Feste Zielgröße
    this.height = 200; // Feste Zielgröße
    this.action = 'idle';
    this.speed = 5;
    this.velocityY = 0;
    this.isJumping = false;
    this.health = 300;
    this.canAttack = true;
    this.currentFrame = 0; // Frame für Animation
    this.jumpStrength = -6; // Negative Kraft für den Sprung
    this.gravity = 0.1; // Schwerkraft
    this.lastFrameUpdateTime = 0;
    // Hitbox-Initialisierung
    this.hitbox = {
      active: false,
      x: this.x + this.width,
      y: this.y,
      width: 0,
      height: 0,
    };
  }

  setCharacter(character) {
    this.character = character;
    this.action = "idle";
    this.currentFrame = 0; // Animation zurücksetzen
  }
}

// Spieler erstellen
const player1 = new Player(100, "bancho");
const player2 = new Player(500, "battingGirl");

function drawPlayer(player) {
  const config = characterConfig[player.character][player.action || "idle"];
  const sprite = config.sprite;
  if (player.action === "jump") {
    console.log(
      `Drawing jump animation: Frame ${player.currentFrame}, Sprite: ${config.src}`
    );
  }

  if (!sprite) {
    console.error(`Sprite is undefined for action ${player.action}`);
    return;
  }

  if (!sprite.complete) {
    console.warn(`Sprite not loaded for action ${player.action}`);
    return;
  }

  console.log(
    `Drawing ${player.character} action: ${player.action}, Frame: ${player.currentFrame}, Sprite: ${config.src}`
  );

  ctx.drawImage(
    sprite,
    player.currentFrame * config.originalFrameWidth,
    0,
    config.originalFrameWidth,
    config.originalFrameHeight,
    player.x,
    player.y,
    player.width,
    player.height
  );
}

// Animation aktualisieren
function updateAnimationFrames(currentTime) {
  const animationSpeed = 100;
  if (currentTime - lastSpriteUpdateTime >= animationSpeed) {
    lastSpriteUpdateTime = currentTime;

    // Player 1
    const player1Config = characterConfig[player1.character][player1.action || "idle"];
    const player1Speed = player1Config.speed || 100;
  
    if (currentTime - player1.lastFrameUpdateTime >= player1Speed) {
      if (player1.action === 'attack1' || player1.action === 'attack2') {
        player1.currentFrame = (player1.currentFrame + 1) % player1Config.frames;
      } else {
        player1.currentFrame = (player1.currentFrame + 1) % player1Config.frames;
      }
      player1.lastFrameUpdateTime = currentTime; // Timer aktualisieren
    }
  
  
    // Spieler 2
    const player2Config = characterConfig[player2.character][player2.action || "idle"];
    const player2Speed = player2Config.speed || 100;
  
    if (currentTime - player2.lastFrameUpdateTime >= player2Speed) {
      if (player2.action === 'attack1' || player2.action === 'attack2') {
        player2.currentFrame = (player2.currentFrame + 1) % player2Config.frames;
      } else {
        player2.currentFrame = (player2.currentFrame + 1) % player2Config.frames;
      }
      player2.lastFrameUpdateTime = currentTime; // Timer aktualisieren
    }
  
    lastSpriteUpdateTime = currentTime;
  }
}
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
  // Bewegung von Spieler 1
  if (!player1.isJumping && player1.canAttack && keys["j"]) {
    triggerAttack(player1); // Vorrang für Angriff
  } else {
    if (keys["a"]) {
      player1.x -= player1.speed;
      if (!player1.isJumping) player1.action = "walk";
      if (checkModelOverlap(player1, player2)) {
        player1.x += player1.speed; // Bewegung rückgängig machen
      }
    }
    if (keys["d"]) {
      player1.x += player1.speed;
      if (!player1.isJumping) player1.action = "walk";
      if (checkModelOverlap(player1, player2)) {
        player1.x -= player1.speed; // Bewegung rückgängig machen
      }
    }
    if (!keys["a"] && !keys["d"] && !player1.isJumping && player1.canAttack) {
      player1.action = "idle"; // Zurück zur Idle-Animation
    }
  }

  // Bewegung von Spieler 2
  if (!player2.isJumping && player2.canAttack && keys["2"]) {
    triggerAttack(player2); // Vorrang für Angriff
  } else {
    if (keys["ArrowLeft"]) {
      player2.x -= player2.speed;
      if (!player2.isJumping) player2.action = "walk";
      if (checkModelOverlap(player1, player2)) {
        player2.x += player2.speed; // Bewegung rückgängig machen
      }
    }
    if (keys["ArrowRight"]) {
      player2.x += player2.speed;
      if (!player2.isJumping) player2.action = "walk";
      if (checkModelOverlap(player1, player2)) {
        player2.x -= player2.speed; // Bewegung rückgängig machen
      }
    }
    if (!keys["ArrowLeft"] && !keys["ArrowRight"] && !player2.isJumping && player2.canAttack) {
      player2.action = "idle"; // Zurück zur Idle-Animation
    }
  }

  // Sprunglogik für Spieler 1
  if (keys["w"] && !player1.isJumping) {
    console.log("Player 1 starts jumping");
    player1.velocityY = player1.jumpStrength;
    player1.isJumping = true;
    player1.action = "jump"; // Setze Animation auf "jump"
    player1.currentFrame = 0; // Starte die Sprunganimation
  }

  if (player1.isJumping) {
    const jumpConfig = characterConfig[player1.character].jump;

    // Aktualisiere Position und Geschwindigkeit
    player1.y += player1.velocityY;
    player1.velocityY += player1.gravity;

    // Animation während des Aufstiegs
    if (player1.velocityY < 0) {
      // Spieler steigt auf
      const midFrame = Math.floor(jumpConfig.frames / 2); // Hälfte der Frames
      if (player1.currentFrame < midFrame) {
        player1.currentFrame++;
      }
    } else if (player1.velocityY > 0) {
      // Spieler fällt
      if (player1.currentFrame < jumpConfig.frames - 1) {
        player1.currentFrame++;
      }
    }

    // Spieler landet
    if (player1.y >= 150) {
      player1.y = 150;
      player1.velocityY = 0;
      player1.isJumping = false;
      player1.action = "idle"; // Zurück zur Idle-Animation
      player1.currentFrame = 0; // Frame zurücksetzen
    }
  }

  // Sprunglogik für Spieler 2
  if (keys["ArrowUp"] && !player2.isJumping) {
    player2.velocityY = player2.jumpStrength;
    player2.isJumping = true;
    player2.action = "jump"; // Setze Animation auf "jump"
    player2.currentFrame = 0; // Starte die Sprunganimation
  }

  if (player2.isJumping) {
    player2.y += player2.velocityY;
    player2.velocityY += player2.gravity;

    // Aktualisiere die Animation basierend auf der Frameanzahl
    const jumpConfig = characterConfig[player2.character].jump;
    if (player2.currentFrame < jumpConfig.frames - 1) {
      player2.currentFrame++;
    }

    if (player2.y >= 150) {
      // Spieler landet wieder
      player2.y = 150;
      player2.velocityY = 0;
      player2.isJumping = false;
      player2.action = "idle"; // Zurück zur Idle-Animation
    }
  }

  // Angriff für Spieler 1
  if (keys["j"] && player1.canAttack) {
    triggerAttack(player1);
  }

  // Angriff für Spieler 2
  if (keys["1"] && player2.canAttack) {
    triggerAttack(player2);
  }
  function triggerAttack(player) {
    const attackConfig = characterConfig[player.character].attack1; // Aktuelle Konfiguration
    player.action = 'attack1'; // Setze Aktion auf 'attack1'
    player.currentFrame = 0; // Starte die Animation von vorne
    player.canAttack = false; // Deaktiviere weitere Angriffe

    // Berechne die Dauer der Animation
    const config = characterConfig[player.character].attack1;
    const animationDuration = attackConfig.frames * (attackConfig.speed || 100); // 100ms pro Frame

    // Setze Aktion nach der Animation zurück
    setTimeout(() => {
      if (!player.isJumping && !keys["a"] && !keys["d"]) {
        player.action = 'idle'; // Zurück zu Idle, falls keine Bewegung oder Sprung
      }
      player.canAttack = true; // Erlaube neue Angriffe
    }, animationDuration);
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
  function handlePlayerAction(
    player,
    key,
    action,
    frames,
    canAttackDelay,
    resetDelay
  ) {
    if (keys[key] && player.canAttack) {
      player.action = action;
      spriteConfig[player === player1 ? "player1Frame" : "player2Frame"] = 0; // Reset frame to the start
      player.canAttack = false;
      setTimeout(() => {
        player.action = null; // Reset action after animation finishes
      }, frames * spriteConfig.animationSpeed); // Total time for the animation
      setTimeout(() => {
        player.canAttack = true; // Allow attack after cooldown
      }, canAttackDelay);
    }
  }

  // Player 1 actions (attack1 on 'j')
  handlePlayerAction(
    player1,
    "j",
    "attack1",
    spriteConfig.attack1Frames,
    500,
    200
  );

  // Player 2 actions (attack1 on '1')
  handlePlayerAction(
    player2,
    "1",
    "attack1",
    spriteConfig.attack1Frames,
    500,
    200
  );
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
  if (!player.hitbox) {
    console.error(`Hitbox for player ${player.character} is undefined.`);
    return;
  }

  if (player.action === "attack1") {
    player.hitbox.active = true;
    player.hitbox.x = player.x + player.width / 2;
    player.hitbox.y = player.y + 20;
    player.hitbox.width = 30;
    player.hitbox.height = 60;
  } else if (player.action === "attack2") {
    player.hitbox.active = true;
    player.hitbox.x = player.x + player.width / 2;
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
    ctx.strokeRect(
      player.hitbox.x,
      player.hitbox.y,
      player.hitbox.width,
      player.hitbox.height
    );
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
function debugPlayer(player) {
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText(`Action: ${player.action}`, player.x, player.y - 10);
  ctx.fillText(`Frame: ${player.currentFrame}`, player.x, player.y - 25);
}

// Füge dies in die gameLoop ein:
debugPlayer(player1);
debugPlayer(player2);

// Spiel-Loop
let lastSpriteUpdateTime = 0;
let isPaused = false;

function gameLoop(currentTime) {
  if (!isPaused) {
    // 1. Canvas löschen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Hintergrund zeichnen
    drawBackground();

    // 3. Animationen aktualisieren
    updateAnimationFrames(currentTime);

    // 4. Spieleraktionen und Bewegungen ausführen
    update();

    // 5. Hitboxen aktualisieren
    updateHitbox(player1);
    updateHitbox(player2);

    // 6. Spieler zeichnen
    drawPlayer(player1);
    drawPlayer(player2);
    debugPlayer(player1);
    debugPlayer(player2);
    // 7. Hitboxen zeichnen (Debugging, optional)
    drawHitbox(player1);
    drawHitbox(player2);

    // 8. Kollisionen prüfen
    handleCollisions();

    // 9. Gesundheitsbalken und Statusanzeigen aktualisieren
    updateHealth();
  }

  // 10. Nächsten Frame anfordern
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

{
  let timer = 120;
  const timerDisplay = document.getElementById("timer");
  const div = timerDisplay.parentElement;

  if (timerDisplay) {
    const timerInterval = setInterval(() => {
      if (timer > 0 && !isPaused) {
        timer--;
        timerDisplay.textContent = timer;
      } else if (timer <= 0) {
        clearInterval(timerInterval);
        if (player1.health > player2.health) {
          div.textContent = "PLAYER 1 WON!";
        } else if (player2.health > player1.health) {
          div.textContent = "PLAYER 2 WON!";
        } else {
          div.textContent = "TIME OVER! IT'S A TIE!";
        }
      }
    }, 1000);
  }
}

// Pause-Funktion
const pause = document.getElementById("pause");
pause.addEventListener("click", () => {
  isPaused = !isPaused;
  pause.textContent = isPaused ? "play" : "pause";
});
