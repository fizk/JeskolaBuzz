import {Point} from './Point';
import {View} from './View';
import {Pattern} from './Pattern';
import {Module} from "./Module";

export interface State {
    modules: Map<number, Module>,
    selectedModule: string,
    tempConnection: {
        from: Point;
        to: Point;
    },
    machineContextMenu: Point;
    view: View;
    sequenceNumber: number,
    patterns: Map<number, Pattern>,
    sequence: any[],
    sequenceEditorPosition: Point;
    patternEditorPosition: Point;
    pattenEditorGenerator: number;
    pattenEditorPattern: number;
}
