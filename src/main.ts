import Block from './elements/Block';
import Text from './elements/Text';
import Node from './elements/Node';
import Button from './elements/Button';
import {Event} from './types/Event';
import Application from "./components/Application";
import Bar from "./components/Bar";
import Divider from "./elements/Divider";
import Footer from "./components/Footer";
import MachineEditor from "./screens/MachineEditor";
import {State} from "./types/State";
import {ModuleType} from "./types/ModuleType";
import {View} from "./types/View";
import checkEvents from './util/checkEvents';
import checkKey from './util/checkKey';
import PatternEditor from "./screens/PatternEditor";
import SequenceEditor from "./screens/SequenceEditor";
import NoteMap from './types/NoteMap';




const createGenerator = function (context, note, asdr, now) {
    if (note) {
        const gain = context.createGain();

        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = NoteMap[note];
        oscillator.connect(gain);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(1, now + asdr.a);
        gain.gain.exponentialRampToValueAtTime(0.001, now + asdr.s);

        return {gain: gain, oscillator: oscillator, stop: (now + asdr.a + asdr.s)};
    } else {
        return {
            stop: undefined,
            connect: () => {},
            oscillator: {
                start: (arg) => {},
                stop: (arg) => {},
            },
            gain: {
                connect: (arg) => {}
            }
        }
    }
};





