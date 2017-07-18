import Element from './Element';

export default class Footer extends Element {
    get height() {
        return 20;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(2, 2);
        this.context.lineTo(2, this.height-2);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(2, 2);
        this.context.lineTo(this.width-2, 2);
        this.context.stroke();
        this.context.restore();

        //
        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo(this.width-2, this.height-2);
        this.context.lineTo(2, this.height-2);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo(this.width-2, this.height-2);
        this.context.lineTo(this.width-2, 2);
        this.context.stroke();
        this.context.restore();

        super.draw();

    }
}
