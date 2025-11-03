import { Node } from '../logic/node.js';
import { Component } from './component.js';

class Wire extends Component{
    constructor(id, start, end, path = []) {
        super(id, 'wire', start, end, 'src/components/wire.png', true);
        this.is_connected = false;
    }
}

export { Wire };