import Layers from "../config/Layers.js";

export default class UI {
    constructor(scene) {
        const padding = 10;
        const style = {fontSize: "32px"}

        const lives = scene.add.image(padding, padding, "redHeart").setScrollFactor(0).setOrigin(0);
        this.livesText = scene.add.text(lives.x + lives.width + padding, lives.y, "x " + scene.lives, style).setScrollFactor(0);

        const coin = scene.add.image(padding, lives.y + lives.height + padding, "coin").setScrollFactor(0).setOrigin(0);
        this.coinText = scene.add.text(coin.x + coin.width + padding, coin.y, "x " + scene.coins, style).setScrollFactor(0);

        this.timer = scene.add.text(scene.game.config.width - padding, padding, "Time: " + scene.timeLeft, style).setScrollFactor(0).setOrigin(1, 0);
    }
}