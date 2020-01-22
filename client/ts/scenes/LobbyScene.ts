import {Scene} from "../gfx/Scene";
import {Sprite} from "../gfx/Sprite";
import {Vec2} from "../gfx/Vec2";
import { RenderCanvas } from "../gfx/RenderCanvas";
import {Game} from "../gfx/Game";
import {Match, MatchList, MatchListing} from "../comms";
import {Button} from "../gfx/ui/Button";

export class LobbyScene extends Scene {
    socketio: SocketIOClient.Socket;

    constructor(socketio: SocketIOClient.Socket) {
        super();
        this.socketio = socketio;
        this.socketio.on("list matches", (matchList: MatchList) => {
            this.add(new Button("Create Match", 100, 20, 400, 70, () => {
                this.socketio.emit("create match");
            }));
            for (let i = 0; i < matchList.matches.length; i++) {
                let x = 100;
                let y = 100 + i * 80;
                let match = matchList.matches[i];
                this.add(new Button("Join " + match.name + " (" + match.player_count + "/" + match.max_player + " players)",
                    x, y, 400, 70, () => {
                        this.socketio.emit("join match", match.id);
                    }));
            }
        });
        this.socketio.on("join match", function (match: Match) {
            //add game scene passing match and socketio
        });
    }

    initialize(): void {
        super.initialize();

        let sqr = new Sprite();
        let tex = new RenderCanvas(16, 16);
        let ctx = tex.get2dContext();
        ctx.fillRect(0, 0, 16, 16);
        sqr.graphic = tex.toBitmap();
        sqr.pos = new Vec2(10, 10);

        console.log('yee');
        console.log(sqr.graphic);

        this.add(sqr);
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }
}