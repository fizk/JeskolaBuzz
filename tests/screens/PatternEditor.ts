import {assert} from 'chai';
import PatternEditor from "../../src/screens/PatternEditor";
import {State} from "../../src/types/State";
import DefaultState from "../DefaultState";
import {Pattern} from "../../src/types/Pattern";
import {Module} from "../../src/types/Module";
import {ModuleType} from "../../src/types/ModuleType";

const context = {
    save: () => {},
    restore: () => {},
    fillRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    translate: () => {},
    fillText: () => {},
};

describe('PatternEditor()', () => {
    describe('', () => {
        it('', () => {
            const modules: Map<number, Module> = new Map();
            modules.set(1, {
                key: 1,
                position: {x: 0, y: 0},
                type: ModuleType.GEN,
                label: 'Master',
                ref: [],
                asdr: {a: 0, s: 0, d: 0, r: 0,}
            });
            const patterns: Map<number, Pattern> = new Map();
            patterns.set(1, {
                key: 1,
                gen: 1,
                label: '00',
                pattern: [
                    undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined,
                ]
            });
            const state: State = Object.assign({}, DefaultState, {
                patterns: patterns,
                modules: modules,
                pattenEditorPattern: 1
            });
            const module = new PatternEditor();
            module.context = context;
            module.state = state;

            module.draw(0, 0);
            assert.equal(module.children.length, 17);
            module.draw(0, 0);
            assert.equal(module.children.length, 17);
            module.draw(0, 0);
            assert.equal(module.children.length, 17);
        })

    })
});
