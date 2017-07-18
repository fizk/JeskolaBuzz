import Element from './elements/Element';
import Application from './elements/Application';
import Bar from './elements/Bar';
import Divider from './elements/Divider';
import MachineEditor from './elements/MachineEditor';
import Group from './elements/Group';
import Footer from './elements/Footer';
import {State} from "./types/State";
import {Event} from "./types/Event";
import {View} from "./types/View";
import {ModuleType} from "./types/ModuleType";
import PatternEditor from "./elements/PatternEditor";
import Queue from './util/Queue'

const state: State = {
    modules: {
        1: {
            position: {x: 200, y: 200},
            type: ModuleType.MASTER,
            label: 'Master',
            ref: [],
            asdr: {a: 0.1, s:0.2, d:0, r:0}
        },
    },
    selectedModule: undefined,
    tempConnection: {
        from: undefined,
        to: undefined
    },
    machineContextMenu: undefined,
    view: View.Machine
};

document.addEventListener('DOMContentLoaded', () => {

    //HTMLCanvas
    const canvas = document.createElement('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    document.body.appendChild(canvas);

    let application: Element = undefined;

    canvas.addEventListener('contextmenu',event => {
        event.preventDefault();
        return false;
    });

    canvas.addEventListener('mousedown', event => {
        console.log(event.clientX, event.clientY);
        const queue = new Queue();
        queue.enqueue(application);
        while (!queue.isEmpty()) {
            let current: Element = queue.dequeue();

            if(
                (current.dimension.x < event.clientX && current.dimension.width+current.dimension.x> event.clientX ) &&
                (current.dimension.y < event.clientY && (current.dimension.height+current.dimension.y) > event.clientY)
            ) {
                // console.log(
                //     current.constructor.toLocaleString().match(/(function )[a-zA-Z0-9]*(\([a-zA-Z0-9, ]*\))/)[0],
                //     current.dimension
                // );

                current.events['mousedown'].forEach(cb => {
                    cb({
                        type: 'mousedown',
                        target: current,
                        offsetX: event.clientX  - current.dimension.x,
                        offsetY: event.clientY  - current.dimension.y,
                        shiftKey: event.shiftKey,
                        ctrlKey: event.ctrlKey,
                    });
                })
            }

            current.getChildren().forEach(child => {
               queue.enqueue(child);
            });

            // console.warn(
            //     current.constructor.toLocaleString().match(/(function )[a-zA-Z0-9]*(\([a-zA-Z0-9, ]*\))/)[0],
            //     current.dimension
            // );
        }
    });

    canvas.addEventListener('mousemove', event => {
        const queue = new Queue();
        queue.enqueue(application);
        while (!queue.isEmpty()) {
            let current: Element = queue.dequeue();

            if(
                (current.dimension.x < event.clientX && current.dimension.width+current.dimension.x> event.clientX ) &&
                (current.dimension.y < event.clientY && (current.dimension.height+current.dimension.y) > event.clientY)
            ) {
                current.events['mousemove'].forEach(cb => {
                    cb({
                        type: 'mousemove',
                        target: current,
                        offsetX: event.clientX  - current.dimension.x,
                        offsetY: event.clientY  - current.dimension.y,
                        shiftKey: event.shiftKey,
                        ctrlKey: event.ctrlKey,
                    });
                })
            }
            current.getChildren().forEach(child => {
                queue.enqueue(child);
            });
        }
    });

    canvas.addEventListener('mouseup', event => {
        const queue = new Queue();
        let e: Event = undefined;
        let callbackArray: ((event: Event) => void)[] = [];

        queue.enqueue(application);
        while (!queue.isEmpty()) {
            let current: Element = queue.dequeue();
            if(
                (current.dimension.x < event.clientX && current.dimension.width+current.dimension.x> event.clientX ) &&
                (current.dimension.y < event.clientY && (current.dimension.height+current.dimension.y) > event.clientY)
            ) {
                if (current.events['mouseup'].length > 0) {
                    e = {
                        type: 'mouseup',
                        target: current,
                        offsetX: event.clientX  - current.dimension.x,
                        offsetY: event.clientY  - current.dimension.y,
                        shiftKey: event.shiftKey,
                        ctrlKey: event.ctrlKey,
                    };
                    callbackArray = current.events['mouseup'];
                }
            }

            current.getChildren().forEach(child => {
                queue.enqueue(child);
            });
        }

        callbackArray.forEach(cb => {
            cb(e);
        })
    });



    const runDraw = function (time) {
        window.requestAnimationFrame(runDraw);

        //Application
        application = new Application();
        application.context = canvas.getContext('2d');
        application.height = document.body.clientHeight;
        application.width = document.body.clientWidth;

        const windowHeaderProperties = new Group();
        const contextMenuBar = new Bar();

        const contextMenuDivider = new Divider();
        contextMenuDivider.width = document.body.clientWidth-4;


        const iconBar = new Bar();

        const iconBarDivider = new Divider();
        iconBarDivider.width = document.body.clientWidth-4;

        const songPropertiesBar = new Bar();

        windowHeaderProperties.addChild(contextMenuBar);
        windowHeaderProperties.addChild(contextMenuDivider);
        windowHeaderProperties.addChild(iconBar);
        windowHeaderProperties.addChild(iconBarDivider);
        windowHeaderProperties.addChild(songPropertiesBar);
        application.addChild(windowHeaderProperties);

        let view: Element = undefined;

        switch (state.view) {
            case View.Machine:
                //MachineEditor
                view = new MachineEditor();
                break;
            case View.Pattern:
                view = new PatternEditor();
                break;
            case View.Sequence:
                break;
        }

        view.state = state;
        view.useOwnHeight = true;
        view.useOwnWidth = true;
        view.width = document.body.clientWidth;
        view.height = document.body.clientHeight - windowHeaderProperties.height - 20;

        application.addChild(view);



        //Footer
        const footer = new Footer();
        footer.useOwnWidth = true;
        footer.width = document.body.clientWidth;
        application.addChild(footer);
        application.draw();



    };
    window.requestAnimationFrame(runDraw);



});

