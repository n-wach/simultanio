import {Game} from './gfx/Game'
import {LobbyScene} from "./scenes/LobbyScene";

function resizeCanvas() {
    let ratio = pixel_ratio();
    Game.canvas.width = window.innerWidth * ratio;
    Game.canvas.height = window.innerHeight * ratio;
    Game.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function pixel_ratio() {
    let ctx = Game.ctx;
    let dpr = window.devicePixelRatio || 1;

    // @ts-ignore
    let bsr = ctx.webkitBackingStorePixelRatio ||
    // @ts-ignore
              ctx.mozBackingStorePixelRatio ||
    // @ts-ignore
              ctx.msBackingStorePixelRatio ||
    // @ts-ignore
              ctx.oBackingStorePixelRatio ||
    // @ts-ignore
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
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
    Game.setScene(new LobbyScene());
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    loop();
    console.log("Game:", Game);
});
