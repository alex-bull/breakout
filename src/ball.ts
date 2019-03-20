export default class Ball extends Phaser.Sprite {
  constructor(game: Phaser.Game, x: number, y: number, image: string) {
    super(game, x, y, image);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
  }

  //ball deploys in random direction upwards from specified coords
  deployBall(x, y) {
    //random x velocity between -150 anf 150
    let randomInt = Math.floor((Math.random()*301)-150);
    this.reset(x, y);
    this.body.velocity.set(randomInt, -150);
  }
}
