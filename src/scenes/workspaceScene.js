import Phaser, { NONE } from 'phaser';
import LabScene from './labScene';
import { Battery } from '../components/battery';
import { Bulb } from '../components/bulb';
import { Wire } from '../components/wire';
import { CircuitGraph } from '../logic/circuit_graph';
import { Node } from '../logic/node';

export default class WorkspaceScene extends Phaser.Scene {
  constructor() {
    super('WorkspaceScene');
  }


  init() {
    const savedIndex = localStorage.getItem('currentChallengeIndex');
    this.currentChallengeIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
  }

  preload() {
    this.graph = new CircuitGraph();

    this.load.image('baterija', 'src/components/battery.png');
    this.load.image('upor', 'src/components/resistor.png');
    this.load.image('svetilka', 'src/components/lamp.png');
    this.load.image('stikalo-on', 'src/components/switch-on.png');
    this.load.image('stikalo-off', 'src/components/switch-off.png');
    this.load.image('žica', 'src/components/wire.png');
    this.load.image('ampermeter', 'src/components/ammeter.png');
    this.load.image('voltmeter', 'src/components/voltmeter.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // površje mize
    const desk = this.add.rectangle(0, 0, width, height, 0xe0c9a6).setOrigin(0);
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x8b7355, 0.35);
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, height);
      gridGraphics.strokePath();
    }
    for (let y = 0; y < height; y += gridSize) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(width, y);
      gridGraphics.strokePath();
    }

    // mreža na mizi


    this.challenges = [
      {
        prompt: 'Sestavi preprosti električni krog z baterijo in svetilko.',
        requiredComponents: ['baterija', 'svetilka', 'žica', 'žica', 'žica', 'žica', 'žica', 'žica'],
        theory: ['Osnovni električni krog potrebuje vir, to je v našem primeru baterija. Potrebuje tudi porabnike, to je svetilka. Električni krog je v našem primeru sklenjen, kar je nujno potrebno, da električni tok teče preko prevodnikov oziroma žic.']
      },
      {
        prompt: 'Sestavi preprosti nesklenjeni električni krog z baterijo, svetilko in stikalom.',
        requiredComponents: ['baterija', 'svetilka', 'žica', 'stikalo-off'],
        theory: ['V nesklenjenem krogu je stikalo odprto, kar pomeni, da je električni tok prekinjen. Svetilka posledično zato ne sveti. Stikalo si predstavljaj kot vrata - kadar so odprta, tok ne teče.']
      },
      {
        prompt: 'Sestavi preprosti sklenjeni električni krog z baterijo, svetilko in stikalom.',
        requiredComponents: ['baterija', 'svetilka', 'žica', 'stikalo-on'],
        theory: ['V sklenjenem krogu je stikalo zaprto, kar pomeni, da lahko električni tok teče neovirano. Torej v tem primeru so vrata zaprta.']
      },
      {
        prompt: 'Sestavi električni krog z baterijo, svetilko in stikalom, ki ga lahko ugašaš in prižigaš.',
        requiredComponents: ['baterija', 'svetilka', 'žica', 'stikalo-on', 'stikalo-off'],
        theory: ['Stikalo nam omogoča nadzor nad pretokom električnega toka. Ko je stikalo zaprto, tok teče in posledično svetilka sveti. Kadar pa je stikalo odprto, tok ne teče in se svetilka ugasne. To lahko primerjamo z vklapljanjem in izklapljanjem električnih naprav v naših domovih.']
      },
      {
        prompt: 'Sestavi krog z dvema baterijama in svetilko. ',
        requiredComponents: ['baterija', 'baterija', 'svetilka', 'žica'],
        theory: ['Kadar vežemo dve ali več baterij zaporedno, se napetosti seštevajo. Večja je napetost, večji je električni tok. V našem primeru zato svetilka sveti močneje.']
      },
      {
        prompt: 'V električni krog zaporedno poveži dve svetilki, ki ju priključiš na baterijo. ',
        requiredComponents: ['baterija', 'svetilka', 'svetilka', 'žica'],
        theory: ['V zaporedni vezavi teče isti električni tok skozi vse svetilke. Napetost baterije se porazdeli. Če imamo primer, da ena svetilka preneha delovati, bo ta prekinila tok skozi drugo svetilko.']
      },

      {
        prompt: 'V električni krog vzporedno poveži dve svetilki, ki ju priključiš na baterijo. ',
        requiredComponents: ['baterija', 'svetilka', 'svetilka', 'žica'],
        theory: ['V vzporedni vezavi ima vsaka svetilka enako napetost kot baterija. Eletrični tok se porazdeli med svetilkami. Če ena svetilka preneha delovati, bo druga še vedno delovala.']
      },
      {
        prompt: 'Sestavi električni krog s svetilko in uporom. ',
        requiredComponents: ['baterija', 'svetilka', 'žica', 'upor'],
        theory: ['Upor omejuje tok v krogu. Večji kot je upor, manjši je tok. Spoznajmo Ohmov zakon: tok (I) = napetost (U) / upornost (R). Svetilka bo svetila manj intenzivno, saj skozi njo teče manjši tok.']
      },
      
    ];

    // this.currentChallengeIndex = 0;

    this.promptText = this.add.text(width / 2, height - 30, this.challenges[this.currentChallengeIndex].prompt, {
      fontSize: '20px',
      color: '#333',
      fontStyle: 'bold',
      backgroundColor: '#ffffff88',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    this.checkText = this.add.text(width / 2, height - 70, '', {
      fontSize: '18px',
      color: '#cc0000',
      fontStyle: 'bold',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    const buttonWidth = 180;
    const buttonHeight = 45;
    const cornerRadius = 10;

    const makeButton = (x, y, label, onClick) => {
      const bg = this.add.graphics();
      bg.fillStyle(0x3399ff, 1);
      bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

      const text = this.add.text(x, y, label, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          bg.clear();
          bg.fillStyle(0x0f5cad, 1);
          bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        })
        .on('pointerout', () => {
          bg.clear();
          bg.fillStyle(0x3399ff, 1);
          bg.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        })
        .on('pointerdown', onClick);

      return { bg, text };
    };

    makeButton(width - 140, 60, 'Lestvica', () => this.scene.start('ScoreboardScene', { cameFromMenu: false }));
    makeButton(width - 140, 120, 'Preveri krog', () => this.checkCircuit());
    makeButton(width - 140, 180, 'Simulacija', () => this.graph.simulate());

    // stranska vrstica na levi
    const panelWidth = 150;
    this.add.rectangle(0, 0, panelWidth, height, 0xc0c0c0).setOrigin(0);
    this.add.rectangle(0, 0, panelWidth, height, 0x000000, 0.2).setOrigin(0);

    this.add.text(panelWidth / 2, 60, 'Komponente', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // komponente v stranski vrstici
    this.createComponent(panelWidth / 2, 100, 'baterija', 0xffcc00);
    this.createComponent(panelWidth / 2, 180, 'upor', 0xff6600);
    this.createComponent(panelWidth / 2, 260, 'svetilka', 0xff0000);
    this.createComponent(panelWidth / 2, 340, 'stikalo-on', 0x666666);
    this.createComponent(panelWidth / 2, 420, 'stikalo-off', 0x666666);
    this.createComponent(panelWidth / 2, 500, 'žica', 0x0066cc);
    this.createComponent(panelWidth / 2, 580, 'ampermeter', 0x00cc66);
    this.createComponent(panelWidth / 2, 660, 'voltmeter', 0x00cc66);

    const backButton = this.add.text(12, 10, '↩ Nazaj', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#387affff',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => backButton.setStyle({ color: '#0054fdff' }))
      .on('pointerout', () => backButton.setStyle({ color: '#387affff' }))
      .on('pointerdown', () => {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.start('LabScene');
        });
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

    // const scoreButton = this.add.text(this.scale.width / 1.1, 25, 'Lestvica', {
    //   fontFamily: 'Arial',
    //   fontSize: '18px',
    //   color: '#0066ff',
    //   backgroundColor: '#e1e9ff',
    //   padding: { x: 20, y: 10 }
    // })
    //   .setOrigin(0.5)
    //   .setInteractive({ useHandCursor: true })
    //   .on('pointerover', () => scoreButton.setStyle({ color: '#0044cc' }))
    //   .on('pointerout', () => scoreButton.setStyle({ color: '#0066ff' }))
    //   .on('pointerdown', () => {
    //     this.scene.start('ScoreboardScene', { cameFromMenu: false });
    //     // localStorage.removeItem('username');
    //     // this.scene.start('MenuScene');
    //   });

    // const simulate = this.add.text(this.scale.width / 1.1, 25, 'Simulacija', {
    //   fontFamily: 'Arial',
    //   fontSize: '18px',
    //   color: '#0066ff',
    //   backgroundColor: '#e1e9ff',
    //   padding: { x: 20, y: 10 }
    // })
    //   .setOrigin(0.5, -1)
    //   .setInteractive({ useHandCursor: true })
    //   .on('pointerover', () => scoreButton.setStyle({ color: '#0044cc' }))
    //   .on('pointerout', () => scoreButton.setStyle({ color: '#0066ff' }))
    //   .on('pointerdown', () => {
    //     console.log(this.graph);
    //     this.graph.simulate();
    //   });

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

  getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  updateLogicNodePositions(component) {
    const comp = component.getData('logicComponent');
    if (!comp) return;

    let offsetY = 0;
    let offsetX = 40;

    if (component.getData('isRotated')) {
      offsetX = 0;
      offsetY = 40;
    }

    if (comp.start) {
      comp.start.x = component.x + offsetX; // store offsets in Node or Component
      comp.start.y = component.y + offsetY;
      this.graph.addNode(comp.start);
    }
    if (comp.end) {
      comp.end.x = component.x + offsetX * -1;
      comp.end.y = component.y + offsetY * -1;
      this.graph.addNode(comp.end);
    }
  }

  createComponent(x, y, type, color) {
    const component = this.add.container(x, y);

    let comp;
    const offset = 40;
    let componentImage;
    let id;

    switch (type) {
      case 'baterija':
        id = "bat_" + this.getRandomInt(1000, 9999);
        comp = new Battery(
          id,
          new Node(id + '_start', -40, 0),
          new Node(id + '_end', 40, 0),
          3.3
        );
        componentImage = this.add.image(0, 0, 'baterija')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;

      case 'upor':
        id = "res_" + this.getRandomInt(1000, 9999);
        componentImage = this.add.image(0, 0, 'upor')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;

      case 'svetilka':
        id = "bulb_" + this.getRandomInt(1000, 9999);
        comp = new Bulb(
          id,
          new Node(id + '_start', -40, 0),
          new Node(id + '_end', 40, 0)
        );
        componentImage = this.add.image(0, 0, 'svetilka')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;

      case 'stikalo-on':
        id = "switch_" + this.getRandomInt(1000, 9999);
        componentImage = this.add.image(0, 0, 'stikalo-on')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;

      case 'stikalo-off':
        id = "switch_" + this.getRandomInt(1000, 9999);
        componentImage = this.add.image(0, 0, 'stikalo-off')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;

      case 'žica':
        id = "wire_" + this.getRandomInt(1000, 9999);
        comp = new Wire(
          id,
          new Node(id + '_start', -40, 0),
          new Node(id + '_end', 40, 0)
        );
        componentImage = this.add.image(0, 0, 'žica')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', comp)
        break;
      case 'ampermeter':
        id = "ammeter_" + this.getRandomInt(1000, 9999);
        componentImage = this.add.image(0, 0, 'ampermeter')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', NONE)
        break;
      case 'voltmeter':
        id = "voltmeter_" + this.getRandomInt(1000, 9999);
        componentImage = this.add.image(0, 0, 'voltmeter')
          .setOrigin(0.5)
          .setDisplaySize(100, 100);
        component.add(componentImage);
        component.setData('logicComponent', NONE)
        break;  
    }

    // 🔴 Add debug dots only if component has start/end nodes
    if (comp && comp.start && comp.end) {
      const startDot = this.add.circle(comp.start.x, comp.start.y, 5, comp.debug_color ?? 0xff0000);
      const endDot = this.add.circle(comp.end.x, comp.end.y, 5, comp.debug_color ?? 0xff0000);
      component.add(startDot);
      component.add(endDot);
      component.setData('startDot', startDot);
      component.setData('endDot', endDot);
    }

    // Label
    const label = this.add.text(0, 30, type, {
      fontSize: '11px',
      color: '#fff',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 },
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
    if (comp) component.setData('logicComponent', comp);
    component.setData('isDragging', false);

    this.input.setDraggable(component);

    component.on('dragstart', () => {
      component.setData('isDragging', true);
    });

    component.on('drag', (pointer, dragX, dragY) => {
      component.x = dragX;
      component.y = dragY;
    });

    component.on('dragend', () => {
      const isInPanel = component.x < 200;

      if (isInPanel && !component.getData('isInPanel')) {
        // če je ob strani, se odstrani
        component.destroy();
      } else if (!isInPanel && component.getData('isInPanel')) {
        // s strani na mizo
        const snapped = this.snapToGrid(component.x, component.y);
        component.x = snapped.x;
        component.y = snapped.y;

        const comp = component.getData('logicComponent');
        if (comp) {
          console.log("Component: " + comp)
          this.graph.addComponent(comp);

          // Add start/end nodes to graph if they exist
          if (comp.start) this.graph.addNode(comp.start);
          if (comp.end) this.graph.addNode(comp.end);
        }

        this.updateLogicNodePositions(component);

        component.setData('isRotated', false);
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

        this.updateLogicNodePositions(component);

      } else {
        // postavi se nazaj na originalno mesto
        component.x = component.getData('originalX');
        component.y = component.getData('originalY');

        this.updateLogicNodePositions(component);

      }

      this.time.delayedCall(500, () => {
        component.setData('isDragging', false);
      });
    });

    component.on('pointerdown', () => {
      if (!component.getData('isInPanel')) {
        const currentRotation = component.getData('rotation');
        const newRotation = (currentRotation + 90) % 360;
        component.setData('rotation', newRotation);
        component.setData('isRotated', !component.getData('isRotated'));

        this.tweens.add({
          targets: component,
          angle: newRotation,
          duration: 150,
          ease: 'Cubic.easeOut',
        });
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


  checkCircuit() {
    const currentChallenge = this.challenges[this.currentChallengeIndex];
    const placedTypes = this.placedComponents.map(comp => comp.getData('type'));
    console.log("components", placedTypes);
    // preverjas ce so vse komponente na mizi
    if (!currentChallenge.requiredComponents.every(req => placedTypes.includes(req))) {
      this.checkText.setText('Manjkajo komponente za krog.');
      return;
    }

    // je pravilna simulacija 


    // je zaprt krog

    this.checkText.setStyle({ color: '#00aa00' });
    this.checkText.setText('Čestitke! Krog je pravilen.');
    this.addPoints(10);

    if (currentChallenge.theory) {
      this.showTheory(currentChallenge.theory);
    }
    else {
      this.checkText.setStyle({ color: '#00aa00' });
      this.checkText.setText('Čestitke! Krog je pravilen.');
      this.addPoints(10);
      this.time.delayedCall(2000, () => this.nextChallenge());
    }
    // this.placedComponents.forEach(comp => comp.destroy());
    // this.placedComponents = [];
    // this.time.delayedCall(2000, () => this.nextChallenge());
    // const isCorrect = currentChallenge.requiredComponents.every(req => placedTypes.includes(req));
    // if (isCorrect) {
    //   this.checkText.setText('Čestitke! Krog je pravilen.');
    //   this.addPoints(10);
    //   this.time.delayedCall(2000, () => this.nextChallenge());
    // }
    // else {
    //   this.checkText.setText('Krog ni pravilen. Poskusi znova.');
    // }
  }

  nextChallenge() {
    this.currentChallengeIndex++;
    localStorage.setItem('currentChallengeIndex', this.currentChallengeIndex.toString());
    this.checkText.setText('');

    if (this.currentChallengeIndex < this.challenges.length) {
      this.promptText.setText(this.challenges[this.currentChallengeIndex].prompt);
    }
    else {
      this.promptText.setText('Vse naloge so uspešno opravljene! Čestitke!');
      localStorage.removeItem('currentChallengeIndex');
    }
  }

  addPoints(points) {
    const user = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.username === user);
    if (userData) {
      userData.score = (userData.score || 0) + points;
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  showTheory(theoryText) {
    const { width, height } = this.cameras.main;

    this.theoryBack = this.add.rectangle(width / 2, height / 2, width - 100, 150, 0x000000, 0.8)
      .setOrigin(0.5)
      .setDepth(10);

    this.theoryText = this.add.text(width / 2, height / 2, theoryText, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: width - 150 }
    })
      .setOrigin(0.5)
      .setDepth(11);

    this.continueButton = this.add.text(width / 2, height / 2 + 70, 'Nadaljuj', {
      fontSize: '18px',
      color: '#0066ff',
      backgroundColor: '#ffffff',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setDepth(11)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.continueButton.setStyle({ color: '#0044cc' }))
      .on('pointerout', () => this.continueButton.setStyle({ color: '#0066ff' }))
      .on('pointerdown', () => {
        this.hideTheory();
        this.placedComponents.forEach(comp => comp.destroy());
        this.placedComponents = [];
        this.nextChallenge();
      });


  }

  hideTheory() {
    if (this.theoryBack) {
      this.theoryBack.destroy();
      this.theoryBack = null;
    }
    if (this.theoryText) {
      this.theoryText.destroy();
      this.theoryText = null;
    }
    if (this.continueButton) {
      this.continueButton.destroy();
      this.continueButton = null;
    }
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
