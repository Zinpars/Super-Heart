

export default class Thx extends Phaser.Scene {
    constructor() {
        super("Thx")
    }

    create() {
        this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setOrigin(0);
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Thanks for Playing", {fontSize: 50}).setOrigin(0.5);

        const button = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2 + 100, 200, 50, 0x888888).setOrigin(0.5).setInteractive();
        this.add.text(button.x, button.y, "Play Again", {fontSize: 32}).setOrigin(0.5);

        button.on("pointerover", () => {
            button.fillColor = 0xbbbbbb;
        })

        button.on("pointerout", () => {
            button.fillColor = 0x888888;
        })

        button.on("pointerup", () => {
            this.scene.stop();
            this.scene.start("BaseScene", {levelId: 1})
        })
    }
}