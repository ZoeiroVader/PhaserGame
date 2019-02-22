import 'phaser';

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
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
    var game = new Phaser.Game(config);
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

    function preload ()
    {
        //cria um spritesheet com lateral de 32px e altura 48px
        this.load.spritesheet('enemy', 'assets/dude.png', {frameWidth: 34, frameHeight: 34})
        this.load.spritesheet('dude', 'assets/dude2.png', { frameWidth: 32, frameHeight: 48 })
        this.load.image('back', 'assets/back.png')
        
    }

    function create ()
    {  
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

        this.anims.create({
            //nome da animação = 'left'
            key: 'left',
            //define os frames dentro da image do sprite que serão utilizados no caso do primeiro até o terceiro
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            //The 'repeat -1' value tells the animation to loop.
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

        this.physics.add.collider(player, enemy)
    }

    function update ()
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
