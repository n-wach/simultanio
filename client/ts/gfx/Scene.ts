import {Sprite} from "./Sprite";

export class Scene {
    sprites: Sprite[] = []

    render(): void {
        // TODO
    }

    addSprite(spr: Sprite): void {
        this.sprites.push(spr)
    }
}