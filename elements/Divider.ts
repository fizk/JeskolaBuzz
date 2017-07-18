import Element from './Element';

export default class Divider extends Element {

    get height() {
        return 2;
    }

    set width(width) {
        this.elementWidth = width;
    }

    get width() {
        return this.elementWidth;
    }

    draw() {
        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(this.elementWidth, 0);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(0, 1);
        this.context.lineTo(this.elementWidth, 1);
        this.context.stroke();
        this.context.restore();

        super.draw();
    }
}
