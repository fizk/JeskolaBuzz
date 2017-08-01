import {assert} from 'chai';
import 'mocha';

import Block from '../../src/elements/Text';

// describe('Node()', () => {
//
//     describe('Text()', () => {
//         it('in-line element is responsible for its own width and height', () => {
//             const padding = 12;
//             const assignHeight = 19;
//             const mockContext = {
//                 measureText: (text: string) => {
//                     return {
//                         width: (text.length * 2)
//                     };
//                 }
//             };
//             const label = new Text('Label');
//             label.context = mockContext;
//
//             assert.equal((mockContext.measureText('Label').width + padding), label.width);
//             assert.equal(assignHeight, label.height);
//         });
//
//         it('in-line in a block wil not stack', () => {
//             const padding = 12;
//             const mockContext = {
//                 measureText: (text: string) => {
//                     return {
//                         width: (text.length * 2)
//                     };
//                 }
//             };
//             const block = new Block();
//             const label1 = new Text('Label1');
//             label1.context = mockContext;
//             const label2 = new Text('Label2');
//             label2.context = mockContext;
//             const label3 = new Text('Label3');
//             label3.context = mockContext;
//             const label4 = new Text('Label4');
//             label4.context = mockContext;
//
//             block.addChild(label1);
//             block.addChild(label2);
//             block.addChild(label3);
//             block.addChild(label4);
//
//             assert.equal(label1.height /* and NOT + label2.height + ... */, block.height);
//             assert.equal(0, block.width); //todo should ne paren't width
//
//             assert.equal(mockContext.measureText('Label1').width + padding, label1.width);
//         });
//
//         it('block elements will stack', () => {
//             const container = new Block();
//             container.context = {
//                 measureText: (text: string) => {
//                     return {
//                         width: (text.length * 2)
//                     };
//                 }
//             };
//             const block1 = new Block();
//             const block2 = new Block();
//             const text1 = new Text('Label1');
//             const text2 = new Text('Label1');
//
//             block1.addChild(text1);
//             block2.addChild(text2);
//
//             container.addChild(block1);
//             container.addChild(block2);
//
//             assert.equal((text1.height + text2.height), container.height);
//         });
//
//         it('mix in-line and block', () => {
//
//             // +--------------------------------+
//             // | +----------+ +----------+      |
//             // | |  inline  | |  inline  |      |
//             // | +----------+ +----------+      |
//             // | +----------------------------+ |
//             // | |    block                   | |
//             // | +----------------------------+ |
//             // | +----------+                   |
//             // | |  inline  |                   |
//             // | +----------+                   |
//             // +--------------------------------+
//
//             const container = new Block();
//             container.context = {
//                 measureText: (text: string) => {
//                     return {
//                         width: (text.length * 2)
//                     };
//                 }
//             };
//
//             const text1 = new Text('Label1');
//             const text2 = new Text('Label2');
//             const text3 = new Text('Label3');
//             const text4 = new Text('Label4');
//             const block = new Block();
//             block.addChild(text3);
//
//             container.addChild(text1);
//             container.addChild(text2);
//             container.addChild(block);
//             container.addChild(text4);
//
//             assert.equal((text1.height * 3), container.height);
//
//         })
//
//     });
//
// });

