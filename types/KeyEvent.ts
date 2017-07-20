import Node from '../elements/Node';

export interface KeyEvent {
    type: string;
    value: string,
    target: Node;
    shiftKey: boolean;
    ctrlKey: boolean;
}
