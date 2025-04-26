import Layers from "../config/Layers.js";

export default class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, "coin")
        this.setDepth(Layers.OBJECT);
        this.setOrigin(0.5);

        scene.add.existing(this);
    }
}