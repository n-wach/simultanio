import {Game} from './gfx/Game'
import {LobbyScene} from "./scenes/LobbyScene";
import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export let socketio: Socket = io();
console.log("Socket IO", socketio);

function resizeCanvas() {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    loop();
}

function loop() {
    Game.update();
    Game.render();
    window.requestAnimationFrame(loop);
}

window.addEventListener("load", function() {
    console.log(
        "   _____ _                 _ _                _       \n" +
        "  / ____(_)               | | |              (_)      \n" +
        " | (___  _ _ __ ___  _   _| | |_ __ _ _ __    _  ___  \n" +
        "  \\___ \\| | '_ ` _ \\| | | | | __/ _` | '_ \\  | |/ _ \\ \n" +
        "  ____) | | | | | | | |_| | | || (_| | | | |_| | (_) |\n" +
        " |_____/|_|_| |_| |_|\\__,_|_|\\__\\__,_|_| |_(_)_|\\___/\n");

    Game.initialize();
    Game.setScene(new LobbyScene(socketio));
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    loop();
});
