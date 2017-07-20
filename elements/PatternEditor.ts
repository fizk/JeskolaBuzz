import Node from './Node';
import PatternRow from "./PatternRow";
import PatternColumnCount from "./PatternColumnCount";
import PatternColumn from "./PatternColumn";
import {KeyEvent} from "../types/KeyEvent";
import LetterMap from "../types/LetterMap";
import {View} from "../types/View";
import {Pattern} from "../types/Pattern";

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

    draw(x: number = 0, y: number = 0): void {
        this.context.save();

        if(this.state.patterns.has(this.state.pattenEditorPattern)) {
            const pattern: Pattern = this.state.patterns.get(this.state.pattenEditorPattern);
            pattern.pattern.forEach((note, index) => {
                const row: PatternRow = new PatternRow();
                this.addChild(row);

                const countColumn: PatternColumnCount = new PatternColumnCount(index);
                row.addChild(countColumn);

                const noteColumn: PatternColumn = new PatternColumn(note || '...');
                noteColumn.hightlight = !(index % 4);
                noteColumn.isSelected = (index === this.state.patternEditorPosition.y);
                row.addChild(noteColumn);
            });
        }

        this.drawBackground(this.width, this.height);
        this.drawBorder({x: 4, y:4, width: this.width-4, height: this.height-4}, true);

        this.context.translate(5, 5);
        super.draw(x+5, y+5);

        this.context.restore();
    }
}
