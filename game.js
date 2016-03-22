var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var charSelect = function() {

		var characters = [
			'blocky',
			'baldy',
			'robby',
			'cardy',
			'ducky'
		];

		var ranint = Math.floor(Math.random()*characters.length);
		return characters[ranint];

}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var mainState = {
	preload: function() {

		game.stage.backgroundColor = '#3498db';

		game.load.image('blocky', 'images/characters/blocky.png')
		game.load.image('baldy', 'images/characters/baldy.png');
		game.load.image('robby', 'images/characters/robby.png');
		game.load.image('cardy', 'images/characters/cardy.png');
		game.load.image('ducky', 'images/characters/ducky.png');

		game.load.image('pipe', 'images/pipe.png');
		game.load.image('sky', 'images/sky.png');
		game.load.audio('jump', 'sounds/jump.wav');
		game.load.audio('theme', 'sounds/theme.mp3');

	},

	create: function() {

		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0, 0, 'sky');

		this.character = this.game.add.sprite(100, 245, charSelect());
		game.physics.enable(this.character);
		this.character.body.gravity.y = 1000;

		this.pipes = game.add.group();
		this.pipes.enableBody = true;
		this.pipes.createMultiple(20, 'pipe');


		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		this.score = 0;
		this.scoreText = game.add.text(20, 20, "0", { font: "30px 'Press Start 2P'", fill: "#fff" }); 		

		this.character.anchor.setTo(-0.2, 0.5);

		this.jumpSound = game.add.audio('jump');
		this.themeSong = game.add.audio('theme');

	},

	update: function() {

		if (this.character.inWorld == false)
			this.restartGame();

		game.physics.arcade.overlap(this.character, this.pipes, this.hitPipe, null, this);

		if (this.character.angle < 20)
			this.character.angle += 1;
		
	},

	jump: function() {
		this.jumpSound.play();

		if (this.character.alive == false)
			return;

		this.character.body.velocity.y = -350;
		var animation = game.add.tween(this.character);

		animation.to({angle: -20}, 100);
		animation.start();  

	},

	restartGame: function() {

		game.state.start('main');

	},

	addOnePipe: function(x, y) {

		var pipe = this.pipes.getFirstDead();
		pipe.reset(x, y);
		pipe.body.velocity.x = -200;

		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;

	},

	addRowOfPipes: function() {

		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.addOnePipe(400, i * 60 + 10);

		this.score += 1;
		this.scoreText.text = this.score;

	},

	hitPipe: function() {

		if (this.character.alive == false)
			return;

		this.character.alive = false;
		game.time.events.remove(this.timer);

		this.pipes.forEachAlive(function(p) {
			p.body.velocity.x = 0;
		}, this);

	},

};

game.state.add('main', mainState);
game.state.start('main');