import Element from './Element';
import {Point} from '../types/Point';

export default class Window extends Element {

    constructor(position: Point = {x: 0, y: 0}) {
        super();
        this.position = position;
        this.elementDimension.x = position.x;
        this.elementDimension.y = position.y;
    }

    background(width, height) {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.shadowColor = 'gray';
        this.context.shadowOffsetY = 5;
        this.context.shadowOffsetX = 5;
        this.context.shadowBlur = 5;
        this.context.fillRect(0, 0, width, height);

        this.context.restore();
    }

    border(width, height) {
        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo(1, 1);
        this.context.lineTo(width-1, 1);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo(1, 1);
        this.context.lineTo(1, height-1);
        this.context.stroke();
        this.context.restore();


        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(width-1, height-1);
        this.context.lineTo(1, height-1);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(width-1, height-1);
        this.context.lineTo(width-1, 1);
        this.context.stroke();
        this.context.restore();


        this.context.save();
        this.context.strokeStyle = '#333333';
        this.context.beginPath();
        this.context.moveTo(0, height);
        this.context.lineTo(width, height);
        this.context.moveTo(width, height);
        this.context.lineTo(width, 0);
        this.context.stroke();
        this.context.restore();
    }

    draw() {
        const widthValues = this.children.map(child => {
            return child.width;
        });
        const heightValues = this.children.map(child => {
            return child.height;
        });
        const width = Math.max(...widthValues);
        const height = heightValues.reduce((a, b) => {
            return a + b;
        }, 0);


        if(this.absolute) {
            this.context.save();
            this.context.translate(this.position.x, this.position.y);
        }

            this.context.save();
            this.background(width+8, height+8);
            this.border(width+8, height+8);
            this.context.translate(4, 4);
            super.draw();
            this.context.restore();

        if(this.absolute) {
            this.context.restore();
        }
    }
}
