import Icon from "./Icon";
import Button from "./Button";

export default class IconButton extends Button {
    constructor(src: string, onclick?: () => void) {
        super(new Icon(src), onclick);
    }
}
