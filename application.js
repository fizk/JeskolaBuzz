
// - - - - -

// class Application {
//
//     constructor(width, height) {
//         this.modules = {};
//         this.canvas = document.createElement('canvas');
//         this.canvas.width = width;
//         this.canvas.height = height;
//         this.movingModule = false;
//         this.propertiesModule = false;
//         this.connectingModule = false;
//         this.tempConnection = undefined;
//         this.propertiesMode = false;
//         this.propertiesForm = false;
//         this.propertiesFormPosition = [0, 0];
//
//         this.normalModeOnMouseDown = this.normalModeOnMouseDown.bind(this);
//         this.normalModeOnMouseMove = this.normalModeOnMouseMove.bind(this);
//         this.normalModeOnMouseUp = this.normalModeOnMouseUp.bind(this);
//
//         this.addNormalListeners();
//
//         this.events = {
//             addmodule: [],
//             movemodule: [],
//             connectmodule: [],
//             propertiesmodule: [],
//         };
//     }
//
//     addNormalListeners() {
//         this.canvas.addEventListener('mousedown', this.normalModeOnMouseDown);
//         this.canvas.addEventListener('mousemove', this.normalModeOnMouseMove);
//         this.canvas.addEventListener('mouseup', this.normalModeOnMouseUp);
//     }
//
//     removeNormalListeners() {
//         this.canvas.removeEventListener('mousedown', this.normalModeOnMouseDown);
//         this.canvas.removeEventListener('mousemove', this.normalModeOnMouseMove);
//         this.canvas.removeEventListener('mouseup', this.normalModeOnMouseUp);
//     }
//
//     normalModeOnMouseDown(event) {
//         event.preventDefault();
//         const clickedModule = this.isCollision(event.clientX, event.clientY);
//
//         if(event.shiftKey && clickedModule) { // CONNECT
//             this.tempConnection = {
//                 start: [event.clientX, event.clientY],
//                 end: [event.clientX, event.clientY],
//             };
//             this.connectingModule = clickedModule;
//
//         } else if (event.metaKey && clickedModule) {// MODULE PROPERTIES
//             this.propertiesModule = clickedModule;
//             this.propertiesMode = true;
//             this.removeNormalListeners();
//
//             this.propertiesFormPosition = [event.clientX, event.clientY];
//
//             const window = new Window();
//             window.context = this.canvas.getContext('2d');
//             window.addChild(new Header('hundur'));
//             window.addChild(new Slider({label: 'Attack', value: 20}));
//             window.addChild(new Slider({label: 'Decay', value: 10}));
//             window.addChild(new Slider({label: 'Sustain', value: 40}));
//             window.addChild(new Slider({label: 'Release', value: 70}));
//
//             this.propertiesForm = window;
//
//
//         } else if(clickedModule) {// MODULE MOVE
//             this.movingModule = clickedModule
//
//         } else {// MODULE CREATE
//             this.propertiesMode = false;
//             this.events.addmodule.forEach(cb => {
//                 cb(event)
//             })
//         }
//     }
//
//     normalModeOnMouseMove(event) {
//         if(this.movingModule) {
//             this.events.movemodule.forEach(cb => {
//                 cb(this.movingModule, event.clientX, event.clientY)
//             });
//         }
//
//         if(this.tempConnection) {
//             this.tempConnection.end = [event.clientX, event.clientY];
//         }
//     }
//
//     normalModeOnMouseUp(event) {
//         if(this.connectingModule) {
//             const connectToModule = this.isCollision(event.clientX, event.clientY);
//             if (connectToModule) {
//                 this.events.connectmodule.forEach(cb => {
//                     cb(this.connectingModule, connectToModule)
//                 });
//             }
//         }
//         this.tempConnection = undefined;
//         this.movingModule = false;
//         this.connectingModule = false
//     }
//
//     isCollision(x, y) {
//         let moduleKey = undefined;
//         Object.keys(this.modules).forEach(key => {
//             const pos = this.modules[key].position;
//             if (
//                 (x > pos[0] && x < pos[0]+100) &&
//                 (y > pos[1] && y < pos[1]+50)
//             ) {
//                 moduleKey = key;
//             }
//         });
//         return moduleKey;
//     };
//
//     addEventListener(event, callback) {
//         this.events[event].push(callback);
//     }
//
//     drawTempConnection() {
//         if(this.tempConnection) {
//             this.drawConnection(this.tempConnection.start, this.tempConnection.end);
//         }
//     }
//
//     drawConnection(g1, g2) {
//         const context = this.canvas.getContext('2d');
//         context.beginPath();
//         context.moveTo(g1[0], g1[1]);
//         context.lineTo(g2[0], g2[1]);
//         context.stroke();
//     };
//
//     drawConnections() {
//         Object.keys(this.modules).forEach(key => {
//             if (this.modules[key].ref.length > 0) {
//                 this.modules[key].ref.forEach(refKey => {
//                     this.drawConnection(this.modules[key].position, this.modules[refKey].position);
//                 });
//             }
//         });
//     }
//
//     drawModules() {
//         const context = this.canvas.getContext('2d');
//         Object.keys(this.modules).forEach(key => {
//             context.save();
//             context.translate(this.modules[key].position[0], this.modules[key].position[1]);
//             this.drawModule(this.modules[key].type, this.modules[key].label);
//             context.restore();
//         });
//     }
//
//     drawModule(type, label) {
//         const context = this.canvas.getContext('2d');
//
//         context.save();
//
//         const types = {
//             [TYPES.MASTER]: '#c6bdab',
//             [TYPES.GEN]: '#a8adcb',
//             [TYPES.FX]: '#c5ada9',
//         };
//
//         context.fillStyle = 'black';
//         context.fillRect(0, 0, 100, 50);
//
//         context.fillStyle = types[type];
//         context.fillRect(1, 1, 98, 48);
//
//         context.fillStyle = 'black';
//         context.fillText(label, 50-(context.measureText(label).width/2), 25);
//
//         context.restore();
//     };
//
//     createPropertiesModal(x, y) {
//         return (() => {
//             const form = document.createElement('form');
//             form.style.position = 'absolute';
//             form.style.backgroundColor = 'gray';
//             form.style.top = (`${y}px`);
//             form.style.left = (`${x}px`);
//
//             //ASDR
//             const labelA = document.createElement('label');
//             labelA.style.display = 'block';
//             labelA.appendChild(document.createTextNode('A'));
//             const inputA = document.createElement('input');
//             inputA.min = 0.01;
//             inputA.max = 1;
//             inputA.step = 0.01;
//             inputA.type = 'range';
//             inputA.name = 'a';
//             const containerA = document.createElement('div');
//             containerA.appendChild(labelA);
//             containerA.appendChild(inputA);
//
//             const labelS = document.createElement('label');
//             labelS.appendChild(document.createTextNode('S'));
//             labelS.style.display = 'block';
//             const inputS = document.createElement('input');
//             inputS.type = 'range';
//             inputS.min = 0.01;
//             inputS.max = 1;
//             inputS.step = 0.01;
//             inputS.name = 's';
//             const containerS = document.createElement('div');
//             containerS.appendChild(labelS);
//             containerS.appendChild(inputS);
//
//             const labelD = document.createElement('label');
//             labelD.appendChild(document.createTextNode('D'));
//             labelD.style.display = 'block';
//             const inputD = document.createElement('input');
//             inputD.type = 'range';
//             inputD.name = 'd';
//             inputD.min = 0.01;
//             inputD.max = 1;
//             inputD.step = 0.01;
//             const containerD = document.createElement('div');
//             containerD.appendChild(labelD);
//             containerD.appendChild(inputD);
//
//             const labelR = document.createElement('label');
//             labelR.appendChild(document.createTextNode('R'));
//             labelR.style.display = 'block';
//             const inputR = document.createElement('input');
//             inputR.type = 'range';
//             inputR.name = 'r';
//             inputR.min = 0.01;
//             inputR.max = 1;
//             inputR.step = 0.01;
//             const containerR = document.createElement('div');
//             containerR.appendChild(labelR);
//             containerR.appendChild(inputR);
//
//             form.appendChild(containerA);
//             form.appendChild(containerS);
//             form.appendChild(containerD);
//             form.appendChild(containerR);
//
//             return form;
//
//         })();
//     }
//
//     draw() {
//         const context = this.canvas.getContext('2d');
//         context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//
//         this.drawConnections();
//         this.drawTempConnection();
//         this.drawModules();
//
//         if(this.propertiesForm) {
//             context.save();
//             context.translate(this.propertiesFormPosition[0], this.propertiesFormPosition[1]);
//             this.propertiesForm.draw();
//             context.restore();
//         }
//
//     }
// }
//
//
// const createGenerator = function (context, note, asdr, now) {
//     const gain = context.createGain();
//
//     const oscillator = context.createOscillator();
//     oscillator.type = 'sine';
//     oscillator.frequency.value = note;
//     oscillator.connect(gain);
//
//     gain.gain.setValueAtTime(0.001, now);
//     gain.gain.exponentialRampToValueAtTime(1, now + asdr.a);
//     gain.gain.exponentialRampToValueAtTime(0.001, now + asdr.s);
//
//     return {gain: gain, oscillator: oscillator, stop: (now + asdr.a + asdr.s)};
// };
//
// document.addEventListener('DOMContentLoaded', () => {
//
//     const modules = {
//         1: {
//             position: [(document.body.clientWidth/2), (document.body.clientHeight/2)],
//             type: TYPES.MASTER,
//             label: 'Master',
//             ref: [],
//             asdr: {a: 0.1, s:0.2, d:0, r:0}
//         }
//     };
//
//     let sequenceNumber = 0;
//
//     const patterns = {};
//     const sequence = [];
//
//
//     const stage = new Application(document.body.clientWidth, document.body.clientHeight);
//     stage.addEventListener('addmodule', (event) => {
//         const moduleKey = new Date().getTime();
//         modules[moduleKey] = {
//             position: [event.clientX, event.clientY],
//             type: TYPES.GEN,
//             label: 'Bass3',
//             ref: [],
//             asdr: {a: 0.1, s:0.2, d:0, r:0}
//         };
//
//
//         const patternKey = (new Date().getTime() * 2);
//
//         patterns[patternKey] = {
//             gen: moduleKey,
//             pattern: [
//                 440.00, 523.25, 587.33, 659.25, 783.99, 440.00, 523.25, 587.33,
//                 659.25, 783.99, 440.00, 523.25, 587.33, 659.25, 783.99, 440.00,
//                 523.25, 587.33, 659.25, 783.99, 440.00, 523.25, 587.33, 659.25,
//                 783.99, 440.00, 523.25, 587.33, 659.25, 783.99, 659.25, 783.99
//             ].sort(() => .5 - Math.random())
//         };
//
//         if(sequence[sequenceNumber] === undefined) {
//             sequence.push([patternKey]);
//         } else {
//             sequence[sequenceNumber].push(patternKey)
//         }
//     });
//     stage.addEventListener('movemodule', (key, x, y) => {
//         modules[key].position = [x, y];
//     });
//     stage.addEventListener('connectmodule', (from, to) => {
//         modules[from].ref.push(to);
//     });
//     stage.addEventListener('propertiesmodule', (key, properties) => {
//         console.log(key, properties);
//         modules[key].asdr = properties;
//     });
//
//     document.body.appendChild(stage.canvas);
//
//     const runDraw = function (time) {
//         window.requestAnimationFrame(runDraw);
//         stage.modules = modules;
//         stage.draw();
//     };
//     window.requestAnimationFrame(runDraw);
//
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//
//     let counter = 0;
//
//     setInterval(() => {
//
//         if(sequence[sequenceNumber]) {
//             const currentPatterns = sequence[sequenceNumber];
//
//             const genMap = {
//                 1: context.destination
//             };
//
//             currentPatterns.forEach(pattern => {
//                 const gen = patterns[pattern].gen;
//                 const pat = patterns[pattern].pattern;
//                 const refs = modules[gen].ref;
//
//                 if (pat && pat[counter]) {
//                     const now = context.currentTime;
//                     const g = createGenerator(context, pat[counter], modules[gen].asdr, now);
//
//                     refs.forEach(ref => {
//                         g.gain.connect(genMap[ref])
//                     });
//
//                     g.oscillator.start(now);
//                     g.oscillator.stop(g.stop);
//                 }
//
//
//             });
//         }
//
//         counter++;
//         if (counter == 32) {
//             counter = 0;
//         }
//
//
//     }, 500);
// });


