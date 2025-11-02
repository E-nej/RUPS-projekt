import Phaser from 'phaser';
import LabScene from './labScene';

export default class WorkspaceScene extends Phaser.Scene {
  constructor() {
    super('WorkspaceScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // površje mize
    this.add.rectangle(0, 0, width, height, 0xa0826d).setOrigin(0);
    
    // mreža na mizi
    this.createGrid();
    
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
    switch(type) {
      case 'baterija':
        shape = this.add.rectangle(0, 0, 50, 30, color);
        shape.setStrokeStyle(2, 0x000000);
        const plus = this.add.text(10, 0, '+', { fontSize: '20px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);
        const minus = this.add.text(-10, 0, '-', { fontSize: '20px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);
        component.add([shape, plus, minus]);
        break;
      case 'upor':
        shape = this.add.rectangle(0, 0, 60, 15, color);
        shape.setStrokeStyle(2, 0x000000);
        const zigzag = this.add.graphics();
        zigzag.lineStyle(2, 0x000000);
        zigzag.beginPath();
        zigzag.moveTo(-20, -5);
        zigzag.lineTo(-10, 5);
        zigzag.lineTo(0, -5);
        zigzag.lineTo(10, 5);
        zigzag.lineTo(20, -5);
        zigzag.strokePath();
        component.add([shape, zigzag]);
        break;
      case 'svetilka':
        shape = this.add.circle(0, 0, 15, color);
        shape.setStrokeStyle(2, 0x000000);
        const triangle = this.add.triangle(0, 0, -5, -5, -5, 5, 5, 0, 0x000000);
        component.add([shape, triangle]);
        break;
      case 'stikalo':
        shape = this.add.rectangle(0, 0, 50, 20, color);
        shape.setStrokeStyle(2, 0x000000);
        const lever = this.add.rectangle(0, -10, 4, 20, 0xffffff);
        component.add([shape, lever]);
        break;
      case 'žica':
        shape = this.add.rectangle(0, 0, 60, 8, color);
        shape.setStrokeStyle(2, 0x000000);
        component.add(shape);
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
    
    this.input.setDraggable(component);
    
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
