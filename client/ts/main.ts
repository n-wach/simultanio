import Game from './gfx/Game'
import LobbyScene from "./scenes/LobbyScene";
import Simul from "./Simul";

function resizeCanvas() {
    let ratio = pixel_ratio();
    Game.pixelRatio = ratio;
    Game.canvas.width = window.innerWidth * ratio;
    Game.canvas.height = window.innerHeight * ratio;
    Game.width = window.innerWidth;
    Game.height = window.innerHeight;
    Game.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (Game.scene) Game.scene.resize();
}

function pixel_ratio() {
    let ctx = Game.ctx;
    let dpr = window.devicePixelRatio || 1;

    // @ts-ignore
    let bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio ||
        // @ts-ignore
        ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio ||
        // @ts-ignore
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}

let lastTime = new Date().getTime();

function loop() {
    let thisTime = new Date().getTime();
    let dt = (thisTime - lastTime) / 1000;
    lastTime = thisTime;
    Simul.update(dt);
    Game.update(dt);
    Game.render();
    window.requestAnimationFrame(loop);
}

console.log(
    "   _____ _                 _ _                _       \n" +
    "  / ____(_)               | | |              (_)      \n" +
    " | (___  _ _ __ ___  _   _| | |_ __ _ _ __    _  ___  \n" +
    "  \\___ \\| | '_ ` _ \\| | | | | __/ _` | '_ \\  | |/ _ \\ \n" +
    "  ____) | | | | | | | |_| | | || (_| | | | |_| | (_) |\n" +
    " |_____/|_|_| |_| |_|\\__,_|_|\\__\\__,_|_| |_(_)_|\\___/\n");

Game.initialize();
Game.setScene(new LobbyScene());

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
loop();
console.log("Game:", Game);
