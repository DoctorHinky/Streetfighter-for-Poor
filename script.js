// Initialisiere Canvas

// import { SelectedMap, SelectedP1, SelectedP2 } from "./menu/menu.js";
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;
const p1Name = sessionStorage.getItem("SelectedP1");
const p2Name = sessionStorage.getItem("SelectedP2");
const mappymaus = sessionStorage.getItem("SelectedMap");

console.log("player1: ",p1Name);
console.log("player2: ",p2Name);
console.log("map", mappymaus);

const background = new Image();
background.src = mappymaus;

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
    stun:{
      frames: 6, // Anzahl der Frames für die Stun-Animation
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_stun.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 50, // Geschwindigkeit der Stun-Animation
    },
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
      hitbox: { 
      right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
      left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
    },
  },
    attack2: {
      frames: 9,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_attack1.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
      hitbox: { 
        right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
        left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
      },
    },
    jump: {
      frames: 10,
      src: "./assets/sprites/Bancho/Sprite_Sheet/Bancho_Jump.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 200,
    },
    defenderHitbox: {
      right: { offsetX: 50, offsetY: 50, width: 130, height: 150 },
      left: { offsetX: -180, offsetY: 50, width: 130, height: 150 },
    },
    block: {
      frames: 3, // Anzahl der Frames in der Block-Animation
      src: "./assets/sprites/Bancho/Sprite_Sheet/bancho_Block.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100, // Geschwindigkeit der Animation
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
      hitbox: { 
        right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
        left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
      },
    },
    attack2: {
      frames: 11,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_attack03-Sheet.png",
      originalFrameWidth: 110,
      originalFrameHeight: 100,
      speed: 100,
      hitbox: { 
        right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
        left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
      },
    },
    jump: {
      frames: 4,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Jump-Sheet.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 400,
    },
    defenderHitbox: {
      right: { offsetX: 50, offsetY: 50, width: 130, height: 150 },
      left: { offsetX: -180, offsetY: 50, width: 130, height: 150 },
    },
    block: {
      frames: 3,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/battingGirl_Block.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
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
      hitbox: { 
        right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
        left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
      },
    },
    attack2: {
      frames: 5,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_attack04.png",
      originalFrameWidth: 160,
      originalFrameHeight: 128,
      speed: 100,
      hitbox: { 
        right: { offsetX: 125, offsetY: 85, width: 70, height: 100 },
        left: { offsetX: -50, offsetY: 85, width: 70, height: 100 },
      },
    },
    jump: {
      frames: 10,
      src: "./assets/sprites/BruteArms/Sprite_Sheet/BruteArm_Jump.png",
      originalFrameWidth: 120,
      originalFrameHeight: 128,
      speed: 200,
    },
    defenderHitbox: {
      right: { offsetX: 50, offsetY: 50, width: 130, height: 150 },
      left: { offsetX: -180, offsetY: 50, width: 130, height: 150 },
    },
    block: {
      frames: 3,
      src: "./assets/sprites/BattingGirl/Sprite_Sheet/BattingGirl_Block.png",
      originalFrameWidth: 100,
      originalFrameHeight: 100,
      speed: 100,
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
    this.isHurt = false;
    this.currentFrame = 0;
    this.jumpStrength = -6;
    this.gravity = 0.1;
    this.lastFrameUpdateTime = 0;
    this.facing = "right";

    // Block-Mechanik
    this.blockDamageTaken = 0; // Angesammelter geblockter Schaden
    this.isStunned = false; // Status, ob der Spieler gestunned ist
    this.blockResetTimeout = null; // Timer für das Zurücksetzen des Block-Schadens

    // Separate Hitboxes
    this.attackHitbox = { x: 0, y: 0, width: 0, height: 0 };
    this.defenderHitbox = { x: 0, y: 0, width: 0, height: 0 };
  }

  resetBlockDamage() {
    this.blockDamageTaken = 0;
    console.log(`${this.character}: Block-Schaden zurückgesetzt.`);
  }



  updateDefenderHitbox() {
    
    const config = characterConfig[this.character]?.defenderHitbox?.[this.facing];
    
    if (!config) {
      console.error(`Defender hitbox configuration not found for facing: ${this.facing}`);
      return;
    }
  
    this.defenderHitbox = {
      x: this.x + config.offsetX,
      y: this.y + config.offsetY,
      width: config.width,
      height: config.height,
    };}
  setCharacter(character) {
    this.character = character;
    this.action = "idle";
    this.currentFrame = 0; // Animation zurücksetzen
  }
}

