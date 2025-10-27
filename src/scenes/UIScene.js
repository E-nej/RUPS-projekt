import Phaser from "phaser";
import { Battery } from '../components/Battery.js';
import { Load } from '../components/Load.js';
import { Switch } from '../components/Switch.js';
import { Resistor } from '../components/Resistor.js';
import { Wire } from '../components/Wire.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.gridSize = 20; // velikost mreže
        this.components = []; // shranjevanje komponent
    }

    create() {
        // ozadje mize
        this.add.rectangle(0, 100, 800, 400, 0xf0f0f0)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0x333333);

        this.drawGrid();
        this.createComponentPalette();

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // pozicioniranje na mrežo
            gameObject.x = Math.round(dragX / this.gridSize) * this.gridSize;
            gameObject.y = Math.round(dragY / this.gridSize) * this.gridSize;
        });
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