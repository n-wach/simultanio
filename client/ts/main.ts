import {Game} from './gfx/Game'
import {IntroScene} from "./scenes/IntroScene";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export let socket: Socket;

function resizeCanvas() {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    loop();
}

class Button {
    x;
    y;
    w;
    h;
    text;
    onclick;
    hovered = false;

    constructor(text: string, x, y, w, h, onclick?) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.onclick = onclick;
    }
    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        if(this.hovered) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "blue";
        }
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
    }
    handleMove(x, y) {
        this.hovered = this.x < x && x < this.x + this.w && this.y < y && y < this.y + this.h;
    }
    handleClick(x, y) {
        if(this.hovered) {
            this.onclick();
        }
    }
}

function loop() {
    Game.update();
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.render();
    let ctx = Game.ctx;
    for(let button of buttons) {
        button.draw(ctx);
    }
    window.requestAnimationFrame(loop);
}

let inMatch = false;
let currentMatch = null;

let availableMatches = [];

function setupSocket() {
    socket = io();
    console.log("Socket", socket);
    socket.on("list matches", function(lobbies) {
       console.log("Available lobbies", lobbies);
       if(inMatch) return;
       availableMatches = lobbies;
       buttons = [];
       buttons.push(new Button("Create Match", 100, 20, 400, 70, function() {
           socket.emit("create match");
       }));
       for(let i = 0; i < lobbies.length; i++) {
           let x = 100;
           let y = 100 + i * 80;
           buttons.push(new Button("Join " + lobbies[i].name + " (" + lobbies[i].player_count + " players)", x, y, 400, 70, function() {
               socket.emit("join match", lobbies[i].id);
           }));
       }
       draw();
    });
    socket.on("join match", function(match) {
        inMatch = true;
        console.log("Joining ", match);
        currentMatch = match;
        buttons = [new Button("Leave " + match.name, 100, 100, 400, 70, function() {
            inMatch = false;
            socket.emit("leave match");
        })];
        draw();
    });
    socket.on("mousemove", function(message) {
        let x = message.x;
        let y = message.y;
        Game.ctx.fillStyle = message.color;
        Game.ctx.fillRect(x - 5, y - 5, 10, 10);
    });
}

let buttons: Button[] = [];

window.addEventListener("load", function() {
    console.log(
        "   _____ _                 _ _                _       \n" +
        "  / ____(_)               | | |              (_)      \n" +
        " | (___  _ _ __ ___  _   _| | |_ __ _ _ __    _  ___  \n" +
        "  \\___ \\| | '_ ` _ \\| | | | | __/ _` | '_ \\  | |/ _ \\ \n" +
        "  ____) | | | | | | | |_| | | || (_| | | | |_| | (_) |\n" +
        " |_____/|_|_| |_| |_|\\__,_|_|\\__\\__,_|_| |_(_)_|\\___/\n");
    setupSocket();

    Game.initialize();
    Game.setScene(new IntroScene());
    Game.canvas.addEventListener("click", function (event) {
        for(let button of buttons) {
            button.handleClick(event.offsetX, event.offsetY);
            draw();
        }
    });
    Game.canvas.addEventListener("mousemove", function (event) {
        for(let button of buttons) {
            button.handleMove(event.offsetX, event.offsetY);
            draw();
        }
        socket.emit("mousemove", {
            x: event.offsetX,
            y: event.offsetY,
        });
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    loop();
});
