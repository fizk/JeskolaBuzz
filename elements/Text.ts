import Node from './Node';
import {NOTE_TYPE} from '../types/NOTE_TYPE';

export default class Text extends Node {
    text: string;

    constructor(text: string) {
        super();
        this.type = NOTE_TYPE.IN_LINE;
        this.text = text;
        this.nodeHeight = 19;
    }

    get width(): number {
        if (!this.context) { //todo this is such a hack
            const tmpCanvas = document.createElement('canvas');
            return Math.round(tmpCanvas.getContext('2d').measureText(this.text).width + 12);
        } else {
            return Math.round(this.context.measureText(this.text).width + 12);
        }
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = 'black';
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.text, 4, 16);
        this.context.restore();

        super.draw(x, y);
    }
}
