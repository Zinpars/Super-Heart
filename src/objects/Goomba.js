import Layers from "../config/Layers.js";

export default class Goomba extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, "goomba")
        scene.goombas.add(this);
        this.setDepth(Layers.PLAYER);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setGravityY(900);
        this.body.pushable = false;
        const baseSpeed = 100;
        this.setVelocityX(-baseSpeed);
        this.flipX = true;
        this.name = "Goomba"

        scene.physics.add.collider(this, scene.groundLayer);

        // Collision with player
        scene.physics.add.collider(scene.player, this, () => {
            if (scene.player.y < this.y - this.height / 2) {
                console.log("Player killed Goomba");
                scene.player.body.setVelocityY(-300);
                this.destroy();
            } else {
                console.log("Player got hit by a Goomba!");
                scene.playerDied();
            }

        });

        // Collider between Goombas
        scene.physics.add.collider(scene.goombas, scene.goombas, (goomba1, goomba2) => {
            console.log("Goombas collided");

            // Flip direction for both Goombas
            goomba1.flipX = !goomba1.flipX; // Flip sprite horizontally
            goomba1.setVelocityX(goomba1.flipX ? -baseSpeed : baseSpeed);

            goomba2.flipX = !goomba2.flipX; // Flip sprite horizontally    
            goomba2.setVelocityX(goomba2.flipX ? -baseSpeed : baseSpeed);
        })

        // Add tilemap collision callback for tiles in the wallTiles array
        for (let i = 0; i < scene.wallTiles.length; i++) {
            scene.groundLayer.setTileIndexCallback(
                scene.wallTiles[i],
                (goomba, tile) => {
                    if (goomba.name === "Goomba" && goomba.y > tile.y * scene.tileSize) {
                        console.log("Goomba collided with wall tile " + tile.index);
                        goomba.flipX = !goomba.flipX; // Flip sprite horizontally
                        goomba.body.setVelocityX(goomba.flipX ? -baseSpeed : baseSpeed);
    
                        // Add a delay because velocity won't update properly without
                        scene.time.addEvent({
                            delay: 1,
                            callback: () => {
                                goomba.body.setVelocityX(goomba.flipX ? -baseSpeed : baseSpeed);
                            }
                        })
                    }
                },
                this
            );
        }

        // Goomba falls off the map
        scene.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this && this.y >= scene.game.config.height - this.height) {
                console.log("Goomba fell");
                this.destroy();
            }
        });
    }
}