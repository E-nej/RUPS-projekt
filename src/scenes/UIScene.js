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

    // za stalne UI elemente
    // za scoreboarb, nivoje, pavzo, izhod, preklop med scenami, ...
}