class CircuitGraph {
    constructor() {
        this.nodes = new Map();
        this.components = [];
    }

    // addNode(node) {
    //     if (!this.nodes.has(node.id)) {
    //         this.nodes.set(node.id, new Set());
    //     }
    // }

    // addNode(node) {
    //     if (!this.nodes.has(node.id)) {
    //         this.nodes.set(node.id, node); // store Node object
    //     } else {
    //         // Node exists → update its x/y position and keep connections
    //         const existingNode = this.nodes.get(node.id);
    //         existingNode.x = node.x;
    //         existingNode.y = node.y;

    //         // Optional: merge connected nodes/wires if needed
    //         node.connected.forEach((value, key) => {
    //             existingNode.connected.set(key, value);
    //         });
    //     }
    // }
    addNode(node) {
        // Try to find an existing node at (or very near) this position
        for (const existingNode of this.nodes.values()) {
            const dx = existingNode.x - node.x;
            const dy = existingNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 5) { // within 5 pixels = same node
                // merge connections into existing node
                for (const comp of node.connected ?? []) {
                    existingNode.connected.add(comp);
                }
                console.log(node.id + " is existing Node")
                return existingNode;
            }
        }

        // otherwise it's a new unique node
        if (!node.connected) {
            console.log(node.id + " is new Node")
            node.connected = new Set();
        }
        this.nodes.set(node.id, node);
        return node;
    }


    addComponent(component) {
        // Make sure both nodes exist
        console.log(`Adding component: ${component} from ${component.start.id} to ${component.end.id}`);
        // this.addNode(component.start);
        // this.addNode(component.end);

        // this.components.push(component);

        // const startNode = this.nodes.get(component.start.id);
        // const endNode = this.nodes.get(component.end.id);

        // startNode.connected.add(component);
        // endNode.connected.add(component);
        component.start = this.addNode(component.start);
        component.end = this.addNode(component.end);

        this.components.push(component);

        component.start.connected.add(component);
        component.end.connected.add(component);
    }

    getConnections(node) {
    const n = this.nodes.get(node.id);
    return n ? n.connected : new Set();
    }

    // Helper: check if a component conducts
    componentConducts(component) {
        if (component.type === 'switch') return !component.options.open;
        return true; // battery, wire, bulb all conduct
    }

    // Depth-First Search to check for closed loop
    hasClosedLoop(start, end, visited = new Set()) {
        console.log(start);
        console.log(end);
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