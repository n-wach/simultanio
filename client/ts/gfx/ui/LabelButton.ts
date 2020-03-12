import Button from "./Button";
import Label from "./Label";

export default class LabelButton extends Button {
    constructor(text: string, align: CanvasTextAlign = "center", onclick?: () => void, color?: string) {
        super(new Label(text, align, color), onclick);
    }
}
