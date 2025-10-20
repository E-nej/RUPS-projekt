import Phaser from 'phaser';

export default class LabScene extends Phaser.Scene {
    constructor() {
        super('LabScene');
    }
    
    create() {
        this.add.text(300, 250, 'Dobrodošel v laboratoriju!', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#222'
        });
    }
}