import Node from './Node';

export default class SequenceRow extends Node {
    get height() {
        return 20;
    }

    draw(x: number = 0, y: number = 0): void {

        // this.context.strokeStyle = '#000000';
        // this.context.beginPath();
        // this.context.moveTo(0, this.height);
        // this.context.lineTo(this.width, this.height);
        // this.context.stroke();

        super.draw(x, y);
    }
}
