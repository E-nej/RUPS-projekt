import { Component } from './component.js';
import { Node } from './node.js';
import { Wire } from './wire.js';

class CircuitGraph {
    constructor() {
        this.nodes = new Map();
        this.components = [];
    }

    addNode(node) {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, new Set());
        }
    }

    addComponent(component) {
        // Make sure both nodes exist
        console.log(`Adding component: ${component} from ${component.start.id} to ${component.end.id}`);
        this.addNode(component.start);
        this.addNode(component.end);

        this.components.push(component);

        // Bidirectional (since electricity can flow either way)
        this.nodes.get(component.start.id).add(component);
        // this.nodes.get(component.end.id).add(component);
    }

    getConnections(node) {
        return this.nodes.get(node.id) || new Set();
    }

    // Helper: check if a component conducts
    componentConducts(component) {
        if (component.type === 'switch') return !component.options.open;
        return true; // battery, wire, bulb all conduct
    }

    // Depth-First Search to check for closed loop
    hasClosedLoop(start, end, visited = new Set()) {
        if (start === end && visited.size > 0) return true;
        visited.add(start);

        for (const comp of this.getConnections(start)) {
            if (!this.componentConducts(comp)) continue;
            if (comp.type === 'battery' && visited.size < 2) continue; // avoid immediate loop back to battery
            const next = comp.start === start ? comp.end : comp.start;
            if (!visited.has(next)) {
                if (this.hasClosedLoop(next, end, visited)) return true;
            }
        }
        return false;
    }

    simulate() {
        const battery = this.components.find(c => c.type === 'battery');
        if (!battery) {
        console.log("❌ No battery found.");
        return;
        }

        const start = battery.start;
        const end = battery.end;

        const closed = this.hasClosedLoop(start, end);

        if (closed) {
            console.log("✅ Circuit closed! Current flows.");
            const bulb = this.components.find(c => c.type === 'bulb');
            if (bulb) {
                bulb.turnOn();
            }
        } else {
            console.log("❌ Circuit open. No current flows.");
            const bulb = this.components.find(c => c.type === 'bulb');
            if (bulb) {
                bulb.turnOff();
            }
        }
    }
    lightBulbs() {
        const bulbs = this.components.filter(c => c.type === 'bulb');
        if (bulbs.length === 0) return console.log("No bulbs in circuit.");

        bulbs.forEach((b, i) => console.log(`💡 Bulb ${i + 1} lights up.`));
    }
}

export { CircuitGraph };