import Phaser from "phaser";
import { Battery } from '../compoments/Battery.js';
import { Load } from '../compoments/LOad.js';
import { Switch } from '../compoments/Switch.js';
import { Resistor } from '../compoments/Resistor.js';
import { Wire } from '../compoments/Wire.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.gridSize = 20; // velikost mreže
        this.components = []; // shranjevanje komponent
    }

    drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xcccccc, 0.5);

        // vertikalne črte
        for (let x = 0; x < 800; x += this.gridSize) {
            graphics.moveTo(x, 100);
            graphics.lineTo(x, 500);
        }

        // horizontalne črte
        for (let y = 100; y < 500; y += this.gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(800, y);
        }

        graphics.strokePath();
    }

    createComponentPalette() {
        const components = [
            { type: 'Battery', x: 60, y: 40 },
            { type: 'Resistor', x: 160, y: 40 },
            { type: 'Switch', x: 260, y: 40 },
            { type: 'Load', x: 360, y: 40 },
            { type: 'Wire', x: 460, y: 40 }
        ];

        components.forEach(comp => {
            // slika komponente
            const sprite = this.add.sprite(comp.x, comp.y, comp.type.toLowerCase())
                .setInteractive()
                .setScale(0.8);

            this.input.setDraggable(sprite);

            // oznaka komponente
            this.add.text(comp.x, comp.y + 20, comp.type, {
                fontSize: '14px',
                color: '#000',
                align: 'center'
            }).setOrigin(0.5);

            sprite.on('dragstart', () => {
                const newComponent = this.createComponent(comp.type);
                this.components.push(newComponent);
            });
        });
    }

    // za stalne UI elemente
    // za scoreboarb, nivoje, pavzo, izhod, preklop med scenami, ...
}