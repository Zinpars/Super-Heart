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
        scene.physics.add.collider(scene.player, this, () => {
            if (scene.player.y < this.y - this.height / 2) {
                console.log("Player killed Goomba");
                this.destroy();
            } else {
                console.log("Player got hit by a Goomba!");
                scene.scene.restart();
            }

        });

        scene.physics.add.collider(scene.goombas, scene.goombas, (goomba1, goomba2) => {
            console.log("Goombas collided");

            // Flip direction for both Goombas
            goomba1.flipX = !goomba1.flipX; // Flip sprite horizontally
            goomba1.setVelocityX(goomba1.flipX ? -baseSpeed : baseSpeed);

            goomba2.flipX = !goomba2.flipX; // Flip sprite horizontally    
            goomba2.setVelocityX(goomba2.flipX ? -baseSpeed : baseSpeed);   
        })

        // Add tilemap collision callback for tiles with the "wall" property
        scene.groundLayer.setTileIndexCallback(
            20, 
            (goomba, tile) => {
                if (tile.properties.wall && goomba.name === "Goomba") {
                    console.log("Goomba collided with wall 20")
                    goomba.flipX = !goomba.flipX; // Flip sprite horizontally
                    goomba.setVelocityX(goomba.flipX ? -baseSpeed : baseSpeed);
                }
            },
            this
        );

        scene.groundLayer.setTileIndexCallback(
            21, 
            (goomba, tile) => {
                if (tile.properties.wall && goomba.name === "Goomba") {
                    console.log("Goomba collided with wall 21")
                    goomba.flipX = !goomba.flipX; // Flip sprite horizontally
                    goomba.setVelocityX(goomba.flipX ? -baseSpeed : baseSpeed);
                }
            },
            this
        );


        scene.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this && this.y >= scene.game.config.height - this.height) {
                console.log("Goomba fell");
                this.destroy();
            }
        });
    }
}