import Phaser from 'phaser';
import LabScene from './labScene';

export default class WorkspaceScene extends Phaser.Scene {
  constructor() {
    super('WorkspaceScene');
  }

  preload() {
    this.load.image('baterija', 'src/components/battery.png');
    this.load.image('upor', 'src/components/resistor.png');
    this.load.image('svetilka', 'src/components/lamp.png');
    this.load.image('stikalo-on', 'src/components/switch-on.png');
    this.load.image('stikalo-off', 'src/components/switch-off.png');
    this.load.image('žica', 'src/components/wire.png');
    }

  create() {
    const { width, height } = this.cameras.main;

    // površje mize
    this.add.rectangle(0, 0, width, height, 0xa0826d).setOrigin(0);
    
    // mreža na mizi
    this.createGrid();

    // stranska vrstica na levi
    const panelWidth = 150;
    this.add.rectangle(0, 0, panelWidth, height, 0x565656).setOrigin(0);
    this.add.rectangle(0, 0, panelWidth, height, 0x000000, 0.3).setOrigin(0);
    
    this.add.text(panelWidth / 2, 30, 'Komponente', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // komponente v stranski vrstici
    this.createComponent(panelWidth / 2, 120, 'baterija', 0xffcc00);
    this.createComponent(panelWidth / 2, 200, 'upor', 0xff6600);
    this.createComponent(panelWidth / 2, 280, 'svetilka', 0xff0000);
    this.createComponent(panelWidth / 2, 360, 'stikalo-on', 0x666666);
    this.createComponent(panelWidth / 2, 440, 'stikalo-off', 0x666666);
    this.createComponent(panelWidth / 2, 520, 'žica', 0x0066cc);
    
    const backButton = this.add.rectangle(panelWidth / 2, height - 40, 120, 40, 0x4a4a4a)
      .setInteractive({ useHandCursor: true });
    const backText = this.add.text(panelWidth / 2, height - 40, 'Nazaj', {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    backButton.on('pointerdown', () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('LabScene');
      });
    });
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(0x5a5a5a);
    });
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x4a4a4a);
    });
    
    this.add.text(width / 2 + 50, 30, 'Povleci komponente na mizo in zgradi svoj električni krog!\nNamig: dvojni klik na komponento, da jo obrneš.', {
      fontSize: '20px',
      color: '#333',
      fontStyle: 'bold',
      align: 'center',
      backgroundColor: '#ffffff88',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);
    
    // shrani komponente na mizi
    this.placedComponents = [];
    this.gridSize = 40;

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

  createGrid() {
    const { width, height } = this.cameras.main;
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(2, 0x8b7355, 0.4);
    
    const gridSize = 40;
    const startX = 200;
    
    // vertikalne črte
    for (let x = startX; x < width; x += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, height);
      gridGraphics.strokePath();
    }
    
    // horizontalne črte
    for (let y = 0; y < height; y += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(startX, y);
      gridGraphics.lineTo(width, y);
      gridGraphics.strokePath();
    }
  }

  snapToGrid(x, y) {
    const gridSize = this.gridSize;
    const startX = 200;
    
    // komponeta se postavi na presečišče
    const snappedX = Math.round((x - startX) / gridSize) * gridSize + startX;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    return { x: snappedX, y: snappedY };
  }

  createComponent(x, y, type, color) {
    const component = this.add.container(x, y);
    
    // različne oblike glede na komponento
    let shape;
    let componentImage;

    switch(type) {
      case 'baterija':
        componentImage = this.add.image(0, 0, 'baterija').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
      case 'upor':
        componentImage = this.add.image(0, 0, 'upor').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
      case 'svetilka':
        componentImage = this.add.image(0, 0, 'svetilka').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
      case 'stikalo-on':
        componentImage = this.add.image(0, 0, 'stikalo-on').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
      case 'stikalo-off':
        componentImage = this.add.image(0, 0, 'stikalo-off').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
      case 'žica':
        componentImage = this.add.image(0, 0, 'žica').setOrigin(0.5).setDisplaySize(100, 100);
        component.add(componentImage);
        break;
    }
    
    // oznaka
    const label = this.add.text(0, 30, type, {
      fontSize: '11px',
      color: '#fff',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);
    component.add(label);
    
    component.setSize(70, 70);
    component.setInteractive({ draggable: true, useHandCursor: true });
    
    // shrani originalno pozicijo in tip
    component.setData('originalX', x);
    component.setData('originalY', y);
    component.setData('type', type);
    component.setData('color', color);
    component.setData('isInPanel', true);
    component.setData('rotation', 0);
    component.setData('isDragging', false);
    
    this.input.setDraggable(component);

    component.on('dragstart', () => {
      component.setData('isDragging', true);
    });
    
    component.on('drag', (pointer, dragX, dragY) => {
      component.x = dragX;
      component.y = dragY;
    });
    
    component.on('dragend', (pointer) => {
      const isInPanel = component.x < 200;
      
      if (isInPanel && !component.getData('isInPanel')) {
        // če je ob strani, se odstrani
        component.destroy();
      } else if (!isInPanel && component.getData('isInPanel')) {
        // s strani na mizo
        const snapped = this.snapToGrid(component.x, component.y);
        component.x = snapped.x;
        component.y = snapped.y;
        component.setData('isInPanel', false);
        
        this.createComponent(
          component.getData('originalX'),
          component.getData('originalY'),
          component.getData('type'),
          component.getData('color')
        );
        
        this.placedComponents.push(component);
      } else if (!component.getData('isInPanel')) {
        // na mizi in se postavi na mrežo
        const snapped = this.snapToGrid(component.x, component.y);
        component.x = snapped.x;
        component.y = snapped.y;
      } else {
        // postavi se nazaj na originalno mesto
        component.x = component.getData('originalX');
        component.y = component.getData('originalY');
      }

      this.time.delayedCall(500, () => {
        component.setData('isDragging', false);
      });
    });

    component.on('pointerdown', (pointer) => {
      this.time.delayedCall(500, () => {
        if (!component.getData('isInPanel') && !component.getData('isDragging')) {
            const currentRotation = component.getData('rotation');
            const newRotation = (currentRotation + 90) % 360;
            component.setData('rotation', newRotation);

            this.tweens.add({
                targets: component,
                angle: newRotation,
                duration: 150,
                ease: 'Cubic.easeOut'
            });
        }
      });
    });
    
    // hover efekt
    component.on('pointerover', () => {
      component.setScale(1.1);
    });
    
    component.on('pointerout', () => {
      component.setScale(1);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#f0f0f0',
  scale: {
    mode: Phaser.Scale.RESIZE,            
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [LabScene, WorkspaceScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};
