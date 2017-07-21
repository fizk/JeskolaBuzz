import {Point} from './Point';

export interface Module {
    key: number,
    position: Point;
    type: any;
    label: string;
    ref: number[];
    asdr: {
        a: number;
        s: number;
        d: number;
        r: number;
    }
}
