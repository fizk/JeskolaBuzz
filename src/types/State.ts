import {Point} from './Point';
import {View} from './View';
import {Pattern} from './Pattern';
import {Module} from "./Module";

export interface State {
    modules: Map<number, Module>,
    selectedModule: number,
    tempConnection: {
        from: Point;
        to: Point;
    },
    moduleContextMenu: {
        position: Point,
        module: Module
    };
    view: View;
    sequenceNumber: number,
    patterns: Map<number, Pattern>,
    sequence: any[],
    sequenceEditorPosition: Point;
    patternEditorPosition: Point;
    pattenEditorGenerator: number;
    pattenEditorPattern: number;
    contextMenus: Map<string, any>;
}
