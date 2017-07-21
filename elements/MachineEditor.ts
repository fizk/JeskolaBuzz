import Node from './Node';
import Window from '../elements/Window';
import Header from '../elements/Header'
import Slider from '../elements/Slider';
import {Event} from "../types/Event";
import {Point} from "../types/Point";
import {Module} from "../types/Module";
import MenuItem from './MenuItem';
import Divider from "./Divider";
import {ModuleType} from '../types/ModuleType';


export default class MachineEditor extends Node {
    contextMenu: Node;

    constructor() {
        super();

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.addEventListener('mousedown', this.handleMouseDown);
        this.addEventListener('mousemove', this.handleMouseMove);
        this.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown(event: Event) {
        this.state.selectedModule = this.isCollision({x: event.offsetX, y: event.offsetY});

        if(this.state.selectedModule) {
            if(event.shiftKey === true) {
                this.state.tempConnection = {
                    from: {x: event.offsetX, y: event.offsetY},
                    to: {x: event.offsetX, y: event.offsetY},
                }
            } else if (event.ctrlKey === true) {

            }
        }
    }

    handleMouseMove(event: Event) {
        if(this.state.tempConnection.from && this.state.tempConnection.to) {
            this.state.tempConnection.to = {x: event.offsetX, y: event.offsetY};
        } else if (this.state.selectedModule && event.shiftKey === false) {
            this.state.modules.get(this.state.selectedModule).position = {x: event.offsetX, y: event.offsetY};
        }
    }

    handleMouseUp(event: Event) {
        if(this.state.selectedModule) {

            if (this.state.tempConnection.from && this.state.tempConnection.to) {
                const key = this.isCollision({x: event.offsetX, y: event.offsetY});
                if(key && this.state.modules.get(key).type !== ModuleType.GEN) {
                    this.state.modules.get(this.state.selectedModule).ref.push(key);
                }
            }

        } else if (!this.state.selectedModule) {
            if(event.shiftKey === true) {

            } else if (event.ctrlKey === true) {
                this.state.machineContextMenu = {x: event.offsetX, y: event.offsetY};
            } else {

            }


        }
        this.state.tempConnection = {
            from: undefined,
            to: undefined,
        };
        this.state.selectedModule = undefined;

    }

    isCollision(point: Point) {
        let moduleKey = undefined;
        this.state.modules.forEach((module, key) => {
            const position = module.position;
            if (
                (point.x > position.x && point.x < position.x + 100) &&
                (point.y > position.y && point.y < position.y + 50)
            ) {
                moduleKey = key;
            }
        });
        return moduleKey;
    };
    
    drawConnection(from: Point, to: Point) {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(from.x + 50, from.y + 25);
        this.context.lineTo(to.x + 50, to.y + 25);
        this.context.stroke();
        this.context.restore();
    };

    drawTempConnection() {
        if (this.state.tempConnection.to && this.state.tempConnection.from) {
            this.context.save();
            this.context.beginPath();
            this.context.moveTo(this.state.tempConnection.from.x, this.state.tempConnection.from.y);
            this.context.lineTo(this.state.tempConnection.to.x, this.state.tempConnection.to.y);
            this.context.stroke();
            this.context.restore();
        }
    }

    drawConnections() {
        this.state.modules.forEach((module, key) => {
            if (module.ref.length > 0) {
                module.ref.forEach(refKey => {
                    this.drawConnection(module.position, this.state.modules.get(refKey).position);
                });
            }
        });
    }

    drawModules() {
        this.state.modules.forEach((module, key) => {
            this.context.save();
            this.context.translate(module.position.x, module.position.y);
            this.drawModule(module.type, module.label);
            this.context.restore();
        });
    }

    drawModule(type, label) {
        this.context.save();

        const types = {
            [ModuleType.MASTER]: '#c6bdab',
            [ModuleType.GEN]: '#a8adcb',
            [ModuleType.FX]: '#c5ada9',
        };

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, 100, 50);

        this.context.fillStyle = types[type];
        this.context.fillRect(1, 1, 98, 48);

        this.context.fillStyle = 'black';
        this.context.fillText(label, 50-(this.context.measureText(label).width/2), 25);

        this.context.restore();
    };

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = '#dad6c9';
        this.context.fillRect(0, 0, this.width, this.height);
        this.drawBorder({x: 4, y:4, width: this.width-4, height: this.height-4}, true);
        this.context.translate(5, 5);

