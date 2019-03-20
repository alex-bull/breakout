import Ball from '../src/ball';
import Paddle from '../src/paddle';
import Tile from '../src/tile';

export class Breakout extends Phaser.Game {
	constructor() {
		super(1280, 720, Phaser.CANVAS, '', {preload: preload, create: create, update: update});

		let paddle;
		let tile;

		let balls;
		let tiles;

		let scoreText;
		let livesText;
		let levelText;

		let retryButton;

		let level = 1;
		let lives = 3;
		let score = 0;

		let impactSound;
		let lossSound;
		let fanfareSound;
		let multiBallSound;

		function preload() {
			//load sprite images
			this.load.image('ball', 'assets/images/ball.png');
			this.load.image('paddle', 'assets/images/paddle.png');
			this.load.image('regTile', 'assets/images/regTile.png');
			this.load.image('multiTile', 'assets/images/multiTile.png');
			this.load.image('retry', 'assets/images/retry.png');

			this.load.audio('impact', 'assets/audio/impact.wav');
			this.load.audio('loss', 'assets/audio/loss.wav');
			this.load.audio('fanfare', 'assets/audio/fanfare.wav');
			this.load.audio('multiball', 'assets/audio/multiBall.wav');
    }

    function create() {
				//change game background colour
				this.stage.backgroundColor = 'DCDCDC';

				//create sound objects
				impactSound = this.add.audio('impact');
				lossSound = this.add.audio('loss');
				fanfareSound = this.add.audio('fanfare');
				multiBallSound = this.add.audio('multiball');

				//collide with world bounds excluding the bottom edge
				this.physics.startSystem(Phaser.Physics.ARCADE);
				this.physics.arcade.checkCollision.down = false;

				//create ball sprites group and add a ball
				balls = this.add.group();
				balls.classType = Ball;
				balls.create(this.world.width*0.5, this.world.height-50, 'ball');
				balls.getTop().deployBall(this.world.width*0.5, this.world.height-50);
				//call loseLife when ball is out of bounds
				balls.getTop().events.onOutOfBounds.add(loseBall, this);

				//create paddle from paddle class
				paddle = new Paddle(this, this.world.width*0.5, this.world.height-50, 'paddle');
				this.add.existing(paddle);

				//create tile sprites group
				tiles = this.add.group();
				tiles.classType = Tile;

				//spawn bricks in a grid, adding them to the tiles group
				for (let y = 0; y < 3; y++) {
					for (let x = 0; x < 9; x++) {
							tile = new Tile(this, 280 + (x * 80), 100 + (y * 50), 'regular', 'regTile', 'multiTile');
							tiles.add(tile);
					}
				}

				//add score counter
				scoreText = this.add.text(20, 30, "Score: " + score, {font: "25px Arial"});
				//add lives counter
				livesText = this.add.text(20, 60, "Lives: " + lives, {font: "25px Arial"});
				//add level counter
				levelText = this.add.text(20, 90, "Level: " + level, {font: "25px Arial"});

				//add and hide retry button
				retryButton = this.add.button(this.world.width*0.5, this.world.height*0.5, 'retry', restartGame, this);
				retryButton.anchor.set(0.5);
				retryButton.kill();

				//scale game window to the device's screen size while maintaining ratio
				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.scale.pageAlignHorizontally = true;
				this.scale.pageAlignVertically = true;
    }

    function update() {
			//paddle follows mouse/touch
			paddle.x = this.input.x;

			//ball will rebound off of paddle and tiles
			this.physics.arcade.collide(paddle, balls, paddleCollision);
			this.physics.arcade.collide(balls, tiles, tileCollision);

    }

		function tileCollision(ball, tile) {
			//hides tiles and increases score
			tile.kill();
			score += 100;
			scoreText.text = "Score: " + score;
			impactSound.play();

			//if multiball tile hit, add another ball to the game
			if (tile.tileType == 'multiBall') {
				balls.create(paddle.x, paddle.y, 'ball');
				balls.getTop().deployBall(paddle.x, paddle.y);
				balls.getTop().events.onOutOfBounds.add(loseBall, this);
				multiBallSound.play();
			}

			//check if all tiles are destroyed. If true, re-deploy ball, level up, and revive all tiles
			if (tiles.countLiving() == 0) {
				tiles.callAll('revive');
				tiles.callAll('randomize');
				score += 500;
				level += 1;
				scoreText.text = "Score: " + score;
				levelText.text = "Level: " + level;
				fanfareSound.play();

				//remove extra balls and re-deploy one
				balls.callAll('kill');
				balls.getBottom().revive();
				balls.getBottom().deployBall(paddle.x, paddle.y);
			}
		}

		function paddleCollision(paddle, ball) {
			//changes angle of rebound based on position of paddle hit
			if (ball.x < paddle.x) {
				ball.body.velocity.x = ((paddle.x - ball.x)*-5);
			} else {
				ball.body.velocity.x = ((ball.x - paddle.x)*5);
			}
		}

		function loseBall(ball) {
			ball.kill();
			//if it was the last ball on screen, lose a life
			if (balls.countLiving() == 0){
				lives -= 1;
				lossSound.play();
				//decrements lives or ends game if out of lives
				if (lives > 0) {
					ball.revive();
					ball.deployBall(paddle.x, paddle.y);
					livesText.text = "Lives: " + lives;
				} else {
					endGame();
				}
			}
		}

		function endGame() {
			//sets objects to their game over states and shows retry button
			livesText.text = "Game Over";
			paddle.kill();
			balls.callAll('kill');
			retryButton.revive();
		}

		function restartGame() {
			//returns all game objects to starting states and begins game again
			paddle.revive();
			tiles.callAll('revive');
			tiles.callAll('randomize');
			balls.getBottom().revive();
			balls.getBottom().deployBall(paddle.x, paddle.y);
			retryButton.kill();
			lives = 3;
			score = 0;
			level = 1;
			scoreText.text = "Score: " + score;
			livesText.text = "Lives: " + lives;
			levelText.text = "level: " + level;
		}
	}
}
