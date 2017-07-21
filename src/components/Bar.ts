import Node from '../elements/Node';

export default class Bar extends Node {
    get width() {
        return 200;
    }

    get height() {
        return 23;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();

        this.drawBorder({x: 2, y:2, height: this.height-4, width: 3});

        super.draw(x, y);
    }
}
