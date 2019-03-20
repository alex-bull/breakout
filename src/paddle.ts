export default class Ball extends Phaser.Sprite {
  constructor(game: Phaser.Game, x: number, y: number, image) {
    super(game, x, y, image);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.anchor.set(0.5);
  }
}
