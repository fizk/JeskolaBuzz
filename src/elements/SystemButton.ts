import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import Text from "./Text";
import {COLOR} from "../types/COLOR";

export default class SystemButton extends Node {
    text: string;

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
        return 28;
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();


        this.context.save();
        this.context.fillStyle = COLOR.TEXT;
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.text, 4, 19);
        this.context.restore();

        super.draw(x, y);




        this.context.restore();
    }
}
