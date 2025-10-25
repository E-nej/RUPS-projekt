import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        this.add.text(200, 100, 'Vnesi svoje uporabniško ime in geslo!', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#222'
        });

        const username = document.createElement('input');
        username.type = 'text';
        username.placeholder = 'Uporabniško ime';
        username.style.position = 'absolute';
        username.style.width = '400px';
        username.style.left = '400px';
        username.style.top = '180px';
        username.style.borderRadius = '8px';
        username.style.padding = '5px';
        document.body.appendChild(username);

        const password = document.createElement('input');
        password.type = 'password';
        password.placeholder = 'Geslo';
        password.style.position = 'absolute';
        password.style.width = '400px';
        password.style.left = '400px';
        password.style.top = '230px';
        password.style.borderRadius = '8px';
        password.style.padding = '5px';
        document.body.appendChild(password);

        // const profilePic = document.createElement('input');
        // profilePic.type = 'file';
        // profilePic.accept = 'image/*';
        // profilePic.style.position = 'absolute';
        // profilePic.style.width = '400px';
        // profilePic.style.left = '400px';
        // profilePic.style.top = '290px';
        // document.body.appendChild(profilePic);

        //console.log(profilePic);

        const loginButton = this.add.text(this.scale.width / 2, 300, 'Prijavi se', {
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
                const usernameTrim = username.value.trim();
                const passwordTrim = password.value.trim();
                const pfps = ['avatar1', 'avatar2', 'avatar3', 'avatar4',  'avatar5', 'avatar6', 'avatar7', 'avatar8',  'avatar9',  'avatar10', 'avatar11'];
                const pfpKey = pfps[Math.floor(Math.random() * pfps.length)];
                // const profilePicTrim = profilePic.value.split('\\').pop();
                // console.log(profilePicTrim);

                if (usernameTrim && passwordTrim) {
                    const existingUser = users.find(u => u.username == usernameTrim);
                    if (existingUser) {
                        if (existingUser.password !== passwordTrim) {
                            alert('Napacno geslo!');
                            return;
                        }
                    }
                    else {
                        users.push({ username: usernameTrim, password: passwordTrim, score: 0, profilePic: pfpKey });
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    localStorage.setItem('username', usernameTrim);
                    localStorage.setItem('profilePic', pfpKey);

                    username.blur();
                    password.blur();
                    username.remove();
                    password.remove();

                    this.scene.start('LabScene');
                }
                else {
                    alert('Vnesi uporabniško ime!');
                }


            });

        this.events.once('shutdown', () => {
            username.remove();
            password.remove();
        });

        localStorage.clear();


        // this.input.keyboard.on('keydown-ESC', () => {
        //     this.scene.start('MenuScene');
        // });
    }
}