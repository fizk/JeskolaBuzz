import Element from '../elements/Element';

export interface Event {
    offsetY: number;
    offsetX: number;
    type: string;
    target: Element;
    shiftKey: boolean;
    ctrlKey: boolean;
}
