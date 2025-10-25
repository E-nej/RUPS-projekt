import Phaser from 'phaser';

export default class ScoreboardScene extends Phaser.Scene {
    constructor() {
        super('ScoreboardScene');
    }

        preload() {
        this.load.image('avatar1', 'src/avatars/avatar1.png');
        this.load.image('avatar2', 'src/avatars/avatar2.png');
        this.load.image('avatar3', 'src/avatars/avatar3.png');
        this.load.image('avatar4', 'src/avatars/avatar4.png');
    }
    
    create() {
        this.add.text(200, 0, 'Lestvica', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#222'
        });

        //console.log(JSON.parse(localStorage.getItem('users')));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userLoged = localStorage.getItem('username');

        // HARDCODED TESTIRANJE
        const userToUpdate = users.find(u => u.username === 'enej');
        if (userToUpdate) {
            userToUpdate.score = 130;
            localStorage.setItem('users', JSON.stringify(users));
        }

        users.sort((a, b) => (b.score) - (a.score));
        console.log(users);

        users.forEach((user, index) => {

            const y = 100 + index * 40;
            if(user.profilePic) {
                this.add.image(150, y + 10, user.profilePic)
                .setDisplaySize(40,40)
                .setOrigin(0.5);
            } 
            else {
                this.add.text(100,y + 10, 'NO PFP');
            }
            if (userLoged === user.username) {
                this.add.text(250, y, user.username, { fontSize: '22px', color: 'black', fontStyle: 'bold' });
            }
            else {
                this.add.text(250, y, user.username, { fontSize: '22px', color: 'black', fontStyle: 'normal' });
            }

            this.add.text(200, y, `${index + 1}`, { fontSize: '22px', color: 'gray' });
            this.add.text(500, y, user.score ?? '—', { fontSize: '22px', color: '#0044cc' });
        })


        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('LabScene');
        });


        const backButton = this.add.text(this.scale.width / 2, 560, 'Nazaj', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#0066ff',
            backgroundColor: '#e1e9ff',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setStyle({ color: '#0044cc' }))
            .on('pointerout', () => backButton.setStyle({ color: '#0066ff' }))
            .on('pointerdown', () => {
                this.scene.start('LabScene');
            });



    }
}