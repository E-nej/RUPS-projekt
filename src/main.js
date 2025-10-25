import './style.css'
import Phaser from 'phaser';

// uvoz scen
import UIScene from './scenes/UIScene';
import PreloadScene from './scenes/preloadScene';
import MenuScene from './scenes/menuScene';
import LabScene from './scenes/labScene';
import LoginScene from './scenes/loginScene';
import ScoreboardScene from './scenes/scoreboardScene';

const config = {
  type: Phaser.AUTO,            
  width: 800,                    
  height: 600,                   
  backgroundColor: '#f4f6fa',    
  parent: 'game-container',      
  scene: [
    // uvoz scen
    MenuScene,
    LabScene,
    PreloadScene,
    UIScene,
    LoginScene,
    ScoreboardScene
  ],
  physics: {
    default: 'arcade',           
    arcade: {
      gravity: { y: 0 },         
      debug: false               
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,      
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};


new Phaser.Game(config);