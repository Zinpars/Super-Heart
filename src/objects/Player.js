import Layers from "../config/Layers.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, "redHeart")
        this.setDepth(Layers.PLAYER);

        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setGravityY(900);
        this.baseSpeed = 200;
        this.sprintSpeed = this.baseSpeed * 2;
        this.jumpIncrement = 100;
        this.spawnX = x || 100;
        this.spawnY = y || 500;

        scene.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this && this.y >= scene.game.config.height - this.height) {
                console.log("Player fell");
                scene.playerDied();
            }
        });        
    }

    movement(scene, cursor) {
        this.setVelocityX(0);

        let speed = this.baseSpeed;
        if (cursor.shift.isDown) {
            speed = this.sprintSpeed;
        }
        if (cursor.dKey.isDown) {
            this.setVelocityX(speed);
            this.flipX = false;
        }
        if (cursor.aKey.isDown) {
            this.setVelocityX(-speed);
            this.flipX = true;
        }

        // Jump logic
        if (cursor.space.isDown && this.body.onFloor() && this.body.velocity.y > -700) {
            this.body.velocity.y = -300;
            scene.time.addEvent({
                delay: 50,
                callback: () => {
                    if (cursor.space.isDown) this.body.velocity.y -= this.jumpIncrement;
                }               
            })
            scene.time.addEvent({
                delay: 100,
                callback: () => {
                    if (cursor.space.isDown) this.body.velocity.y -= this.jumpIncrement;
                }               
            })
            scene.time.addEvent({
                delay: 150,
                callback: () => {
                    if (cursor.space.isDown) this.body.velocity.y -= this.jumpIncrement;
                }               
            })
            
        }

    }
}