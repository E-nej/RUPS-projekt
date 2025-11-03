import { Node } from '../logic/node.js';
import { Component } from './component.js';

class Battery extends Component {
    constructor(id, voltage) {
        super(id, 'battery', new Node(`${id}_pos`), new Node(`${id}_neg`), 'src/components/battery.png', true);
        this.voltage = voltage;
    }
}

export { Battery };