import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class SequenceColumn extends Node {
    label: string;
    isSelected: boolean = false;

    constructor(label) {
        super();
        this.type = NOTE_TYPE.IN_LINE;
        this.label = label;
    }

    get height() {
        return 20;
    }

    get width() {
        return 50;
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();
        // this.context.strokeStyle = '#000000';
        //
        // this.context.beginPath();
        // this.context.moveTo(this.width, 0);
        // this.context.lineTo(this.width, this.height);
        // this.context.stroke();

        this.context.fillStyle = this.isSelected ? 'black' : '#dad6ca';
        this.context.fillRect(0, 0, 50, 20);

        this.context.fillStyle = this.isSelected ? 'white' : 'black';
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.label, 4, 16);

        this.context.restore();

        super.draw(x, y);
    }
}
