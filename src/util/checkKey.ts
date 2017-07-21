import Application from "../components/Application";
import Queue from "./Queue";
import Node from "../elements/Node";
import {KeyEvent} from "../types/KeyEvent";

export default (event: KeyboardEvent, type: string, application: Application) => {
    const queue = new Queue();
    let e: KeyEvent = undefined;
    let callbackArray: ((event: KeyEvent) => void)[] = [];

    queue.enqueue(application);
    while (!queue.isEmpty()) {
        let current: Node = queue.dequeue();

        if (current && current.events[type].length > 0) {
            e = {
                type: type,
                target: current,
                value: event.key,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
            };
            callbackArray = current.events[type];
        }


        if(current) {
            current.children.forEach(child => {
                queue.enqueue(child);
            });
        }

    }

    callbackArray.forEach(cb => {
        cb(e);
    })
}
