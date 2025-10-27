import { DraggableComponent } from './baseComponents';

export class Battery extends DraggableComponent {
    constructor(x, y, voltage = 9) {
        super(x, y);
        this.width = 80;
        this.height = 40;
        this.voltage = voltage;
        this.terminals = [
            { x: 0, y: 0, type: 'positive' },           // leva (poz.)
            { x: this.width, y: 0, type: 'negative' }   // desna (neg.)
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
            type: t.type,
            component: this
        }));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // dolga linija (pozitivni terminal)
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(-20, 15);
        ctx.stroke();

        // kratka linija (negativni terminal)
        ctx.beginPath();
        ctx.moveTo(20, -10);
        ctx.lineTo(20, 10);
        ctx.stroke();

        // povezovalne linije
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(-20, 0);
        ctx.moveTo(20, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();

        // oznake
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText('+', -30, -20);
        ctx.fillText('-', 25, -20);
        ctx.fillText(`${this.voltage}V`, -15, 35);

        // pike na terminalih
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-40, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0000FF';
        ctx.beginPath();
        ctx.arc(40, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}