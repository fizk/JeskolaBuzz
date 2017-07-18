import Element from '../elements/Element';

export default class Queue {
    items: Element[];

    constructor() {
        this.items = [];
    }

    enqueue(obj) {
        this.items.push(obj);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    };
}
