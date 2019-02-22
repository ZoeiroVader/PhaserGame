import 'phaser';

var player;
var enemy;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var keys;

var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        this.load.spritesheet('enemy', 'assets/dude.png', {frameWidth: 34, frameHeight: 34})
        this.load.spritesheet('dude', 'assets/dude2.png', { frameWidth: 32, frameHeight: 48 })
        this.load.image('back', 'assets/back.png')
        this.load.image('zero2', 'assets/zero2.png')
        this.load.image('play', 'assets/playnow.png')
    },

    create: function ()
    {
        console.log('%c Preloader ', 'background: green; color: white; display: block;');
        this.anims.create({
            //nome da animação = 'left'
            key: 'left',
            //define os frames dentro da image do sprite que serão utilizados no caso do primeiro até o terceiro
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_idle',
            frames: this.anims.generateFrameNumbers('enemy', {start: 0, end: 5}),
            frameRate: 25,
            repeat: -1
        })

        this.scene.start('mainmenu');
    }

});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
        window.MENU = this;
    },

    create: function ()
    {
        console.log('%c MainMenu ', 'background: green; color: white; display: block;');

        var btn = this.add.image(400, 300, 'play');


        btn.setInteractive();

        btn.once('pointerup', function () {

            this.scene.start('game');

        }, this);
    }

});

var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        window.GAME = this;
    
        this.controls;
        this.track;
        this.text;
    },

    create: function ()
    {
        console.log('%c Game ', 'background: green; color: white; display: block;');

        keys = this.input.keyboard.addKeys('A')   
        this.add.image(400, 350, 'back')

        cursors = this.input.keyboard.createCursorKeys();
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

        player = this.physics.add.sprite(100, 450, 'dude');
        player.body.setGravityY(300)
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        enemy = this.physics.add.sprite(100, 200, 'enemy').setScale(1.4)
        enemy.setCollideWorldBounds(true)

        this.physics.add.collider(player, enemy)

        this.input.once('pointerup', function () {

            this.scene.start('gameover');

        }, this);

    },

    update: function ()
    {
        if (keys.A.isDown) {
            
        }
        if (cursors.left.isDown)
        {   
            //define a velocidade do player no eixo X
            player.setVelocityX(-200);
            //muda o sprite para o com o nome "left"
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(200);       
            player.anims.play('right', true);
        }
        else{
            player.setVelocityX(0)       
            player.anims.play('turn')

            enemy.anims.play('enemy_idle')
        }
        //se a seta para cima e estiver tocando o chão/algo
        if (cursors.up.isDown)
        {
            //aplica a velocidade no eixo y, ou seja um pulo
            player.setVelocityY(-500);
        } 

        if (cursors.down.isDown)
        {
            //aplica a velocidade no eixo y, ou seja um pulo
            player.setVelocityY(500);
        } 
    }

});

var GameOver = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameOver ()
    {
        Phaser.Scene.call(this, { key: 'gameover' });
        window.OVER = this;
    },

    create: function ()
    {
        console.log('%c GameOver ', 'background: green; color: white; display: block;');

        this.add.sprite(400, 300, 'zero2');

        this.add.text(300, 500, 'Game Over - Click to start restart', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerup', function (event) {

            this.scene.start('mainmenu');

        }, this);
    }

});

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        _parent: 'WOW',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ Preloader, MainMenu, Game, GameOver ]
};

var game = new Phaser.Game(config);
