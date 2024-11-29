const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;


class player {
    constructor(x, y, velocityX = 0, velocityY = 0, grounded = true) {
        // positioning
        this.x = x,
        this.y = y,

        // Groesse
        this.height = 200,
        this.width = 200,

        // speedy
        this.velocityX = velocityX,
        this.velocityY = velocityY,

        // jumped?

        this.grounded = grounded

    }
}


// imgage loading

function loadImages(src) {
    const img = new Image();
    img.src = src;
    return img;
}
