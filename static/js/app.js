var ws = null;
var wsurl = "ws://127.0.0.1:8080/ws";
var backend = undefined;

window.onload = function() {

    ws = new WebSocket(wsurl);

    backend = new Backend(ws);

    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    player = new Player([20, 20], 100, 4)
    player.draw(context);
    backend.onOpen = function() {
        backend.send('register', player);

        gameLoop();
    }
};

function Backend(ws) {
    this.ws = ws;

    var self = this;

    ws.onopen = function() {
        ws.send('ping');
        self.onOpen();
        console.log("connected to " + wsurl);
    }

    ws.onclose = function(e) {
        console.log("connection closed (" + e.code + ")");
    }

    ws.onmessage = function(e) {
        console.log("message received: " + e.data);
    }
}

Backend.prototype.onOpen = function(){}

Backend.prototype.send = function(method, args) {
    var request = {
        method: method,
        args: args
    };

    jsonRequest = JSON.stringify(request);
    console.log("Request: ", jsonRequest);
    ws.send(jsonRequest);
}