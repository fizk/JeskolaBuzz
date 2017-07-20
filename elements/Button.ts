import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import Text from "./Text";

export default class Button extends Node {
    text: string;
    active: boolean = false;

    constructor(text: string) {
        super();
        this.type = NOTE_TYPE.IN_LINE;
        this.text = text;
        this.nodeHeight = 19;
    }

    get width(): number {
        return new Text(this.text).width;
    }

    get height(): number {
        return 20;
    }

    draw(x: number = 0, y: number = 0): void {

        this.addChild(new Text(this.text));

        this.context.save();

        if (this.active) {
            this.drawBorder({x: 0, y: 0, width: this.width, height: this.height}, true);
        }

        super.draw(x, y);




        this.context.restore();
    }
}
