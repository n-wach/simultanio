import {Game} from './gfx/Game'
import {IntroScene} from "./scenes/IntroScene";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export let socket: Socket;

function resizeCanvas() {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    draw();
}

function draw() {
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.render();
    for(let i = 0; i < availableLobbies.length; i++) {
        let lobby = availableLobbies[i];
        Game.ctx.fillText(lobby.name + " (" + lobby.player_count + " players)", 0, 20 + i * 20);
    }
}

let availableLobbies = [];

class Comms {
    listLobbies() {
        socket.emit("list lobbies");
    }

    createLobby(name) {
        socket.emit("create lobby", name);
    }

    joinLobby(lobbyId) {
        socket.emit("join lobby", lobbyId);
    }

    leaveLobby() {
        socket.emit("leave lobby");
    }

    sendMessage(message) {
        socket.emit("send message", message);
    }
}

function setupSocket() {
    socket = io();
    console.log("Socket", socket);
    socket.on("list lobbies", function(lobbies) {
       console.log("Available lobbies", lobbies);
       availableLobbies = lobbies;
       draw();
    });
    socket.on("send message", function(message) {
        console.log("Send message", message);
    });
    console.log("Comms", new Comms());
}

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
    Game.scene = new IntroScene();

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
});
