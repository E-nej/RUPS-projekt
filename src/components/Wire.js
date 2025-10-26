import { DraggableComponent } from './DraggableComponent';

export class Wire extends DraggableComponent {
    constructor(x, y) {
        super(x, y);
        this.startTerminal = null;
        this.endTerminal = null;
        this.resistance = 0.1;      // wire's resistance
        this.controlPoint = null;   // curved wires
    }

    connect(terminal1, terminal2) {
        this.startTerminal = terminal1;
        this.endTerminal = terminal2;
        this.updateControlPoint();
    }

    updateControlPoint() {
        if (this.startTerminal && this.endTerminal) {
            const midX = (this.startTerminal.x + this.endTerminal.x) / 2;
            const midY = (this.startTerminal.y + this.endTerminal.y) / 2;
            this.controlPoint = { x: midX, y: midY };
        }
    }

    isPointInside(x, y) {
        if (!this.startTerminal || !this.endTerminal) return false;
        
        // distance check to wire line
        const threshold = 5;
        const x1 = this.startTerminal.x;
        const y1 = this.startTerminal.y;
        const x2 = this.endTerminal.x;
        const y2 = this.endTerminal.y;
        
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;
        
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy) <= threshold;
    }

    getConnectors() {
        return []; // no additional connectors
    }

    draw(ctx) {
        if (!this.startTerminal || !this.endTerminal) return;

        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(this.startTerminal.x, this.startTerminal.y);
        
        // straight line (enhance with curves - if needed)
        ctx.lineTo(this.endTerminal.x, this.endTerminal.y);
        ctx.stroke();

        ctx.restore();
    }
}