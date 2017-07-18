import Element from './Element';

interface SliderOptions {
    min: number;
    max: number;
    value: number;
    label: string;
}

export default class Slider extends Element{
    options: SliderOptions;
    elementPadding: number;
    labelWidth: number;
    buttonWidth: number;

    constructor(options: SliderOptions) {
        super();
        this.options = options;

        this.elementPadding = 5;
        this.elementHeight = 14;
        this.elementWidth = 150;
        this.labelWidth = 50;
        this.buttonWidth = 12;
    }

    get width() {
        return (this.labelWidth * 2) + (this.elementWidth) + (this.elementPadding * 2);
    }

    get height() {
        return this.elementHeight + (this.elementPadding * 2);
    }

    borders() {

        //bottom shadow
        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo((this.elementPadding*2)+this.labelWidth, this.elementPadding+this.elementHeight);
        this.context.lineTo((this.elementPadding*2)+this.labelWidth+this.elementWidth, this.elementPadding+this.elementHeight);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.moveTo((this.elementPadding*2)+this.labelWidth+this.elementWidth, this.elementPadding+this.elementHeight);
        this.context.lineTo((this.elementPadding*2)+this.labelWidth+this.elementWidth, this.elementPadding);
        this.context.stroke();
        this.context.restore();

        //Top shadow
        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo((this.elementPadding*2)+this.labelWidth, this.elementPadding);
        this.context.lineTo((this.elementPadding*2)+this.labelWidth+this.elementWidth, this.elementPadding);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo((this.elementPadding*2)+this.labelWidth, this.elementPadding);
        this.context.lineTo((this.elementPadding*2)+this.labelWidth, this.elementPadding+this.elementHeight);
        this.context.stroke();
        this.context.restore();
    }

    button() {
        //bottom
        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(0, this.elementHeight-2);
        this.context.lineTo(this.buttonWidth, this.elementHeight-2);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#808080';
        this.context.beginPath();
        this.context.moveTo(this.buttonWidth, this.elementHeight-2);
        this.context.lineTo(this.buttonWidth, 0);
        this.context.stroke();
        this.context.restore();

        //top
        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.elementHeight-2);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        this.context.strokeStyle = '#ffff';
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(this.buttonWidth, 0);
        this.context.stroke();
        this.context.restore();
    }

    draw() {

        this.context.save();
        this.context.font = '11px sans-serif';
        this.context.fillStyle = 'black';
        this.context.fillText(this.options.label, 6, 15);
        this.context.restore();

        this.borders();

        const perCent: number = this.options.value / 100;
        const offset: number = perCent * this.elementWidth;

        this.context.save();
        this.context.translate((this.elementPadding*2)+this.labelWidth+offset, this.elementPadding+1);
        this.button();
        super.draw();
        this.context.restore();
    }
}
