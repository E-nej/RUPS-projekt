import { DraggableComponent } from './DraggableComponent';

export class Switch extends DraggableComponent {
    constructor(x, y) {
        super(x, y);
        this.isOpen = true; // true = nesklenjen krog, false = sklenjen krog
        this.width = 60;
        this.height = 40;
        this.terminals = [
            { x: 0, y: 0 },
            { x: this.width, y: 0 }
        ];
    }

    toggle() {
        this.isOpen = !this.isOpen;
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

        // terminal posts
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(-30, 0, 4, 0, Math.PI * 2);
        ctx.arc(30, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // rocica stikala
        ctx.strokeStyle = this.isOpen ? '#C00' : '#0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-25, 0);
        if (this.isOpen) {
            ctx.lineTo(15, -15); // odprto
        } else {
            ctx.lineTo(25, 0); // zaprto
        }
        ctx.stroke();

        // oznaka
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(this.isOpen ? 'OFF' : 'ON', -12, 25);

        ctx.restore();
    }
}