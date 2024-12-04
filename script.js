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
      speed: 100,
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
      speed: 100,
    },
    attack1: {
      frames: 8,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_attack3.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
    },
    attack2: {
      frames: 9,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_attack1.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
    },
    jump: {
      frames: 10,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_Jump.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 200,
    },
  },
  battingGirl: {
    idle: {
      frames: 12,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Idle-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
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
      speed: 100,
    },
    attack1: {
      frames: 5,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_attack01-Sheet.png",
      originalFrameWidth: 110,
      originalFrameHeight: 100,
      speed: 100,
    },
    attack2: {
      frames: 11,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_attack03-Sheet.png",
      originalFrameWidth: 110,
      originalFrameHeight: 100,
      speed: 100,
    },
    jump: {
      frames: 4,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Jump-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 400,
    },
  },
  bruteArms: {
    idle: {
      frames: 7,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Idle.png",
      originalFrameWidth: 100,
      originalFrameHeight: 101,
      speed: 100,
    },
    walk: {
      frames: 6,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Walk.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 200,
    },
    hurt: {
      frames: 4,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Hurt.png",
      originalFrameWidth: 120,
      originalFrameHeight: 120,
      speed: 100,
    },
    attack1: {
      frames: 6,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_attack01.png",
      originalFrameWidth: 160,
      originalFrameHeight: 128,
      speed: 100,
    },
    attack2: {
      frames: 5,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_attack04.png",
      originalFrameWidth: 160,
      originalFrameHeight: 128,
      speed: 100,
    },
    jump: {
      frames: 10,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Jump.png",
      originalFrameWidth: 120,
      originalFrameHeight: 128,
      speed: 200,
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
    this.character = character || "bancho";
    this.width = 200;
    this.height = 200;
    this.action = "idle";
    this.speed = 3;
    this.velocityY = 0;
    this.isJumping = false;
    this.health = 300;
    this.canAttack = true;
    this.currentFrame = 0;
    this.jumpStrength = -6;
    this.gravity = 0.1;
    this.lastFrameUpdateTime = 0;
    this.facing = "right";

    // Separate Hitboxes
    this.attackHitbox = { x: 0, y: 0, width: 0, height: 0 };
    this.defenderHitbox = { x: this.x + 50, y: this.y + 50, width: 100, height: 100 };
  }

  updateDefenderHitbox() {
    this.defenderHitbox = {
      x: this.x + 50,
      y: this.y + 50,
      width: this.width - 100, // Beispiel: kleinere Breite
      height: this.height - 100, // Beispiel: kleinere Höhe
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

  if (!sprite) return; // Verlasse die Funktion, falls kein Sprite vorhanden ist

  ctx.save(); // Zustand speichern

  // Spiegeln, falls der Spieler nach links schaut
  if (player.facing === "left") {
    ctx.scale(-1, 1); // Horizontal spiegeln
    ctx.drawImage(
      sprite,
      player.currentFrame * config.originalFrameWidth,
      0,
      config.originalFrameWidth,
      config.originalFrameHeight,
      -player.x - player.width, // Negative Koordinaten wegen Spiegelung
      player.y,
      player.width,
      player.height
    );
  } else {
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

  ctx.restore(); // Zustand wiederherstellen
}

// Animation aktualisieren
function updateAnimationFrames(currentTime) {
  const animationSpeed = 100; // Allgemeine Animationsgeschwindigkeit (falls global verwendet)
  if (currentTime - lastSpriteUpdateTime >= animationSpeed) {
    lastSpriteUpdateTime = currentTime;

    // Player 1
    const player1Config = characterConfig[player1.character][player1.action || "idle"];
    const player1Speed = player1Config.speed; // Ohne Fallback
    if (currentTime - player1.lastFrameUpdateTime >= player1Speed) {
      player1.currentFrame = (player1.currentFrame + 1) % player1Config.frames;
      player1.lastFrameUpdateTime = currentTime;
    }

    // Player 2
    const player2Config = characterConfig[player2.character][player2.action || "idle"];
    const player2Speed = player2Config.speed; // Ohne Fallback
    if (currentTime - player2.lastFrameUpdateTime >= player2Speed) {
      player2.currentFrame = (player2.currentFrame + 1) % player2Config.frames;
      player2.lastFrameUpdateTime = currentTime;
    }
  }
}
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function update() {
  // Bewegung von Spieler 1
  if (player1.x < player2.x) {
    player1.facing = "right";
    player2.facing = "left";
  } else {
    player1.facing = "left";
    player2.facing = "right";
  }
  if (!player1.isJumping && player1.canAttack && keys["j"]) {
    triggerAttack(player1, "attack1");
  } else if (!player1.isJumping && player1.canAttack && keys["k"]) {
    triggerAttack(player1, "attack2");
  } else {
    if (keys["a"]) {
      player1.x -= player1.speed;
      if (checkModelOverlap(player1, player2)) {
        player1.x += player1.speed;
      } else {
        player1.action = "walk";
      }
    }
    if (keys["d"]) {
      player1.x += player1.speed;
      if (checkModelOverlap(player1, player2)) {
        player1.x -= player1.speed;
      } else {
        player1.action = "walk";
      }
    }
    if (!keys["a"] && !keys["d"] && !player1.isJumping && player1.canAttack) {
      player1.action = "idle";
    }
  }

  // Sprunglogik für Spieler 1
  if (keys["w"] && !player1.isJumping) {
    const nextY = player1.y + player1.jumpStrength;
    if (!checkModelOverlap({ ...player1, y: nextY }, player2)) {
      player1.velocityY = player1.jumpStrength;
      player1.isJumping = true;
      player1.action = "jump";
      player1.currentFrame = 0;
    }
  }

  if (player1.isJumping) {
    const jumpConfig = characterConfig[player1.character].jump;
    player1.y += player1.velocityY;
    player1.velocityY += player1.gravity;

    if (checkModelOverlap(player1, player2)) {
      resolveVerticalOverlap(player1, player2);
    }

    if (player1.velocityY < 0) {
      const midFrame = Math.floor(jumpConfig.frames / 2);
      if (player1.currentFrame < midFrame) {
        player1.currentFrame++;
      }
    } else if (player1.velocityY > 0) {
      if (player1.currentFrame < jumpConfig.frames - 1) {
        player1.currentFrame++;
      }
    }

    if (player1.y >= 150) {
      player1.y = 150;
      player1.velocityY = 0;
      player1.isJumping = false;
      player1.action = "idle";
      player1.currentFrame = 0;
    }
  }

  // Bewegung und Sprunglogik für Spieler 2 (analog zu Spieler 1)
  if (!player2.isJumping && player2.canAttack && keys["1"]) {
    triggerAttack(player2, "attack1");
  } else if (!player2.isJumping && player2.canAttack && keys["2"]) {
    triggerAttack(player2, "attack2");
  } else {
    if (keys["ArrowLeft"]) {
      player2.x -= player2.speed;
      if (checkModelOverlap(player2, player1)) {
        player2.x += player2.speed;
      } else {
        player2.action = "walk";
      }
    }
    if (keys["ArrowRight"]) {
      player2.x += player2.speed;
      if (checkModelOverlap(player2, player1)) {
        player2.x -= player2.speed;
      } else {
        player2.action = "walk";
      }
    }
    if (
      !keys["ArrowLeft"] &&
      !keys["ArrowRight"] &&
      !player2.isJumping &&
      player2.canAttack
    ) {
      player2.action = "idle";
    }
  }

  if (keys["ArrowUp"] && !player2.isJumping) {
    const nextY = player2.y + player2.jumpStrength;
    if (!checkModelOverlap({ ...player2, y: nextY }, player1)) {
      player2.velocityY = player2.jumpStrength;
      player2.isJumping = true;
      player2.action = "jump";
      player2.currentFrame = 0;
    }
  }

  if (player2.isJumping) {
    const jumpConfig = characterConfig[player2.character].jump;
    player2.y += player2.velocityY;
    player2.velocityY += player2.gravity;

    if (checkModelOverlap(player2, player1)) {
      resolveVerticalOverlap(player2, player1);
    }

    if (player2.velocityY < 0) {
      const midFrame = Math.floor(jumpConfig.frames / 2);
      if (player2.currentFrame < midFrame) {
        player2.currentFrame++;
      }
    } else if (player2.velocityY > 0) {
      if (player2.currentFrame < jumpConfig.frames - 1) {
        player2.currentFrame++;
      }
    }

    if (player2.y >= 150) {
      player2.y = 150;
      player2.velocityY = 0;
      player2.isJumping = false;
      player2.action = "idle";
      player2.currentFrame = 0;
    }
  }
  player1.updateDefenderHitbox();
  player2.updateDefenderHitbox();
  // Begrenzung der Spieler im Canvas
  player1.x = Math.max(-40, Math.min(canvas.width +50 - player1.width, player1.x));
  player2.x = Math.max(-40, Math.min(canvas.width +50 - player2.width, player2.x));
}

  // Angriff für Spieler 1
  if (keys["j"] && player1.canAttack) {
    triggerAttack(player1);
  }

  // Angriff für Spieler 2
  if (keys["1"] && player2.canAttack) {
    triggerAttack(player2);
  }
  function triggerAttack(player, attackType) {
    const attackConfig = characterConfig[player.character][attackType];
    player.action = attackType;
    player.currentFrame = 0;
    player.canAttack = false;
    player.damageDealt = false;
  
    // Set attack hitbox dimensions
    if (attackType === "attack1") {
      player.attackHitbox = {
        x: player.facing === "right" ? player.x + player.width : player.x - 60,
        y: player.y + 20,
        width: 60,
        height: 60,
      };
    } else if (attackType === "attack2") {
      player.attackHitbox = {
        x: player.facing === "right" ? player.x + player.width : player.x - 100,
        y: player.y,
        width: 100,
        height: 100,
      };
    }
  
    const damage = attackType === "attack1" ? 10 : 20; // Unterschiedlicher Schaden
  
    const animationDuration = attackConfig.frames * (attackConfig.speed || 100);
    const interval = setInterval(() => {
      checkAttackConnect(player, player === player1 ? player2 : player1, damage);
    }, 50);
  
    setTimeout(() => {
      clearInterval(interval);
      player.action = "idle";
      player.canAttack = true;
      player.attackHitbox = { x: 0, y: 0, width: 0, height: 0 };
    }, animationDuration);
  }
function resolveVerticalOverlap(player1, player2) {
  const overlapMargin = 10; // Sicherheitsabstand

  // Spieler sind vertikal überlappend
  if (
    player1.y + player1.height > player2.y &&
    player1.y < player2.y + player2.height
  ) {
    // Spieler 1 ist links von Spieler 2
    if (player1.x < player2.x) {
      player1.x -= overlapMargin; // Spieler 1 nach links verschieben
      player2.x += overlapMargin; // Spieler 2 nach rechts verschieben
    } else {
      player1.x += overlapMargin; // Spieler 1 nach rechts verschieben
      player2.x -= overlapMargin; // Spieler 2 nach links verschieben
    }
  }
}
//Überprüfe Modellkollision
const margin = 80; // Adjust this margin as needed

function checkModelOverlap(player1, player2) {
  const overlapHorizontal =
    player1.x + margin < player2.x + player2.width - margin &&
    player1.x + player1.width - margin > player2.x + margin;

  const overlapVertical =
    player1.y + margin < player2.y + player2.height - margin &&
    player1.y + player1.height - margin > player2.y + margin;

  // Overlap occurs only if both horizontal and vertical overlaps are true
  return overlapHorizontal && overlapVertical;
}

function checkAttackConnect(attacker, defender, damage) {
  const hitbox = attacker.attackHitbox;
  const defenderBox = defender.defenderHitbox;

  const overlap =
    hitbox.x < defenderBox.x + defenderBox.width &&
    hitbox.x + hitbox.width > defenderBox.x &&
    hitbox.y < defenderBox.y + defenderBox.height &&
    hitbox.y + hitbox.height > defenderBox.y;

  if (overlap && !attacker.damageDealt) {
    defender.health -= damage;
    attacker.damageDealt = true;
    console.log(`${attacker.character} trifft ${defender.character} für ${damage} Schaden!`);
  }
}
function drawHitbox(hitbox, color = "blue") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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






// Hitbox zeichnen (Debugging)


// Gesundheitsbalken aktualisieren
function updateHealth() {
  const player1HealthBar = document.getElementById("player1-health");
  const player2HealthBar = document.getElementById("player2-health");

  player1HealthBar.style.width = `${(player1.health / 300) * 100}%`;
  player2HealthBar.style.width = `${(player2.health / 300) * 100}%`;

  // Farben anpassen
  player1HealthBar.style.background = player1.health > 60
    ? "green"
    : player1.health > 30
    ? "orange"
    : "red";

  player2HealthBar.style.background = player2.health > 60
    ? "green"
    : player2.health > 30
    ? "orange"
    : "red";
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


    // 6. Spieler zeichnen
    drawPlayer(player1);
    drawPlayer(player2);
    debugPlayer(player1);
    debugPlayer(player2);
    drawHitbox(player1.defenderHitbox, "blue"); // Player 1 Defender Hitbox
    drawHitbox(player2.defenderHitbox, "blue"); // Player 2 Defender Hitbox
    drawHitbox(player1.attackHitbox, "red");    // Player 1 Attack Hitbox
    drawHitbox(player2.attackHitbox, "red");    // Player 2 Attack Hitbox

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
