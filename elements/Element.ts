import {Point} from "../types/Point";
import {Dimension} from '../types/Dimension';
import {Event} from '../types/Event';
import {ELEMENT_TYPE} from '../types/ElementType'

export default class Element {
    children: Element[];
    elementParent: Element;
    context: any;
    elementHeight: number;
    elementWidth: number;
    isAbsolute: boolean;
    useOwnHeight: boolean;
    useOwnWidth: boolean;
    elementOffset: Point;
    elementDimension: Dimension;
    events: {
        mousedown: ((event: Event) => void)[],
        mousemove: ((event: Event) => void)[],
        mouseup: ((event: Event) => void)[],
    };
    applicationState: any;
    position: Point;
    type: ELEMENT_TYPE;

    constructor() {
        this.children = [];
        this.context = undefined;

        this.elementHeight = 0;
        this.elementWidth = 0;

        this.isAbsolute = false;
        this.useOwnHeight = false;
        this.useOwnWidth = false;
        this.elementOffset = {x:0, y:0};
        this.elementDimension = {height: 0, width: 0, x: 0, y: 0};

        this.events = {
            mousedown: [],
            mousemove: [],
            mouseup: [],
        };
        this.position = {x:0, y: 0};
        this.type = ELEMENT_TYPE.BLOCK
    }

    get state() {
        return this.applicationState;
    }

    set state(state: any) {
        this.applicationState = state;
    }

    get dimension() {
        return this.elementDimension;
    }
    set dimension(dimension: Dimension) {
        this.elementDimension = dimension;
    }

    get offset(): Point {
        return this.elementOffset;
    }

    set offset(offset: Point) {
        this.elementOffset = offset;
    }

    set absolute(is: boolean) {
        this.isAbsolute = is;
    }
    get absolute() {
        return this.isAbsolute;
    }

    set width(width: number) {
        this.elementWidth = width;
    }

    set parent(parent: Element) {
        this.elementParent = parent;
    }

    get parent(): Element {
        return this.elementParent;
    }

    get width() {
        if(this.useOwnWidth) {
            return this.elementWidth;
        }
        const widthValues = this.children.map(child => {
            return child.width;
        });
        return Math.max(...widthValues);
    }

    set height(height: number) {
        this.elementHeight = height;
    }

    get height() {
        if(this.useOwnHeight) {
            return this.elementHeight;
        }

        const heightValues = this.children.map(child => {
            return child.absolute ? 0 : child.height;
        });
        return heightValues.reduce((a, b) => {
            return a + b;
        }, 0);
    }

    addChild(child: Element) {
        this.children.push(child);
        return this;
    }

    getChildren(): Element[] {
        return this.children;
    }

    addEventListener(type: string, callback: (event: any) => void) {
        this.events[type].push(callback);
    }

    draw() {
        let offsetY = 0;
        this.children.forEach(child => {
            this.context.save();
            this.context.translate(0, offsetY);
            child.context = this.context;
            child.parent = this;

            child.dimension = {x: 0, y: offsetY, width: child.width, height: child.height};
            child.draw();

            offsetY += child.isAbsolute ? 0 : child.height;
            if (child.isAbsolute) {
                child.dimension.x = child.position.x + this.dimension.x;
                child.dimension.y = child.position.y + this.dimension.y + offsetY;
            }
            this.context.restore();
        });

        // this.dimension = {x: this.dimension.x, y: this.dimension.y, height: this.height, width: this.width};
    }
}
