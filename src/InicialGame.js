import 'phaser';

var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
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
    
    var player;
    var stars;
    var bombs;
    var platforms;
    var cursors;
    var score = 0;
    var gameOver = false;
    var scoreText;
    var keys;

    var game = new Phaser.Game(config);

    function preload ()
    {
        //this.load.image('nomedoatributo', 'caminhoparaosprite');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');

        //cria um spritesheet com lateral de 32px e altura 48px
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 34, frameHeight: 34 });
    }


    function create ()
    {
       
        keys = this.input.keyboard.addKeys('P,H,A,S,E,R');

        //isso adiciona o fundo como uma imagem estática
        this.add.image(400, 300, 'sky');

        //Isso cria um novo Grupo de Física Estática e o atribui a variável local platforms
        //Arcade Physics tem dois tipos: Dynamic and Static


        // dynamic body is one that can move around via forces such as velocity or acceleration. 
        //It can bounce and collide with other objects and that collision is influenced by the 
        //mass of the body and other elements.

        //In stark contrast, a Static Body simply has a position and a size. 
        //It isn't touched by gravity, you cannot set velocity on it and when something collides with it, 
        //it never moves. Static by name, static by nature. 
        //And perfect for the ground and platforms that we're going to let the player run around on.

        platforms = this.physics.add.staticGroup();

        //The call to refreshBody() is required because we have scaled a static physics body, 
        //so we have to tell the physics world about the changes we made.
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //posição baseada no centro da imagem
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        //The sprite was created via the Physics Game Object Factory (this.physics.add) 
        //which means it has a Dynamic Physics body by default.
        player = this.physics.add.sprite(100, 450, 'dude');
        player.body.setGravityY(300)

        //This means when it lands after jumping it will bounce ever so slightly.
        player.setBounce(0.2);

        player.setCollideWorldBounds(true);

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
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.physics.add.collider(player, platforms);
        cursors = this.input.keyboard.createCursorKeys();

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, stars, collectStar, null, this);
        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        
    }

    function update ()
    {   
        // if (keys.P.isDown) {
        //     vel = 5000;
        // }else{
        //     vel = -500;
        // }
        if (gameOver) {
            return;
        }
        //cursors = teclas, left = tecla, isDown = está apertado
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
        else
        {
            //para o player
            player.setVelocityX(0);
        
            player.anims.play('turn');
        }
        //se a seta para cima e estiver tocando o chão/algo
        if (cursors.up.isDown && player.body.touching.down)
        {
            //aplica a velocidade no eixo y, ou seja um pulo
            player.setVelocityY(-500);
        }     

    }

    function collectStar (player, star)
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);
        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
        }    
    }

    function hitBomb (player, bomb)
    {
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('turn');
    
        gameOver = true;
    }    
