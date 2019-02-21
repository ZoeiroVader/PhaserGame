import 'phaser';

var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.NONE,
            _parent: 'phaser-example',
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
    var img;
    var img2;
    var vel = 100;
    var scoreText;
    var score = 0;
    var tam = 0.1;

    function preload ()
    {
        this.load.image('pic', 'assets/02.jpg');
        this.load.image('heart', 'assets/heart.png');
    }

    function create ()
    {     
    
    

    var sprite = this.add.sprite(0, 0, 'pic').setOrigin(0).setInteractive();

    scoreText = this.add.text(16, 16, 'hearts: 0', { fontSize: '32px', fill: '#000' });

    img = this.physics.add.sprite(100, 450, 'heart').setInteractive();
    

    img.setCollideWorldBounds(true);

    this.input.on('pointerdown', function (pointer) {

        img2 = this.physics.add.sprite(pointer.x, pointer.y, 'heart')
        img2.setGravityY(300)
        img2.setCollideWorldBounds(true)
        img2.setBounce(0.2)
        this.physics.add.collider(img, img2, vai, null, this);
        

    }, this);

    img.on('pointerover', function(pointer){
        this.setScale(2)
    })

    sprite.on('pointerdown', function (pointer) {

        this.setTint(0xD5A6BD);

    });

    sprite.on('pointerout', function (pointer) {

        this.clearTint();

    });

    sprite.on('pointerup', function (pointer) {

        this.clearTint();

    });
    }

    function update ()
    {   
        
        
    }

    function vai(){
        tam += 0.1
        if (tam > 5) {
            tam = 1
        }
        vel = vel * -1

        img.setVelocityX(vel)
        img.setVelocityY(vel)

        score += 1;
        scoreText.setText('Score: ' + score);
        img2.disableBody(true, true);
        img.setScale(tam)
    }

