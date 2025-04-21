import Layers from "../config/Layers.js";

export default class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, "coin", 1)
        this.setDepth(Layers.OBJECT);
        this.setOrigin(0.5);
        this.setScale(2);

        scene.add.existing(this);
    }
}