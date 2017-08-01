import {NOTE_TYPE} from '../types/NOTE_TYPE';
import {Dimension} from "../types/Dimension";
import {Event} from '../types/Event';
import {KeyEvent} from '../types/KeyEvent';
import {Point} from "../types/Point";
import {COLOR} from "../types/COLOR";
import {State} from "../types/State";

export default class Node {
    children: Node[] = [];
    parent: Node = undefined;
    type: NOTE_TYPE = NOTE_TYPE.BLOCK;
    nodeWidth: number = 0;
    nodeHeight: number = 0;
    context: any = undefined;
    dimensions: Dimension;
    events: {
        mousedown: ((event: Event) => void)[],
        mousemove: ((event: Event) => void)[],
        mouseup: ((event: Event) => void)[],
        arrowDown: ((event: KeyEvent) => void)[],
        arrowUp: ((event: KeyEvent) => void)[],
        arrowLeft: ((event: KeyEvent) => void)[],
        arrowRight: ((event: KeyEvent) => void)[],
        contextmenu: ((event: KeyEvent) => void)[],
        enter: ((event: KeyEvent) => void)[],
        letter: ((event: KeyEvent) => void)[],
        number: ((event: KeyEvent) => void)[],
    } = {
        mousedown: [],
        mousemove: [],
        mouseup: [],
        arrowDown: [],
        arrowUp: [],
        arrowLeft: [],
        arrowRight: [],
        contextmenu: [],
        enter: [],
        letter: [],
        number: []
    };
    honorWidth: boolean = false;
    honorHeight: boolean = false;
    state: State;
    absolute: boolean = false;
    position: Point = {x: 0, y: 0};


    set height(height: number) {
        this.honorHeight = true;
        this.nodeHeight = height;
    }

    get height(): number {
        if(this.honorHeight) {
            return this.nodeHeight;
        }

        if (this.children.length === 0) {
            return this.nodeHeight;
        }

        let currentHeight = 0;
        let inlineHeightArray = [0];

        this.children.forEach((child, index, collection) => {
            if(child.type === NOTE_TYPE.BLOCK) {
                currentHeight += child.height;
            } else if(child.type === NOTE_TYPE.IN_LINE) {
                inlineHeightArray.push(child.height);
            }

            if (child.type === NOTE_TYPE.BLOCK || (collection.length === index + 1)) {
                currentHeight += Math.max(...inlineHeightArray);
                inlineHeightArray = [0];
            }
        });

        return currentHeight;
    }

    set width(width: number) {
        this.honorWidth = true;
        this.nodeWidth = width;
    }

    get width(): number {
        if(this.honorWidth) {
            return this.nodeWidth;
        }

        if (this.type === NOTE_TYPE.BLOCK) {
            if (this.parent) {
                return this.parent.width;
            } else {
                return 0;
            }
        } else if (this.type === NOTE_TYPE.IN_LINE) {
            return this.nodeWidth;
        }

    }

    addChild(node: Node) {
        node.parent = this;
        this.children.push(node);
    }

    addChildren(nodes: Node[]) {
        this.children.concat(this.children, nodes.map(this.addChild.bind(this)));
    }

    setChild(node: Node) {
        node.parent = this;
        this.children = [node];
    }

    setChildren(nodes: Node[]) {
        this.children = nodes.map(node => {
            node.parent = this;
            return node;
        });
    }

    addEventListener(type: string, callback: (event: any) => void) {
        this.events[type].push(callback);
    }

    drawBorder(dimensions: Dimension, active: boolean = false) {
        this.context.save();

        this.context.strokeStyle = active ? COLOR.BORDER_DARK: COLOR.BORDER_LIGHT;

        this.context.beginPath();
        this.context.moveTo(dimensions.x, dimensions.y);
        this.context.lineTo(dimensions.width, dimensions.y);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(dimensions.x, dimensions.y);
        this.context.lineTo(dimensions.x, dimensions.height);
        this.context.stroke();

        this.context.strokeStyle = active ? COLOR.BORDER_LIGHT : COLOR.BORDER_DARK;

        this.context.beginPath();
        this.context.moveTo(dimensions.width, dimensions.height);
        this.context.lineTo(dimensions.width, dimensions.y);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(dimensions.width, dimensions.height);
        this.context.lineTo(dimensions.x, dimensions.height);
        this.context.stroke();

        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {
        let offsetY = 0;
        let offsetX = 0;
        let lastChild: Node = undefined;
        this.children.filter((child: Node) => child !== undefined).forEach((child: Node) => {
            this.context.save();
            if (child.absolute) {
                this.context.translate(child.position.x, child.position.y);
                child.context = this.context;
                child.draw(x + child.position.x, y + child.position.y);
            } else {
                if(lastChild && lastChild.type === NOTE_TYPE.BLOCK) {
                    offsetY += lastChild.height;
                    offsetX = 0;
                } else if (lastChild && lastChild.type === NOTE_TYPE.IN_LINE && child.type == NOTE_TYPE.IN_LINE) {
                    offsetX += lastChild.width;
                } else if (lastChild && lastChild.type === NOTE_TYPE.IN_LINE && child.type == NOTE_TYPE.BLOCK) {
                    offsetX = 0;
                    offsetY += lastChild.height;
                }

                this.context.translate(offsetX, offsetY);
                child.context = this.context;
                child.draw(x + offsetX, y + offsetY);
            }



            lastChild = child;

            this.context.restore();
        });

        this.dimensions = {x: x, y: y, height: this.height, width: this.width};
    }
}
