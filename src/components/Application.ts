import Node from '../elements/Node';

export default class Application extends Node {

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.fillRect(0, 0, this.width, this.height);
        super.draw(x, y);
        this.context.restore();
    }
}
