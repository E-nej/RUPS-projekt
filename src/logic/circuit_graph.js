class CircuitGraph {
    constructor() {
        this.nodes = new Map(); // id -> Node object
        this.components = [];
        this.MERGE_RADIUS = 25; // match grid spacing
    }

    //   addNode(node) {
    //     if (!node) return null;

    //     if (!node.connected) node.connected = new Set();

    //     // try to find existing node near this position
    //     for (const existingNode of this.nodes.values()) {
    //       const dx = existingNode.x - node.x;
    //       const dy = existingNode.y - node.y;
    //       const distance = Math.hypot(dx, dy);
    //       if (distance < this.MERGE_RADIUS) {
    //         // merge: we keep existingNode coordinates and connected set
    //         if (node.connected) {
    //             node.connected.forEach(c => existingNode.connected.add(c));
    //         }
    //         return existingNode;

    //       }
    //     }

    //     // new unique node
    //     this.nodes.set(node.id, node);
    //     return node;
    //   }
    // addNode(node) {
    //     if (!node) return null;

    //     if (!node.connected) node.connected = new Set();

    //     // try to merge with any nearby node
    //     for (const existingNode of this.nodes.values()) {
    //         const dx = existingNode.x - node.x;
    //         const dy = existingNode.y - node.y;
    //         const distance = Math.hypot(dx, dy);
    //         if (distance < this.MERGE_RADIUS) {
    //             // merge node connections
    //             node.connected.forEach(c => existingNode.connected.add(c));

    //             // make sure the existing node also links to this new component if it exists
    //             existingNode.connected.add(node);

    //             return existingNode;
    //         }
    //     }

    //     // if no merge, store as new node
    //     this.nodes.set(node.id, node);
    //     return node;
    // }
addNode(node) {
    if (!node) return null;

    if (!node.connected) node.connected = new Set();

    for (const existingNode of this.nodes.values()) {
        const dx = existingNode.x - node.x;
        const dy = existingNode.y - node.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.MERGE_RADIUS) {
            // merge connections
            node.connected.forEach(c => existingNode.connected.add(c));
            // only connect nodes to nodes
            existingNode.connected.add(node);
            node.connected.add(existingNode);

            return existingNode;
        }
    }

    this.nodes.set(node.id, node);
    return node;
}



    // addComponent(component) {
    //     if (!component || !component.start || !component.end) return;

    //     // merge with existing nodes
    //     component.start = this.addNode(component.start);
    //     component.end = this.addNode(component.end);

    //     // ensure sets exist
    //     if (!component.start.connected) component.start.connected = new Set();
    //     if (!component.end.connected) component.end.connected = new Set();

    //     // store component
    //     this.components.push(component);

    //     // add connections
    //     component.start.connected.add(component);   // link to component
    //     component.end.connected.add(component);

    //     // ⚡ bidirectional node connection
    //     component.start.connected.add(component.end);
    //     component.end.connected.add(component.start);
    // }

