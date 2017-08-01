import Node from '../elements/Node';
import PatternRow from "../elements/PatternRow";
import PatternColumnCount from "../elements/PatternColumnCount";
import PatternColumn from "../elements/PatternColumn";
import {KeyEvent} from "../types/KeyEvent";
import LetterMap from "../types/LetterMap";
import {View} from "../types/View";
import {Pattern} from "../types/Pattern";
import {Point} from "../types/Point";

export default class PatternEditor extends Node {

    constructor() {
        super();

        this.handleEnterKey = this.handleEnterKey.bind(this);
        this.handleArrowDown = this.handleArrowDown.bind(this);
        this.handleArrowUp = this.handleArrowUp.bind(this);
        this.handleLetterKey = this.handleLetterKey.bind(this);
        this.handleNumberKey = this.handleNumberKey.bind(this);

        this.addEventListener('enter', this.handleEnterKey);
        this.addEventListener('arrowDown', this.handleArrowDown);
        this.addEventListener('arrowUp', this.handleArrowUp);
        this.addEventListener('letter', this.handleLetterKey);
        this.addEventListener('number', this.handleNumberKey);
    }

    handleEnterKey(event: KeyEvent) {
        this.state.view = View.Sequence;
    }

    handleArrowDown(event: KeyEvent) {
        this.state.patternEditorPosition = {
            x: this.state.patternEditorPosition.x,
            y: this.state.patternEditorPosition.y + 1,
        }
    }

    handleArrowUp(event: KeyEvent) {
        this.state.patternEditorPosition = {
            x: this.state.patternEditorPosition.x,
            y: this.state.patternEditorPosition.y - 1,
        }
    }

    handleLetterKey(event: KeyEvent) {
        this.state.patterns.get(this.state.pattenEditorPattern).pattern[this.state.patternEditorPosition.y] = LetterMap[event.value];
        this.state.patternEditorPosition = {
            x: this.state.patternEditorPosition.x,
            y: this.state.patternEditorPosition.y + 1,
        }
    }

    handleNumberKey(event: KeyEvent) {
        const currentNote = this.state.patterns.get(this.state.pattenEditorPattern).pattern[this.state.patternEditorPosition.y];
        if(currentNote) {

            this.state.patterns.get(this.state.pattenEditorPattern).pattern[this.state.patternEditorPosition.y] = currentNote.slice(0, -1) + event.value;;
            this.state.patternEditorPosition = {
                x: this.state.patternEditorPosition.x,
                y: this.state.patternEditorPosition.y + 1,
            }
        }
    }

    drawBackground(width: number, height: number) {
        this.context.save();
        this.context.fillStyle = '#dad6c9';
        this.context.fillRect(0, 0, width, height);
        this.context.restore();
    }

    getHeaderRow(): PatternRow {
        const headRow: PatternRow = new PatternRow();
        const headCountColumn: PatternColumnCount = new PatternColumnCount('');
        const headNoteColumn: PatternColumn = new PatternColumn('');
        headRow.setChildren([headCountColumn, headNoteColumn]);

        return headRow;
    }

    getPatternRows(pattern: Pattern, position: Point): PatternRow[] {
        return pattern.pattern.map((note, index) => {
            const row: PatternRow = new PatternRow();
            const countColumn: PatternColumnCount = new PatternColumnCount(index);
            const noteColumn: PatternColumn = new PatternColumn(note || '...');
            noteColumn.hightlight = !(index % 4);
            noteColumn.isSelected = (index === position.y);
            row.setChildren([countColumn, noteColumn]);
            return row;
        });
    }

    draw(x: number = 0, y: number = 0): void {
        this.setChild(this.getHeaderRow());

        if(this.state.patterns.has(this.state.pattenEditorPattern)) {
            this.addChildren(this.getPatternRows(
                this.state.patterns.get(this.state.pattenEditorPattern),
                this.state.patternEditorPosition
            ));
        }

        this.drawBackground(this.width, this.height);
        this.drawBorder({x: 4, y:4, width: this.width-4, height: this.height-4}, true);

        this.context.save();
        this.context.translate(5, 5);
        super.draw(x+5, y+5);
        this.context.restore();
    }
}