        this.drawConnections();
        this.drawTempConnection();
        this.drawModules();

        if (this.state.machineContextMenu) {
            const contextMenu = new Window(this.state.machineContextMenu);
            contextMenu.absolute = true;

            const synthesizerMenuItem = new MenuItem('Synthesizer');
            synthesizerMenuItem.addEventListener('mouseup', (event: Event) => {

                const moduleKey: number = Math.floor(Math.random() * 10000);
                this.state.modules.set(moduleKey, {
                    key: moduleKey,
                    position: {x: this.state.machineContextMenu.x, y: this.state.machineContextMenu.y},
                    type: ModuleType.GEN,
                    label: 'Bass3',
                    ref: [],
                    asdr: {a: 0.03, s:0.8, d:0, r:0}
                });


                const patternKey = (new Date().getTime() * 2);

                this.state.patterns.set(patternKey, {
                    key: patternKey,
                    gen: moduleKey,
                    label: '00',
                    pattern: [
                        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    ]
                });


                if(this.state.sequence[this.state.sequenceNumber] === undefined) {
                    this.state.sequence.push([patternKey]);
                } else {
                    this.state.sequence[this.state.sequenceNumber].push(patternKey);
                    // this.state.sequence[Math.floor(Math.random() * this.state.sequence.length-1) + 1 ].push(patternKey)
                }

                this.state.machineContextMenu = undefined;
            });

            const drumMachineMenuItem = new MenuItem('Drum Machine');
            drumMachineMenuItem.addEventListener('mouseup', (event: Event) => {
                const moduleKey: number = Math.floor(Math.random() * 10000);
                this.state.modules.set(moduleKey, {
                    key: moduleKey,
                    position: {x: this.state.machineContextMenu.x, y: this.state.machineContextMenu.y},
                    type: ModuleType.GEN,
                    label: 'Kick',
                    ref: [],
                    asdr: {a: 0.03, s:0.8, d:0, r:0}
                });
                this.state.machineContextMenu = undefined;
            });

            const delayMenuItem = new MenuItem('Delay');
            delayMenuItem.addEventListener('mouseup', (event: Event) => {
                // this.state.modules[new Date().getTime()] = {
                //     position: {x: this.state.machineContextMenu.x, y: this.state.machineContextMenu.y},
                //     type: ModuleType.FX,
                //     label: 'Delay',
                //     ref: [],
                //     asdr: {a: 0.1, s:0.2, d:0, r:0}
                // };
                // this.state.machineContextMenu = undefined;
            });

            const reverbMenuItem = new MenuItem('Reverb');
            reverbMenuItem.addEventListener('mouseup', (event: Event) => {
                // this.state.modules[new Date().getTime()] = {
                //     position: {x: this.state.machineContextMenu.x, y: this.state.machineContextMenu.y},
                //     type: ModuleType.FX,
                //     label: 'Reverb',
                //     ref: [],
                //     asdr: {a: 0.1, s:0.2, d:0, r:0}
                // };
                // this.state.machineContextMenu = undefined;
            });

            const divider = new Divider();
            divider.width = 200;

            contextMenu.addChild(synthesizerMenuItem);
            contextMenu.addChild(drumMachineMenuItem);
            contextMenu.addChild(divider);
            contextMenu.addChild(delayMenuItem);
            contextMenu.addChild(reverbMenuItem);

            // contextMenu.addChild(new Slider({label: 'Attack', value: 20, min: 0, max: 100}));
            // contextMenu.addChild(new Slider({label: 'Decay', value: 10, min: 0, max: 100}));
            // contextMenu.addChild(new Slider({label: 'Sustain', value: 40, min: 0, max: 100}));
            // contextMenu.addChild(new Slider({label: 'Release', value: 70, min: 0, max: 100}));

            this.addChild(contextMenu);
            this.contextMenu = contextMenu;
        }

        super.draw(x+5, y+5);

        this.context.restore();
    }
}
