import Node from './Node';

export default class Divider extends Node {

    get height() {
        return 2;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(this.width, 0);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(0, 1);
        this.context.lineTo(this.width, 1);
        this.context.stroke();
        this.context.restore();

        super.draw(x, y);
    }
}
