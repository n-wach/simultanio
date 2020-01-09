import {Game} from './gfx/Game'
import {IntroScene} from "./scenes/IntroScene";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export let socket: Socket;

function resizeCanvas() {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
}

function draw() {
    Game.render();
}

window.addEventListener("load", function() {
    console.log(
        "   _____ _                 _ _                _       \n" +
        "  / ____(_)               | | |              (_)      \n" +
        " | (___  _ _ __ ___  _   _| | |_ __ _ _ __    _  ___  \n" +
        "  \\___ \\| | '_ ` _ \\| | | | | __/ _` | '_ \\  | |/ _ \\ \n" +
        "  ____) | | | | | | | |_| | | || (_| | | | |_| | (_) |\n" +
        " |_____/|_|_| |_| |_|\\__,_|_|\\__\\__,_|_| |_(_)_|\\___/\n");
    socket = io();
    socket.on("connect", function() {
        console.log("Websocket Connected");
    });

    Game.initialize();
    Game.scene = new IntroScene();

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
});