// Spieler erstellen
const player1 = new Player(100, p1Name);
const player2 = new Player(500, p2Name);

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
function triggerHurtAnimation(player) {
  const hurtConfig = characterConfig[player.character]?.hurt;

  if (!hurtConfig) {
    console.error(`Hurt animation config not found for character: ${player.character}`);
    return;
  }

  player.action = "hurt"; // Setzt die Animation auf "Hurt"
  player.currentFrame = 0; // Startet die Animation vom ersten Frame
  player.isHurt = true; // Setzt den Spieler in den "Hurt"-Status

  // Dauer der Animation berechnen
  const hurtDuration = hurtConfig.frames * hurtConfig.speed;

  setTimeout(() => {
    player.isHurt = false; // Beendet den "Hurt"-Status
    player.action = "idle"; // Wechselt zurück zur Idle-Animation
  }, hurtDuration);
}
// Animation aktualisieren
// Funktion zur Aktualisierung der Animationsframes
function updateAnimationFrames(currentTime) {
  const updateFrame = (player) => {
    const config = characterConfig[player.character][player.action || "idle"];
    if (!config) {
      console.error(`No config found for action: ${player.action} (Character: ${player.character})`);
      return;
    }

    const speed = config.speed || 100;

    if (currentTime - player.lastFrameUpdateTime >= speed) {
      player.lastFrameUpdateTime = currentTime;

      // Spezielle Block-Logik
      if (player.action === "block") {
        if (player.currentFrame < config.frames - 1) {
          player.currentFrame++; // Nächsten Frame anzeigen
        }
        // Am letzten Frame bleiben, solange geblockt wird
        return; // Keine weitere Logik ausführen
      }

      // Stun-Animation loopen
      if (player.action === "stun") {
        player.currentFrame++;
        if (player.currentFrame >= config.frames) {
          player.currentFrame = 0; // Zurück zum ersten Frame, um die Animation zu loopen
        }
        return; // Keine weitere Logik ausführen
      }

      // Normale Animationslogik für andere Aktionen
      player.currentFrame++;

      // console.log(
      //   `Player: ${player.character}, Action: ${player.action}, Current Frame: ${player.currentFrame}`
      // );

      // Animation zurücksetzen, wenn sie beendet ist
      if (player.currentFrame >= config.frames) {
        if (player.action.startsWith("attack")) {
          player.action = "idle"; // Zurück zur Idle-Animation nach Attacke
        }
        player.currentFrame = 0; // Zurück zum ersten Frame
      }
    }
  };

  // Spieler 1 und 2 Frames aktualisieren
  updateFrame(player1);
  updateFrame(player2);
}










