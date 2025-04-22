import BaseScene from './scenes/BaseScene.js';
import Thx from './scenes/Thx.js';

   const config = {
    type: Phaser.AUTO,
    width: 640, // 20 tiles wide
    height: 480, // 15 tiles high
    backgroundColor: "0x888888",
    render: {
        pixelArt: true,
        antialias: false
    },
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, // Scale the game to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game on the screen
    },
    scene: [BaseScene, Thx]
};
   
   const game = new Phaser.Game(config);
   