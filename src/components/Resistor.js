import { DraggableComponent } from './DraggableComponent';

export class Resistor extends DraggableComponent {
    constructor(x, y, resistance = 100) {
        super(x, y);
        this.resistance = resistance;
        this.width = 50;
        this.height = 30;
        this.terminals = [
            { x: 0, y: 0 },
            { x: this.width, y: 0 }
        ];
    }

    isPointInside(x, y) {
        return x >= this.x - this.width / 2 && 
               x <= this.x + this.width / 2 &&
               y >= this.y - this.height / 2 && 
               y <= this.y + this.height / 2;
    }

    getConnectors() {
        return this.terminals.map(t => ({
            x: this.x - this.width / 2 + t.x,
            y: this.y + t.y,
            component: this
        }));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // resistor symbol
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-5, 10);
        ctx.lineTo(5, -10);
        ctx.lineTo(15, 10);
        ctx.lineTo(20, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();

        // label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`${this.resistance}Ω`, -15, 25);

        // terminal dots
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(-40, 0, 4, 0, Math.PI * 2);
        ctx.arc(40, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}