const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
function update() {
  const applyGravity = (player) => {
    // Gravitation anwenden, wenn der Spieler in der Luft ist
    if (!player.isJumping && player.y < 150) {
      player.velocityY += player.gravity; // Gravitation hinzufügen
      player.y += player.velocityY; // Position anpassen

      if (player.y >= 150) {
        // Spieler erreicht den Boden
        player.y = 150; // Zurück auf Ursprungslevel
        player.velocityY = 0; // Vertikale Geschwindigkeit zurücksetzen
        player.action = "idle"; // Zurück zur Idle-Animation
      }
    }
  };

  const handleJump = (player, jumpKey) => {
    if (keys[jumpKey] && !player.isJumping && player.y >= 150) {
      // Sprung starten
      player.velocityY = player.jumpStrength; // Sprungkraft anwenden
      player.isJumping = true;
      player.action = "jump"; // Sprung-Animation starten
    }

    if (player.isJumping) {
      player.y += player.velocityY; // Vertikale Position anpassen
      player.velocityY += player.gravity; // Gravitation anwenden

      if (player.y >= 150) {
        // Landen
        player.y = 150; // Zurück auf Ursprungslevel
        player.velocityY = 0; // Vertikale Geschwindigkeit zurücksetzen
        player.isJumping = false; // Sprung beenden
        player.action = "idle"; // Zurück zur Idle-Animation
      }
    }
  };

  // Gravitation und Sprünge für Spieler anwenden
  applyGravity(player1);
  handleJump(player1, "w");

  applyGravity(player2);
  handleJump(player2, "ArrowUp");

  // Spieler 1 Blockhaltung aktivieren
  if (keys["s"] && !player1.isBlocking && !player1.isStunned) {
    player1.isBlocking = true;
    player1.action = "block";
    player1.currentFrame = 0; // Animation von Anfang starten
  } else if (!keys["s"] || player1.isStunned) {
    player1.isBlocking = false;
  }

  // Spieler 2 Blockhaltung aktivieren
  if (keys["ArrowDown"] && !player2.isBlocking && !player2.isStunned) {
    player2.isBlocking = true;
    player2.action = "block";
    player2.currentFrame = 0; // Animation von Anfang starten
  } else if (!keys["ArrowDown"] || player2.isStunned) {
    player2.isBlocking = false;
  }

  // Spieler 1 Bewegungen und Aktionen
  if (!player1.isBlocking && !player1.isHurt && !player1.isStunned && !player1.action.startsWith("attack")) {
    if (keys["a"]) {
      player1.x -= player1.speed; // Nach links bewegen
      player1.facing = "left";
      if (!player1.isJumping) player1.action = "walk"; // Animation nur setzen, wenn nicht gesprungen wird
    }
    if (keys["d"]) {
      player1.x += player1.speed; // Nach rechts bewegen
      player1.facing = "right";
      if (!player1.isJumping) player1.action = "walk";
    }
    if (!keys["a"] && !keys["d"] && !player1.isJumping) {
      player1.action = "idle"; // Keine Bewegung
    }

    // Angriff ausführen
    if (keys["j"]) triggerAttack(player1, "attack1");
    if (keys["k"]) triggerAttack(player1, "attack2");
  }

  // Spieler 2 Bewegungen und Aktionen
  if (!player2.isBlocking && !player2.isHurt && !player2.isStunned && !player2.action.startsWith("attack")) {
    if (keys["ArrowLeft"]) {
      player2.x -= player2.speed;
      player2.facing = "left";
      if (!player2.isJumping) player2.action = "walk";
    }
    if (keys["ArrowRight"]) {
      player2.x += player2.speed;
      player2.facing = "right";
      if (!player2.isJumping) player2.action = "walk";
    }
    if (!keys["ArrowLeft"] && !keys["ArrowRight"] && !player2.isJumping) {
      player2.action = "idle";
    }

    // Angriff ausführen
    if (keys["1"]) triggerAttack(player2, "attack1");
    if (keys["2"]) triggerAttack(player2, "attack2");
  }

  // Spieler blicken sich an
  if (player1.x < player2.x) {
    player1.facing = "right";
    player2.facing = "left";
  } else {
    player1.facing = "left";
    player2.facing = "right";
  }

  // Überlappung der Modelle verhindern
  if (checkModelOverlap(player1, player2)) {
    const overlapMargin = 10;
    if (player1.x < player2.x) {
      player1.x -= overlapMargin; // Spieler 1 nach links verschieben
      player2.x += overlapMargin; // Spieler 2 nach rechts verschieben
    } else {
      player1.x += overlapMargin; // Spieler 1 nach rechts verschieben
      player2.x -= overlapMargin; // Spieler 2 nach links verschieben
    }
  }

  // Spieler auf dem Spielfeld begrenzen
  player1.x = Math.max(0, Math.min(canvas.width - player1.width, player1.x));
  player2.x = Math.max(0, Math.min(canvas.width - player2.width, player2.x));

  // Defender-Hitboxen aktualisieren
  player1.updateDefenderHitbox();
  player2.updateDefenderHitbox();
}






