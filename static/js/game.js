var canvas;
var context;
var player;

var players = [];

function gameLoop() {

    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    context.fillStyle="#FFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (player != undefined) {
        player.draw(context);
    }

    for (var i = 0; i < players.length; i++) {
        players[i].draw(context);
    }
}

function update() {
    handleInput();
}

function handleInput() {
    var moved = false;

    if (input.isDown('DOWN') || input.isDown('s')) {
        moved = true;
        player.pos[1] += player.speed;
    }

    if (input.isDown('UP') || input.isDown('w')) {
        moved = true;
        player.pos[1] -= player.speed;
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        moved = true;
        player.pos[0] -= player.speed;
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        moved = true;
        player.pos[0] += player.speed;
    }

    if (moved) {
        backend.send('move', player);
    }
}

function Player(id, pos, size, speed) {
    this.id = id;
    this.pos = pos;
    this.size = size || 20;
    this.speed = speed || 4;
}

Player.prototype.draw = function (context) {
    context.beginPath();
    context.rect(this.pos[0], this.pos[1], this.size, this.size);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 7;
    context.strokeStyle = 'black';
    context.stroke();
};