const state: State = {
    modules: new Map(),
    selectedModule: undefined,
    tempConnection: {
        from: undefined,
        to: undefined
    },
    machineContextMenu: undefined,
    view: View.Machine,
    sequenceNumber: 0,
    patterns: new Map(),
    sequence: [[],[],[],[],[],[]],
    sequenceEditorPosition: {x: 0, y:0},
    patternEditorPosition: {x: 0, y:0},
    pattenEditorGenerator: undefined,
    pattenEditorPattern: undefined
};


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    document.body.appendChild(canvas);

    state.modules.set(1, {
        key: 1,
        position: {x: 200, y: 200},
        type: ModuleType.MASTER,
        label: 'Master',
        ref: [],
        asdr: {a: 0.1, s:0.2, d:0, r:0}
    });

    let application: Node = undefined;

    const runDraw = function (time) {
        window.requestAnimationFrame(runDraw);

        // Application
        application = new Application();
        application.context = canvas.getContext('2d');
        application.width = document.body.clientWidth;

        const applicationHeader = new Block();
        application.addChild(applicationHeader);

        // Menu Bar
        const menuBar = new Bar();
        applicationHeader.addChild(menuBar);

        const menuBarFileBtn = new Text('File');
        menuBar.addChild(menuBarFileBtn);

        const menuBarEditBtn = new Text('Edit');
        menuBar.addChild(menuBarEditBtn);

        const menuBarViewBtn = new Text('View');
        menuBar.addChild(menuBarViewBtn);

        const menuBarHelpBtn = new Text('Help');
        menuBar.addChild(menuBarHelpBtn);

        const menuBarDivider = new Divider();
        applicationHeader.addChild(menuBarDivider);


        // Controls Bar
        const controlsBar = new Bar();
        applicationHeader.addChild(controlsBar);

        const controlsBarPlayButton = new Button('Play');
        controlsBar.addChild(controlsBarPlayButton);

        const controlsBarStopButton = new Button('Stop');
        controlsBar.addChild(controlsBarStopButton);

        const controlsBarRecordButton = new Button('Rec');
        controlsBar.addChild(controlsBarRecordButton);

        const controlsBarLoopButton = new Button('Loop');
        controlsBar.addChild(controlsBarLoopButton);




        const controlsBarMachinesButton = new Button('Machines');
        controlsBarMachinesButton.active = (state.view === View.Machine);
        controlsBarMachinesButton.addEventListener('mouseup', (event: Event) => {
            state.view = View.Machine;
        });
        controlsBar.addChild(controlsBarMachinesButton);

        const controlsBarSequencerButton = new Button('Sequencer');
        controlsBarSequencerButton.active = (state.view === View.Sequence);
        controlsBarSequencerButton.addEventListener('mouseup', (event: Event) => {
            state.view = View.Sequence;
        });
        controlsBar.addChild(controlsBarSequencerButton);

        const controlsBarPatternEditorButton = new Button('Pattern Editor');
        controlsBarPatternEditorButton.active = (state.view === View.Pattern);
        controlsBarPatternEditorButton.addEventListener('mouseup', (event: Event) => {
            state.view = View.Pattern;
        });
        controlsBar.addChild(controlsBarPatternEditorButton);




        const controlsBarDivider = new Divider();
        applicationHeader.addChild(controlsBarDivider);

        // Properties Bar
        const propertiesBar = new Bar();
        applicationHeader.addChild(propertiesBar);

        const propertiesBarElapsedText = new Text(`Elapsed 00:00:00:0`);
        propertiesBar.addChild(propertiesBarElapsedText);

        const propertiesBarCurrentText = new Text('Current 00:00:00:0');
        propertiesBar.addChild(propertiesBarCurrentText);

        const propertiesBarLoopText = new Text('Loop 00:00:00:0');
        propertiesBar.addChild(propertiesBarLoopText);

        if(state.view === View.Machine) {
            // Machine Editor
            const machineEditor = new MachineEditor();
            machineEditor.state = state;
            machineEditor.height = document.body.clientHeight - applicationHeader.height - 20;
            application.addChild(machineEditor);
        } else if (state.view === View.Pattern) {
            const patternEditor = new PatternEditor();
            patternEditor.state = state;
            patternEditor.height = document.body.clientHeight - applicationHeader.height - 20;
            application.addChild(patternEditor);
        } else if(state.view === View.Sequence) {
            const sequenceEditor = new SequenceEditor();
            sequenceEditor.state = state;
            sequenceEditor.height = document.body.clientHeight - applicationHeader.height - 20;
            application.addChild(sequenceEditor);
        }

        //Footer
        const applicationFooter = new Footer();
        application.addChild(applicationFooter);

        // - - - - - -
        application.draw(0, 0);
    };
    window.requestAnimationFrame(runDraw);



    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
    });

    canvas.addEventListener('mousedown', event => {
        checkEvents(event, 'mousedown', application);
    });
    canvas.addEventListener('mousemove', event => {
        checkEvents(event, 'mousemove', application);
    });
    canvas.addEventListener('mouseup', event => {
        checkEvents(event, 'mouseup', application);
    });
    document.body.addEventListener('keyup', event => {

        if(event.keyCode === 40) {
            event.preventDefault();
            checkKey(event, 'arrowDown', application);
        } else if (event.keyCode === 38) {
            event.preventDefault();
            checkKey(event, 'arrowUp', application);
        } else if (event.keyCode === 37) {
            event.preventDefault();
            checkKey(event, 'arrowLeft', application);
        } else if (event.keyCode === 39) {
            event.preventDefault();
            checkKey(event, 'arrowRight', application);
        } else if (event.keyCode === 13) {
            event.preventDefault();
            checkKey(event, 'enter', application);
        } else if (event.keyCode >= 65 || event.keyCode >= 90) {
            event.preventDefault();
            checkKey(event, 'letter', application);
        } else if (event.keyCode >= 48 || event.keyCode >= 57) {
            event.preventDefault();
            checkKey(event, 'number', application);
        }
        //
    });


    //const context = new (window.AudioContext || window.webkitAudioContext)();
    const context = new (window.AudioContext || webkitAudioContext)();

    let counter = 0;

    setInterval(() => {

        if(state.sequence[state.sequenceNumber]) {
            const currentPatterns = state.sequence[state.sequenceNumber];

            const genMap = {
                1: context.destination
            };

            currentPatterns.forEach(pattern => {
                const gen = state.patterns.get(pattern).gen;
                const pat = state.patterns.get(pattern).pattern;
                const refs = state.modules.get(gen).ref;

                if (pat && pat[counter]) {
                    const now = context.currentTime;
                    const g = createGenerator(context, pat[counter], state.modules.get(gen).asdr, now);

                    refs.forEach(ref => {
                        g.gain.connect(genMap[ref])
                    });

                    g.oscillator.start(now);
                    g.oscillator.stop(g.stop);
                }


            });
        }

        counter++;
        if (counter == 16) {
            counter = 0;
        }


    }, 500);


});
