import Phaser from 'phaser';

export default class LabScene extends Phaser.Scene {
    constructor() {
        super('LabScene');
    }

    preload() {
        this.load.image('avatar1', 'src/avatars/avatar1.png');
        this.load.image('avatar2', 'src/avatars/avatar2.png');
        this.load.image('avatar3', 'src/avatars/avatar3.png');
        this.load.image('avatar4', 'src/avatars/avatar4.png');
        this.load.image('avatar5', 'src/avatars/avatar5.png');
        this.load.image('avatar6', 'src/avatars/avatar6.png');
        this.load.image('avatar7', 'src/avatars/avatar7.png');
        this.load.image('avatar8', 'src/avatars/avatar8.png');
        this.load.image('avatar9', 'src/avatars/avatar9.png');
        this.load.image('avatar10', 'src/avatars/avatar10.png');
        this.load.image('avatar11', 'src/avatars/avatar11.png');
    }

    create() {
        const username = localStorage.getItem('username');
        const pfp = localStorage.getItem('profilePic');
        console.log(pfp);
        this.add.image(160, 24, pfp)
                .setDisplaySize(40,40)
                .setOrigin(0.5);
        this.add.text(200, 10, `Dobrodošel v laboratoriju, uporabnik ${username}!`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#222'
        });

        const logoutButton = this.add.text(this.scale.width / 2, 560, 'Odjavi se', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#0066ff',
            backgroundColor: '#e1e9ff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => logoutButton.setStyle({ color: '#0044cc' }))
            .on('pointerout', () => logoutButton.setStyle({ color: '#0066ff' }))
            .on('pointerdown', () => {
                localStorage.removeItem('username');
                this.scene.start('MenuScene');
            });

        const scoreButton = this.add.text(this.scale.width / 1.1, 25, 'Lestvica', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#0066ff',
            backgroundColor: '#e1e9ff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => scoreButton.setStyle({ color: '#0044cc' }))
            .on('pointerout', () => scoreButton.setStyle({ color: '#0066ff' }))
            .on('pointerdown', () => {
                this.scene.start('ScoreboardScene');
                // localStorage.removeItem('username');
                // this.scene.start('MenuScene');
            });

        // this.input.keyboard.on('keydown-ESC', () => {
        //     this.scene.start('MenuScene');
        // });



        //console.log(`${localStorage.getItem('username')}`);
        console.log(JSON.parse(localStorage.getItem('users')));
    }
}