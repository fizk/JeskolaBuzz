import Application from "../components/Application";
import Queue from "./Queue";
import Node from "../elements/Node";
import {Event} from "../types/Event";

export default (event: MouseEvent, type: string, application: Application) => {
    const queue = new Queue();
    let e: Event = undefined;
    let callbackArray: ((event: Event) => void)[] = [];

    queue.enqueue(application);
    while (!queue.isEmpty()) {
        let current: Node = queue.dequeue();
        if(
            (current.dimensions.x < event.clientX && current.dimensions.width+current.dimensions.x> event.clientX ) &&
            (current.dimensions.y < event.clientY && (current.dimensions.height+current.dimensions.y) > event.clientY)
        ) {

            if (current.events[type].length > 0) {
                e = {
                    type: type,
                    target: current,
                    offsetX: event.clientX  - current.dimensions.x,
                    offsetY: event.clientY  - current.dimensions.y,
                    shiftKey: event.shiftKey,
                    ctrlKey: event.ctrlKey,
                };
                callbackArray = current.events[type];
            }
        }

        current.children.forEach(child => {
            queue.enqueue(child);
        });
    }
    callbackArray.forEach(cb => {
        cb(e);
    })
}
