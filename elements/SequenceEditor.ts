import Node from './Node';
import SequenceRow from "./SequenceRow";
import SequenceColumn from "./SequenceColumn";
import SequenceColumnCount from "./SequenceColumnCount";
import {ModuleType} from "../types/ModuleType";
import {View} from "../types/View";
import {KeyEvent} from "../types/KeyEvent";
import {Module} from "../types/Module";
import {Pattern} from "../types/Pattern";
import {Point} from "../types/Point";

export default class SequenceEditor extends Node {

    constructor() {
        super();

        this.handleArrowDown = this.handleArrowDown.bind(this);
        this.handleArrowUp = this.handleArrowUp.bind(this);
        this.handleArrowLeft = this.handleArrowLeft.bind(this);
        this.handleArrowRight = this.handleArrowRight.bind(this);
        this.getHandlerForPatternColumn = this.getHandlerForPatternColumn.bind(this);

        this.addEventListener('arrowDown', this.handleArrowDown);
        this.addEventListener('arrowUp', this.handleArrowUp);
        this.addEventListener('arrowLeft', this.handleArrowLeft);
        this.addEventListener('arrowRight', this.handleArrowRight);
    }

    handleArrowDown(event: KeyEvent): void {
        this.state.sequenceEditorPosition = {
            y: this.state.sequenceEditorPosition.y + 1,
            x: this.state.sequenceEditorPosition.x,
        }
    }

    handleArrowUp(event: KeyEvent): void {
        this.state.sequenceEditorPosition = {
            y: this.state.sequenceEditorPosition.y - 1,
            x: this.state.sequenceEditorPosition.x,
        }
    }

    handleArrowLeft(event: KeyEvent): void {
        this.state.sequenceEditorPosition = {
            y: this.state.sequenceEditorPosition.y,
            x: this.state.sequenceEditorPosition.x - 1,
        }
    }

    handleArrowRight(event: KeyEvent): void {
        this.state.sequenceEditorPosition = {
            y: this.state.sequenceEditorPosition.y,
            x: this.state.sequenceEditorPosition.x + 1,
        }
    }

    getHandlerForPatternColumn(module: Module, pattern: Pattern): ((event: any) => void) {
        return event => {
            this.state.pattenEditorGenerator = module.key;
            this.state.pattenEditorPattern = pattern.key;
            this.state.view = View.Pattern;
        }
    }

    getHandlerForEmptyColumn(): ((event: any) => void) {
        return event => {
            console.log(`list of available patterns `);
        }
    }

    getValidModules(modules: Map<number, Module>): Module[] {
        return [...modules.keys()].map(moduleKey => {
            return this.state.modules.get(moduleKey);
        }).filter(module => {
            return module.type === ModuleType.GEN
        })
    }

    getPatternsForSequenceRow(modules: Module[], currentSequence: number[], patterns: Map<number, Pattern>): ({module: Module, pattern: Pattern})[] {
        return modules.map((module: Module) => {
            const currentPattern: number = currentSequence.filter((patternKey: number) => {
                return patterns.get(patternKey).gen == module.key;
            }).reduce((a, b) => b, undefined);

            return currentPattern
                ? {
                    module: module,
                    pattern: patterns.get(currentPattern),
                } : undefined;
        });
    }

    isColumnSelected(statePosition: Point, columnPosition: Point): boolean {
        return statePosition.x === columnPosition.x && statePosition.y == columnPosition.y;
    }

    drawBackground(width: number, height: number): void {
        this.context.save();
        this.context.fillStyle = '#dad6c9';
        this.context.fillRect(0, 0, width, height);
        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();

        const modules: Module[] = this.getValidModules(this.state.modules);

        // HEADER ROW
        const headerSequenceRow: SequenceRow = new SequenceRow();
        this.addChild(headerSequenceRow);
        headerSequenceRow.addChild(new SequenceColumn(''));
        modules.forEach((module: Module) => {
            headerSequenceRow.addChild(new SequenceColumn(module.label));
        });

        //SEQUENCE ROWs
        this.state.sequence.forEach((currentSequence: number[], rowIndex: number) => {
            const row: SequenceRow = new SequenceRow();

            // COUNT COLUMN (on the left)
            this.addChild(row);
            const countColumn: SequenceColumnCount = new SequenceColumnCount(rowIndex * 16);
            countColumn.hightlight = !(rowIndex % 4);
            row.addChild(countColumn);

            //Array of either Object (column has pattern) or undefined (column doesn't have a pattern)
            const modulePatternSequence: ({module: Module, pattern: Pattern})[] = this.getPatternsForSequenceRow(modules,currentSequence, this.state.patterns);

            //PATTERN COLUMNS
            modulePatternSequence.forEach((modulePattern: ({module: Module, pattern: Pattern}), columnIndex: number) => {
                const isSelected: boolean = this.isColumnSelected(this.state.sequenceEditorPosition, {x: columnIndex, y: rowIndex});

                const column: SequenceColumn = new SequenceColumn(modulePattern ? modulePattern.pattern.label : '...');
                column.isSelected = isSelected;
                countColumn.hightlight = !(rowIndex % 4);

                if(modulePattern && isSelected) {
                    column.addEventListener('enter', this.getHandlerForPatternColumn(modulePattern.module, modulePattern.pattern));
                } else if (!modulePattern && isSelected) {
                    column.addEventListener('enter', this.getHandlerForEmptyColumn());
                }

                row.addChild(column);
            });
        });

        this.drawBackground(this.width, this.height);
        this.drawBorder({x: 4, y:4, width: this.width-4, height: this.height-4}, true);
        this.context.translate(5, 5);
        super.draw(x+5, y+5);

        this.context.restore();
    }
}
