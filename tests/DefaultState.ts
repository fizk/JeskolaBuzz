import {State} from "../src/types/State";
import {View} from "../src/types/View";

const DefaultState: State = {
    modules: new Map(),
    selectedModule: 0,
    tempConnection: {
        from: {x: 0, y: 0},
        to: {x: 0, y: 0},
    },
    moduleContextMenu: {
        position: {x: 0, y: 0},
        module: {
            key: 0,
            position: {x: 0, y: 0},
            type: null,
            label: '',
            ref: [],
            asdr: {
                a: 0,
                s: 0,
                d: 0,
                r: 0,
            }
        }
    },
    view: View.Machine,
    sequenceNumber: 0,
    patterns: new Map(),
    sequence: [],
    sequenceEditorPosition: {x: 0, y: 0},
    patternEditorPosition: {x: 0, y: 0},
    pattenEditorGenerator: 0,
    pattenEditorPattern: 0,
    contextMenus: new Map(),
};

export default DefaultState;