function triggerAttack(player, attackType) {
  const attackConfig = characterConfig[player.character][attackType];
  if (!attackConfig || !player.canAttack) {
    console.warn(`Cannot trigger attack: ${attackType} for ${player.character}. Reason: Invalid config or attack cooldown.`);
    return;
  }

  console.log(`Triggering attack: ${attackType} for ${player.character}`);

  player.action = attackType; // Angriff starten
  player.currentFrame = 0; // Animation von Anfang starten
  player.canAttack = false; // Während des Angriffs keine neuen Aktionen erlauben

  // Hitbox-Daten setzen
  const hitboxConfig = attackConfig.hitbox[player.facing];
  player.attackHitbox = {
    x: player.x + hitboxConfig.offsetX,
    y: player.y + hitboxConfig.offsetY,
    width: hitboxConfig.width,
    height: hitboxConfig.height,
  };

  console.log(`Attack hitbox for ${player.character}:`, player.attackHitbox);

  // Schadensprüfung nach Verzögerung auslösen
  const damageDelay = Math.floor(attackConfig.frames / 2) * attackConfig.speed;
  setTimeout(() => {
    if (!player.damageDealt) {
      console.log(`Checking damage for ${player.character} during attack: ${attackType}`);
      checkAttackConnect(player, player === player1 ? player2 : player1, attackType === "attack1" ? 10 : 20);
    }
  }, damageDelay);

  // Animation vollständig ablaufen lassen
  const animationDuration = attackConfig.frames * attackConfig.speed;
  setTimeout(() => {
    console.log(`Attack animation finished for ${player.character}`);
    player.action = "idle"; // Zurück zur Idle-Animation
    player.canAttack = true; // Spieler kann wieder angreifen
    player.attackHitbox = { x: 0, y: 0, width: 0, height: 0 }; // Hitbox zurücksetzen
    player.damageDealt = false; // Schaden-Status zurücksetzen
  }, animationDuration);
}






function resolveVerticalOverlap(player1, player2) {
  const overlapMargin = 150; // Sicherheitsabstand

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
    attacker.damageDealt = true; // Schaden nur einmal pro Angriff

    if (defender.isBlocking) {
      defender.blockDamageTaken += damage;
      console.log(`${defender.character} blockt ${damage} Schaden!`);

      // Block-Brechen prüfen
      if (defender.blockDamageTaken >= 60) {
        console.log(`${defender.character}: Block gebrochen!`);
        defender.isBlocking = false; // Blocken beenden
        defender.isStunned = true;  // Spieler wird gestunned
        defender.action = "stun";  // Stun-Animation starten
        defender.currentFrame = 0; // Animation von Anfang starten

        // Stun-Dauer festlegen
        setTimeout(() => {
          defender.isStunned = false; // Stun beenden
          defender.action = "idle";  // Zurück zur Idle-Animation
          defender.resetBlockDamage(); // Block-Schaden zurücksetzen
        }, 2000); // 2 Sekunden Stun-Dauer
      }

      // Block-Schaden-Zurücksetzen nach Timeout
      clearTimeout(defender.blockResetTimeout);
      defender.blockResetTimeout = setTimeout(() => {
        defender.resetBlockDamage();
      }, 5000); // Nach 5 Sekunden ohne Blocken
    } else {
      // Schaden zufügen, wenn nicht geblockt wird
      defender.health -= damage;
      console.log(`${attacker.character} trifft ${defender.character} für ${damage} Schaden!`);
      triggerHurtAnimation(defender);
    }
  }
}



// function triggerAttack(player, attackType) {
//   const attackConfig = characterConfig[player.character][attackType];
//   player.action = attackType; // Starte die Angriffanimation
//   player.currentFrame = 0; // Animation von Anfang starten
//   player.canAttack = false; // Spieler kann nicht erneut angreifen
//   player.damageDealt = false; // Schaden noch nicht verursacht

//   // Hitbox-Daten basierend auf Blickrichtung setzen
//   const hitboxConfig = attackConfig.hitbox[player.facing];
//   player.attackHitbox = {
//     x: player.x + hitboxConfig.offsetX,
//     y: player.y + hitboxConfig.offsetY,
//     width: hitboxConfig.width,
//     height: hitboxConfig.height,
//   };

