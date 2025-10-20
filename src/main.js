import './style.css'
import Phaser from 'phaser';

// uvoz scen


const config = {
  type: Phaser.AUTO,            
  width: 800,                    
  height: 600,                   
  backgroundColor: '#f4f6fa',    
  parent: 'game-container',      
  scene: [
    // uvoz scen
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