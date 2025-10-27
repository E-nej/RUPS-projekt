import { DraggableComponent } from './baseComponents';

export class Load extends DraggableComponent {
    constructor(x, y) {
        super(x, y);
        this.resistance = 50;
        this.isOn = false;
        this.brightness = 0; // 0-1
        this.radius = 25;
        this.terminals = [
            { x: 0, y: this.radius + 10 },
            { x: 0, y: -this.radius - 10 }
        ];
    }

    isPointInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius + 10;
    }

    getConnectors() {
        return this.terminals.map(t => ({
            x: this.x + t.x,
            y: this.y + t.y,
            component: this
        }));
    }

    setPower(voltage, current) {
        this.isOn = current > 0.01;
        if (this.isOn) {
            const power = voltage * current;
            this.brightness = Math.min(power / 5, 1); // normaliziraj moc za svetlost
        } else {
            this.brightness = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // krog pri svetilki
        if (this.isOn) {
            // glow efekt
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + 10);
            gradient.addColorStop(0, `rgba(255, 255, 100, ${this.brightness})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 0, ${this.brightness * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // obroba svetilke
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillStyle = this.isOn ? `rgba(255, 255, 150, ${0.3 + this.brightness * 0.7})` : '#FFF';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // polnilo
        ctx.strokeStyle = this.isOn ? '#FF6600' : '#666';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(-4, 5);
        ctx.lineTo(4, -5);
        ctx.lineTo(8, 5);
        ctx.stroke();

        // povezovalne zice
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(0, -this.radius - 10);
        ctx.moveTo(0, this.radius);
        ctx.lineTo(0, this.radius + 10);
        ctx.stroke();

        // pike na terminalih
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(0, -this.radius - 10, 4, 0, Math.PI * 2);
        ctx.arc(0, this.radius + 10, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}