import {Game} from './gfx/Game'
import {IntroScene} from "./scenes/IntroScene";

function resizeCanvas() {
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
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
    Game.setScene(new IntroScene());

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    loop();
});
