import Node from '../elements/Node';
import ModuleNode from '../elements/ModuleNode';
import Window from '../components/Window';
import Header from '../components/Header'
import Slider from '../components/Slider';
import {Event} from "../types/Event";
import {Point} from "../types/Point";
import {Module} from "../types/Module";
import MenuItem from '../elements/MenuItem';
import Divider from "../elements/Divider";
import {ModuleType} from '../types/ModuleType';
import {COLOR} from "../types/COLOR";


export default class MachineEditor extends Node {

    constructor() {
        super();

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);

        this.addEventListener('mousedown', this.handleMouseDown);
        this.addEventListener('mousemove', this.handleMouseMove);
        this.addEventListener('mouseup', this.handleMouseUp);
        this.addEventListener('contextmenu', this.handleContextMenu);
    }

    handleContextMenu(event: Event) {
        this.state.contextMenus.set('machine-editor-context-menu', {x: event.offsetX, y: event.offsetY});
    }

    handleMouseDown(event: Event) {
        this.state.selectedModule = this.isCollision({x: event.offsetX, y: event.offsetY});

        if(this.state.selectedModule && event.shiftKey === true) {
            this.state.tempConnection = {
                from: {x: event.offsetX, y: event.offsetY},
                to: {x: event.offsetX, y: event.offsetY},
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
        }
        this.state.tempConnection = {
            from: undefined,
            to: undefined,
        };
        this.state.selectedModule = undefined;
        this.state.contextMenus.delete('machine-editor-context-menu');
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
        this.state.modules.forEach((module: Module, key: number) => {
            this.context.save();
            this.context.translate(module.position.x, module.position.y);
            const moduleNode: ModuleNode = new ModuleNode(module, module.position);
            moduleNode.addEventListener('contextmenu', (event: Event) => {
                this.state.moduleContextMenu = {
                    position: {x: module.position.x, y: module.position.y},
                    module: module
                }
            });
            moduleNode.absolute = true;
            this.addChild(moduleNode);
            this.context.restore();
        });
    }

    drawBackground() {
        this.context.save();
        this.context.fillStyle = COLOR.PANEL;
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = COLOR.STAGE;
        this.context.fillRect(4, 4, this.width-4, this.height-4);

        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {


        this.context.save();

        this.drawBackground();


        this.drawBorder({x: 4, y:4, width: this.width-4, height: this.height-4}, true);
        this.context.translate(5, 5);

        this.drawConnections();
        this.drawTempConnection();
        this.drawModules();

        if (this.state.contextMenus.has('machine-editor-context-menu')) {

            const contextMenu = new Window(this.state.contextMenus.get('machine-editor-context-menu'));
            contextMenu.absolute = true;

            const synthesizerMenuItem = new MenuItem('Synthesizer');
            synthesizerMenuItem.addEventListener('mouseup', (event: Event) => {

                const moduleKey: number = Math.floor(Math.random() * 10000);
                this.state.modules.set(moduleKey, {
                    key: moduleKey,
                    position: this.state.contextMenus.get('machine-editor-context-menu'),
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
                }

                this.state.contextMenus.delete('machine-editor-context-menu');
            });

            const drumMachineMenuItem = new MenuItem('Drum Machine');
            drumMachineMenuItem.addEventListener('mouseup', (event: Event) => {
                const moduleKey: number = Math.floor(Math.random() * 10000);
                this.state.modules.set(moduleKey, {
                    key: moduleKey,
                    position: this.state.contextMenus.get('machine-editor-context-menu'),
                    type: ModuleType.GEN,
                    label: 'Kick',
                    ref: [],
                    asdr: {a: 0.03, s:0.8, d:0, r:0}
                });
                this.state.contextMenus.delete('machine-editor-context-menu');
            });

            const delayMenuItem = new MenuItem('Delay');
            delayMenuItem.addEventListener('mouseup', (event: Event) => {
                this.state.contextMenus.delete('machine-editor-context-menu');
            });

            const reverbMenuItem = new MenuItem('Reverb');
            reverbMenuItem.addEventListener('mouseup', (event: Event) => {
                this.state.contextMenus.delete('machine-editor-context-menu');
            });

            const divider = new Divider();
            divider.width = 200;

            contextMenu.addChild(synthesizerMenuItem);
            contextMenu.addChild(drumMachineMenuItem);
            contextMenu.addChild(divider);
            contextMenu.addChild(delayMenuItem);
            contextMenu.addChild(reverbMenuItem);


            this.addChild(contextMenu);
        }

        if (this.state.moduleContextMenu) {
            const contextMenu = new Window(this.state.moduleContextMenu.position);
            contextMenu.absolute = true;

            const header: Header = new Header('ADSR');
            contextMenu.addChild(header);
            contextMenu.addChild(new Slider({label: 'Attack', value: this.state.moduleContextMenu.module.asdr.a, min: 0, max: 1}));
            contextMenu.addChild(new Slider({label: 'Decay', value: this.state.moduleContextMenu.module.asdr.d, min: 0, max: 1}));
            contextMenu.addChild(new Slider({label: 'Sustain', value: this.state.moduleContextMenu.module.asdr.s, min: 0, max: 1}));
            contextMenu.addChild(new Slider({label: 'Release', value: this.state.moduleContextMenu.module.asdr.r, min: 0, max: 1}));

            this.addChild(contextMenu);
        }



        super.draw(x+5, y+5);

        this.context.restore();
    }
}
