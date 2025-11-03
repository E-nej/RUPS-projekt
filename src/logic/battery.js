import { Node } from './node.js';
import { Component } from './component.js';

class Battery extends Component {
    constructor(id, voltage) {
        super(id, 'battery', new Node(`${id}_pos`), new Node(`${id}_neg`), true);
        this.voltage = voltage;
    }
}

export { Battery };