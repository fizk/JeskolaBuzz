import NodeElement from '../elements/Element';
import {ELEMENT_TYPE} from '../types/ElementType';

export default class Application extends NodeElement {
    constructor() {
        super();
        this.type = ELEMENT_TYPE.BLOCK
    }

    set width(width) {
        this.elementWidth = width;
    }

    get width() {
        return this.elementWidth;
    }

    set height(height) {
        this.elementHeight = height;
    }

    get height() {
        return this.elementHeight;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.fillRect(0, 0, this.width, this.height);
        super.draw();
        this.context.restore();
    }
}
