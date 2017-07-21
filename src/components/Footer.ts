import Node from '../elements/Node';

export default class Footer extends Node {
    get height() {
        return 20;
    }

    draw(x: number = 0, y: number = 0): void {
        this.drawBorder({x:2, y:2, width: this.width-4, height: this.height-4}, true);

        super.draw(x, y);

    }
}
