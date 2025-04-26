import Layers from "../config/Layers.js";
import Player from "../objects/Player.js";
import Coin from "../objects/Coin.js";
import Goomba from "../objects/Goomba.js";
import UI from "../objects/UI.js";

export default class BaseScene extends Phaser.Scene {
    constructor() {
        super("BaseScene")
    }

    preload() {
        this.load.image("redHeart", "assets/redHeart.png");
        this.load.image("grasstiles", "assets/grasstiles.png");
        this.load.image("goomba", "assets/goomba.png");
        this.load.image("coin", "assets/coin.png");
        this.load.tilemapTiledJSON("1-1", "assets/1-1.json");
        this.load.tilemapTiledJSON("1-2", "assets/1-2.json");
    }

    create(data) {
        this.coins = 0;
        this.lives = data.lives || 3;     
        this.levelId = data.levelId || 1;
        this.tileSize = 32;
        this.levelComplete = false;
        this.timeLeft = 300;
        
        this.UI = new UI(this);

        // Create the tilemap
        const map = this.make.tilemap({ key: "1-" + this.levelId });
        console.log("Tilemap:", map);

        // Add the tileset image to the map
        const tileset = map.addTilesetImage("grasstiles", "grasstiles");
        console.log("Tileset:", tileset);

        // Create layers
        const backgroundLayer = map.createLayer("backgroundLayer", tileset, 0, 0);
        const groundLayer = map.createLayer('groundLayer', tileset, 0, 0);

        // Move to Thx scene if no more levels are available
        if (!groundLayer) {
            console.log("Thx")
            this.scene.stop(this);
            this.scene.start("Thx");
            return;
        }

        // Enable collision on the ground layer
        groundLayer.setCollisionByProperty({ collides: true });
        groundLayer.setDepth(Layers.TILES);
        this.groundLayer = groundLayer;

        const background = this.add.rectangle(0, 0, groundLayer.width, this.game.config.height, 0x4abdff).setOrigin(0, 0).setDepth(Layers.BACKGROUND).setScale(10);

        this.player = new Player(this, 100, 600);
        this.physics.add.collider(this.player, groundLayer);



        // Add a collider for a specific tile index (e.g., tile index 5)
        groundLayer.setTileIndexCallback(9, (player, tile) => {
            let playerY = player.y - player.height / 2;
            let tileY = tile.y * this.tileSize + tile.height;           
            if (playerY < tileY) return;
            console.log("Player touched tile index " + tile.index);

            // Change the tile's index to a different tile in the tileset
            groundLayer.putTileAt(10, tile.x, tile.y).setCollision(true); // Replace tile at (x, y) with tile index 5

            // Create a coin when coin block is touched
            const coin = new Coin(this, tile.getCenterX(), tile.getCenterY());
            this.coins += 1;
            this.UI.coinText.setText("x " + this.coins);
            this.tweens.add({
                targets: coin,
                duration: 300,
                y: coin.y - 50,
                onComplete: () => {
                    coin.destroy();
                }
            })
        }, this);

        // Complete level if player touches goal
        groundLayer.setTileIndexCallback(8, (player, tile) => {
            if (this.levelComplete) return;
            console.log("Player touched tile index " + tile.index);
            this.startNextLevel();

        });

        // Timer countdown
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft -= 1;
                this.UI.timer.setText("Time: " + this.timeLeft);

                // Kill player if time runs out
                if (this.timeLeft <= 0) {
                    console.log("Time's up!");
                    this.playerDied();
                }
            },
            loop: true
        })

        // World and Camera setup
        this.physics.world.setBounds(0, 0, groundLayer.width, groundLayer.height);
        this.cameras.main.setBounds(0, 0, groundLayer.width, groundLayer.height);
        this.cameras.main.startFollow(this.player);

        // Load enemies from the "Enemies" object layer
        const enemyObjects = map.getObjectLayer("Enemies").objects;
        this.goombas = this.physics.add.group();
        enemyObjects.forEach((enemy) => {
            if (enemy.name === "Goomba") {
                console.log("Spawned Goomba");
                const goomba = new Goomba(this, enemy.x, enemy.y);
            }
            // Add more enemy types here if needed
        });

        // Keybinds
        const cursor = this.input.keyboard.createCursorKeys();
        cursor.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        cursor.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        cursor.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        cursor.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        cursor.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        cursor.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.cursor = cursor;

        cursor.nKey.on("down", () => {
            this.startNextLevel();
        })
    }

    playerDied() {
        console.log("Player died!");
        this.lives -= 1;
        this.UI.livesText.setText("x " + this.lives);
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.scene.restart({ levelId: this.levelId, lives: this.lives });
        }
        
    }

    gameOver() {
        this.physics.pause();
        console.log("Game Over!");
        let fadeout = this.add.rectangle(0, 0, this.groundLayer.width, 1600, 0x000000).setAlpha(0).setOrigin(0).setDepth(Layers.UI);
        let gameOverText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Game Over", { fontSize: "64px", color: "#ffffff" }).setOrigin(0.5).setDepth(Layers.UI).setScrollFactor(0);
        this.tweens.add({
            targets: fadeout,
            duration: 3000,
            alpha: 1,
            onComplete: () => {
                this.scene.restart({ levelId: 1});
            }
        })
       
    }

    startNextLevel() {
        if (this.levelComplete) return;

        let fadeout = this.add.rectangle(0, 0, this.groundLayer.width, 1600, 0x000000).setAlpha(0).setOrigin(0).setDepth(Layers.UI);

        console.log("Level Complete");
        this.levelComplete = true;
        this.tweens.add({
            targets: fadeout,
            duration: 1000,
            alpha: 1,
            onComplete: () => {
                this.scene.restart({ levelId: this.levelId + 1 });
            }
        })
    }

    update() {
        this.player.movement(this, this.cursor);
    }
}