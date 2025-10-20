import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#f4f6fa');

        // title igre
        this.add.text(this.scale.width / 2, 200, 'Laboratorij', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#222',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // gumb za zacni igro
        const startButton = this.add.text(this.scale.width / 2, 350, '▶ Začni igro', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#0066ff',
            backgroundColor: '#e1e9ff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true }) 
        .on('pointerover', () => startButton.setStyle({ color: '#0044cc' }))
        .on('pointerout', () => startButton.setStyle({ color: '#0066ff' }))
    }
}