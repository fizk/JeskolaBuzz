import Node from '../elements/Node';

export interface Event {
    offsetY: number;
    offsetX: number;
    type: string;
    target: Node;
    shiftKey: boolean;
    ctrlKey: boolean;
}
