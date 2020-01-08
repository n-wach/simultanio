let canvas: HTMLCanvasElement;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function draw() {
    //TODO: Put game here
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(0, 50, canvas.width, canvas.height / 2);
    ctx.fillStyle = "blue";
    ctx.fillRect(300, 0, canvas.width / 3, canvas.height);
}

window.addEventListener("load", function() {
    console.log(
        "   _____ _                 _ _                _       \n" +
        "  / ____(_)               | | |              (_)      \n" +
        " | (___  _ _ __ ___  _   _| | |_ __ _ _ __    _  ___  \n" +
        "  \\___ \\| | '_ ` _ \\| | | | | __/ _` | '_ \\  | |/ _ \\ \n" +
        "  ____) | | | | | | | |_| | | || (_| | | | |_| | (_) |\n" +
        " |_____/|_|_| |_| |_|\\__,_|_|\\__\\__,_|_| |_(_)_|\\___/\n");
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
});