//   // Schadensprüfung verzögert starten
//   const damageDelay = 300; // Verzögerung in ms
//   const animationDuration = attackConfig.frames * (attackConfig.speed || 100);

//   setTimeout(() => {
//     if (!player.damageDealt) {
//       checkAttackConnect(player, player === player1 ? player2 : player1, attackType === "attack1" ? 10 : 20);
//     }
//   }, damageDelay);

//   // Angriff zurücksetzen nach Animationsdauer
//   setTimeout(() => {
//     player.action = "idle"; // Zurück zur Idle-Animation
//     player.canAttack = true; // Spieler kann wieder angreifen
//     player.attackHitbox = { x: 0, y: 0, width: 0, height: 0 }; // Hitbox zurücksetzen
//     player.damageDealt = false; // Schaden-Status zurücksetzen
//   }, animationDuration);
// }

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

  player1HealthBar.style.transform = `scaleX(${player1.health / 300})`;
  player2HealthBar.style.transform = `scaleX(${player2.health / 300})`;

  // Farben anpassen
  player1HealthBar.style.background = player1.health > 60
    ? "linear-gradient(90deg, rgba(80,80,80,1) 0%, rgba(50,157,0,1) 56%)"
    : player1.health > 30
    ? "linear-gradient(90deg, rgba(80,80,80,1) 0%, rgba(255,149,0,1) 56%)"
    : "linear-gradient(90deg, rgba(80,80,80,1) 0%, rgba(167,0,0,1) 64%)";

  player2HealthBar.style.background = player2.health > 60
    ? "linear-gradient(270deg, rgba(80,80,80,1) 0%, rgba(50,157,0,1) 56%)"
    : player2.health > 30
    ? "linear-gradient(270deg, rgba(80,80,80,1) 0%, rgba(255,149,0,1) 56%)"
    : "linear-gradient(270deg, rgba(80,80,80,1) 0%, rgba(167,0,0,1) 64%)";
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
  ctx.fillText(`isBlocking: ${player.isBlocking}`, player.x, player.y - 40);
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
    drawHitbox(player1.defenderHitbox, "blue"); // Defender-Hitbox in Blau
    drawHitbox(player2.defenderHitbox, "blue");
    drawHitbox(player1.attackHitbox, "red");    // Attack-Hitbox in Rot
    drawHitbox(player2.attackHitbox, "red");

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
// const pause = document.getElementById("pause");
// pause.addEventListener("click", () => {
//   isPaused = !isPaused;
//   pause.textContent = isPaused ? "play" : "pause";
// });



const pause = document.getElementById('pause')
pause.addEventListener('click', pauseGame);

function pauseGame() {
  if (!isPaused) {
    // Create a pause overlay instead of replacing the entire container
    const pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-screen';
    pauseOverlay.innerHTML = `
      <h1>PAUSED</h1>
      <button id="resume">resume</button>
      <button id="restart">restart</button>
      <button id="quit">quit</button>
    `;
    pauseOverlay.style.position = 'absolute';
    pauseOverlay.style.top = '0';
    pauseOverlay.style.left = '0';
    pauseOverlay.style.width = '100%';
    pauseOverlay.style.height = '100%';
    pauseOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    pauseOverlay.style.display = 'flex';
    pauseOverlay.style.flexDirection = 'column';
    pauseOverlay.style.justifyContent = 'center';
    pauseOverlay.style.alignItems = 'center';
    pauseOverlay.style.zIndex = '1000';

    document.getElementById('game-container').appendChild(pauseOverlay);
    pause.textContent = 'play';
    isPaused = true;
  } else {
    // Remove only the pause screen, keeping the game container intact
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
      pauseScreen.remove();
    }
    pause.textContent = "pause";
    isPaused = false;
  }
}

// Modify the event listener to work with the new pause overlay
document.getElementById('game-container').addEventListener('click', (e) => {
  if (e.target.id === 'resume') {
    pauseGame(); // This will remove the pause screen
  } else if (e.target.id === 'restart') {
    location.href = 'index.html'; // da es statisch is wird das spiel neu gestarten / not the best way
  }else if (e.target.id === "quit"){
    console.log("i am quitting");
    window.location.href = "loading.html"
  }
});