import { Node } from './node.js';

class Component {
    constructor(id, type, start, end, isVoltageSource = false) {
        console.log(`Creating component: ${id} of type ${type} between ${start.id} and ${end.id}`);
        this.id = id;
        this.type = type;
        this.start = start;
        this.end = end;
        this.isVoltageSource = isVoltageSource;
    }

    conducts(){
        // Placeholder for component-specific conduction logic
    }
}

export { Component };