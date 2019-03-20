export default class Ball extends Phaser.Sprite {

  private tileType: string;
  private regImg: string;
  private multiBallImg: string;

  constructor(game: Phaser.Game, x: number, y: number, tileType: string, regImg: string, multiBallImg: string) {
    super(game, x, y, regImg);

    this.regImg = regImg;
    this.multiBallImg = multiBallImg;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

    this.randomize();
  }

  //randomly change the tile type
  randomize() {
    let random = Math.random()*10;

    if (random < 7) {
      this.tileType = 'regular';
      this.loadTexture(this.regImg);
    } else {
      this.tileType = 'multiBall';
      this.loadTexture(this.multiBallImg);
    }
  }
}
