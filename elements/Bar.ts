import Element from './Element';

export default class Bar extends Element {
    get width() {
        return 200;
    }

    get height() {
        return 23;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.fillRect(0, 0, 200, this.height);
        this.context.restore();

        //top
        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(2, 2);
        this.context.lineTo(2, 19);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(2, 2);
        this.context.lineTo(5, 2);
        this.context.stroke();
        this.context.restore();

        //
        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(5, 19);
        this.context.lineTo(2, 19);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(5, 19);
        this.context.lineTo(5, 2);
        this.context.stroke();
        this.context.restore();

        super.draw();
    }
}
