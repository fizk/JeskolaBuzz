import Node from './Node';
import {ModuleType} from "../types/ModuleType";
import {Module} from "../types/Module";
import {Point} from "../types/Point";

export default class ModuleNode extends Node {
    module: Module;

    constructor(module: Module, position: Point) {
        super();
        this.module = module;
        this.position = position;
    }
    get height() {
        return 50;
    }

    get width() {
        return 100;
    }

    draw(x: number = 0, y: number = 0) {
        this.context.save();

        const types = {
            [ModuleType.MASTER]: '#c6bdab',
            [ModuleType.GEN]: '#a8adcb',
            [ModuleType.FX]: '#c5ada9',
        };

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, 100, 50);

        this.context.fillStyle = types[this.module.type];
        this.context.fillRect(1, 1, 98, 48);

        this.context.fillStyle = 'black';
        this.context.fillText(this.module.label, 50-(this.context.measureText(this.module.label).width/2), 25);

        super.draw(x, y);

        this.context.restore();
    }
}
