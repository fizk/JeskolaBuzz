import Node from './Node';
import {Point} from '../types/Point';

export default class Window extends Node {

    constructor(position: Point = {x: 0, y: 0}) {
        super();
        this.position = position;
    }

    background(width, height) {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.shadowColor = 'gray';
        this.context.shadowOffsetY = 2;
        this.context.shadowOffsetX = 1;
        this.context.shadowBlur = 3;
        this.context.fillRect(0, 0, width, height);

        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();
        const width: number = Math.max(...this.children.map(child => {
            return child.width || 0;
        }));

        this.background(width+4, this.height + 8);
        this.drawBorder({x: 2, y:2, width: width+4, height: this.height+8});

        this.context.translate(2, 4);
        super.draw(x, y);
        this.context.restore();


    }
}
