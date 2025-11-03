import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#f4f6fa');

        const username = localStorage.getItem('username');
        if (username) {
            this.scene.start('LabScene');
            return;
        }

        // title igre
        this.add.text(this.scale.width / 2, 200, 'Laboratorij', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#222',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // gumb za zacni igro
        // const startButton = this.add.text(this.scale.width / 2, 350, '▶ Začni igro', {
        //     fontFamily: 'Arial',
        //     fontSize: '28px',
        //     color: '#0066ff',
        //     backgroundColor: '#e1e9ff',
        //     padding: { x: 20, y: 10 }
        // })
        //     .setOrigin(0.5)
        //     .setInteractive({ useHandCursor: true })
        //     .on('pointerover', () => startButton.setStyle({ color: '#0044cc' }))
        //     .on('pointerout', () => startButton.setStyle({ color: '#0066ff' }))
        //     .on('pointerdown', () => {
        //         this.scene.start('LabScene');
        //     });

        const loginButton = this.add.text(this.scale.width / 2, 270, '▶ Začni igro', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#0066ff',
            backgroundColor: '#e1e9ff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => loginButton.setStyle({ color: '#0044cc' }))
            .on('pointerout', () => loginButton.setStyle({ color: '#0066ff' }))
            .on('pointerdown', () => {
                this.scene.start('LoginScene');
            });

        console.log(`${localStorage.getItem('username')}`);
    }
}