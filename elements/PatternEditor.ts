import Element from './Element';

export default class PatternEditor extends Element {

    constructor() {
        super();
    }

    draw() {
        this.context.save();
        this.context.fillStyle = '#dad6c9';
        this.context.fillRect(0, 0, this.width, this.height);

        super.draw();

        this.context.restore();
    }
}