addComponent(component) {
    if (!component || !component.start || !component.end) return;

    component.start = this.addNode(component.start);
    component.end = this.addNode(component.end);

    // only connect nodes to nodes
    component.start.connected.add(component.end);
    component.end.connected.add(component.start);

    this.components.push(component);
}



    getConnections(node) {
        return this.components.filter(comp =>
            this.sameNode(comp.start, node) ||
            this.sameNode(comp.end, node)
        );
    }


    // Helper: check if a component conducts
    componentConducts(comp) {
        if (!comp) return false;
        // wires, bulbs, resistors, batteries, etc. conduct
        const conductiveTypes = ['wire', 'bulb', 'resistor', 'battery'];
        if (comp.type === 'switch') return comp.is_on;
        return conductiveTypes.includes(comp.type);
    }


    sameNode(a, b) {
        return a && b && a.x === b.x && a.y === b.y;
    }

    //   hasClosedLoop(start, end, visited = new Set()) {
    //     if (!start || !end) return false;
    //     if (this.sameNode(start, end) && visited.size > 0) return true;

    //     // use a shallow identity by storing nodes by reference (or id)
    //     const key = start.id || `${start.x}_${start.y}`;
    //     if ([...visited].some(v => this.sameNode(v, start))) return false;
    //     visited.add(start);

    //     for (const comp of this.getConnections(start)) {
    //       if (!this.componentConducts(comp)) continue;
    //     //   if (comp.type === 'battery' && visited.size < 2) continue; // skip immediate battery bounce
    //       if (comp.type === 'battery' && visited.size === 1) continue;

    //       let next = null;
    //       if (this.sameNode(comp.start, start)) next = comp.end;
    //       else if (this.sameNode(comp.end, start)) next = comp.start;

    //       if (!next) continue;
    //       if ([...visited].some(v => this.sameNode(v, next))) continue;

    //       if (this.hasClosedLoop(next, end, visited)) return true;
    //     }
    //     return false;
    //   }
    // hasClosedLoop(current, target, visitedNodes = new Set(), visitedComps = new Set()) {
    //     if (!current || !target) return false;

    //     if (this.sameNode(current, target) && visitedComps.size > 2) {
    //         console.log("✅ Loop closed between", current.id, "and", target.id);
    //         return true;
    //     }
    //     console.log("🔍 Connections for", current.id, this.getConnections(current).map(c => c.id));

    //     for (const comp of this.getConnections(current)) {
    //         if (!this.componentConducts(comp) || visitedComps.has(comp)) continue;
    //         visitedComps.add(comp);

    //         let next = null;
    //         if (visitedComps.size == 1 || this.sameNode(comp.start, current)) continue;
    //         if (this.sameNode(comp.start, current)) next = comp.end;
    //         else if (this.sameNode(comp.end, current)) next = comp.start;


    //         if (!next) continue;
    //         // allow revisiting the target to complete the loop
    //         if (visitedNodes.has(next) && !this.sameNode(next, target)) continue;

    //         visitedNodes.add(next);

    //         if (next.type === 'switch' && !next.is_on) return false;

    //         if (this.hasClosedLoop(next, target, visitedNodes, visitedComps)) {
    //             return true;
    //         }
    //     }

    //     console.log("❌ dead end at", current.id);
    //     if (current.type == "bulb")
    //         current.is_on = false;
    //     return false;
    // }
    hasClosedLoop(current, target, visitedComps = new Set()) {
    if (!current || !target) return false;

    // loop completed if we returned to target and traversed at least one component
    if (this.sameNode(current, target) && visitedComps.size > 0) {
        return true;
    }

    for (const comp of this.getConnections(current)) {
        if (!this.componentConducts(comp) || visitedComps.has(comp)) continue;

        visitedComps.add(comp);

        let next = this.sameNode(comp.start, current) ? comp.end : comp.start;
        if (!next) continue;

        if (next.type === 'switch' && !next.is_on) continue;

        if (this.hasClosedLoop(next, target, visitedComps)) {
            return true;
        }

        visitedComps.delete(comp); // backtrack
    }

    return false;
}


    simulate() {
        const battery = this.components.find(c => c.type === 'battery');
        if (!battery) {
            console.log("No battery found.");
            return false;
        }

        const switches = this.components.filter(c => c.type === 'switche');
        switches.forEach(s => {
            if (!s.is_on) {
                console.log("Switch " + s.id + " is OFF");
                return false;
            }
        })

        const start = battery.start;
        const end = battery.end;

        for (const n of this.nodes.values()) {
            console.log(`Node ${n.id}: (${n.x},${n.y}) connected to ${[...n.connected].map(c => c.id).join(',')}`);
        }
        console.log('----------------------------------------');

        const closed = this.hasClosedLoop(start, end);

        if (closed) {
            console.log("Circuit closed! Current flows.");
            const bulbs = this.components.filter(c => c.type === 'bulb');
            console.log(bulbs);
            bulbs.forEach(b => {
                if (b.is_on) console.log(`💡 Bulb ${b.id} is now ON.`);
                else console.log(`💡 Bulb ${b.id} is now OFF.`)
            });
            return true;
        } else {
            console.log("Circuit open. No current flows.");
            const bulbs = this.components.filter(c => c.type === 'bulb');
            bulbs.forEach(b => {
                if (typeof b.turnOff === 'function') b.turnOff();
            });
            return false;
        }
    }
}

export { CircuitGraph };
