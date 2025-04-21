import Layers from "../config/Layers.js";

export default class Goal extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, player, width) {
        super(scene, x, y, "goal")
        this.setDepth(Layers.PLAYER);
        scene.add.existing(this);
        scene.physics.add.existing(this);   
        
        let levelComplete = false;
        let fadeout = scene.add.rectangle(0, 0, width, 1600, 0x000000).setAlpha(0).setOrigin(0);
        console.log(width)

        scene.physics.add.overlap(this, player, () => {            
            if (levelComplete) return;
            console.log("Level Complete");
            levelComplete = true;
            scene.tweens.add({
                targets: fadeout,
                duration: 1000,
                alpha: 1,
                onComplete: () => {
                    scene.scene.restart({levelId: scene.levelId + 1});
                }
            })
        })   
    }


}