var ws = null;
var wsurl = "ws://127.0.0.1:8080/ws";
var backend = undefined;

window.onload = function() {

    ws = new WebSocket(wsurl);

    backend = new Backend(ws);
    backend.register("register", function(p) {
        if (player == undefined) {
            player = new Player(p.Id, p.Pos, p.Size, p.Speed);
        } else {
            if (p.Id != player.id) {
                players.push(new Player(p.Id, p.Pos, p.Size, p.Speed));
            }
        }
    });

    backend.register("move", function(p) {
        if (player == undefined || p.Id == player.id) {
            return;
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i].id == p.Id) {
                players[i].pos = p.Pos;
                players[i].speed = p.Speed;
            }
        }
    });

    backend.register("gamestate", function(p) {
        players = p
    });

    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    p = new Player(0, [20, 20], 100, 4)
    //p.draw(context);
    backend.onOpen = function() {
        backend.send('register', p);

        gameLoop();
    }
};

function Backend(ws) {
    this.ws = ws;
    this.callbacks = [];

    var self = this;

    ws.onopen = function() {
        //ws.send('ping');
        self.onOpen();
        console.log("connected to " + wsurl);
    }

    ws.onclose = function(e) {
        console.log("connection closed (" + e.code + ")");
    }

    ws.onmessage = function(e) {
        var data = JSON.parse(e.data)
        self.process(data)
        console.log("message received: " + e.data);
    }
}

Backend.prototype.onOpen = function(){}

Backend.prototype.send = function(method, args) {
    var request = {
        method: method,
        player: args
    };

    jsonRequest = JSON.stringify(request);
    console.log("Request: ", jsonRequest);
    ws.send(jsonRequest);
}

Backend.prototype.register = function(method, callback) {
    this.callbacks[method] = callback;
}

Backend.prototype.process = function(data) {
    this.callbacks[data.Method](data.Player)
}