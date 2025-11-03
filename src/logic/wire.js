import { Node } from './node.js';

class Wire {
    constructor(start_node, end_node, path = []) {
        this.start = start_node;    // Node
        this.end = end_node;        // Node
        this.path = path;           // Array of {x, y} points
        this.is_connected = false;
    }
}

export { Wire };