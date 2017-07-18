import {Point} from './Point';
import {View} from './View';

export interface State {
    modules: any,
    selectedModule: string,
    tempConnection: {
        from: Point;
        to: Point;
    },
    machineContextMenu: Point;
    view: View;
}
