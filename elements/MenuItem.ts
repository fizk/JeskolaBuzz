import Element from './Element';

export default class MenuItem extends Element {
    label: string;

    constructor(label: string) {
        super();
        this.label = label;
    }

    get height() {
        return 20;
    }

    get width() {
        return 300;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = 'black';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.label, 6, 15);
        this.context.restore();
    }
}
