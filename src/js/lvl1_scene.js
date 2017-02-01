'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

//Scena de juego.
var PlayScene = {
    _arno: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 130, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _enemiesTotal: 3,
    _enemies : [],


  create: function () {


      var fondoJuego = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'fondo_lvl1');
        fondoJuego.anchor.setTo(0.5, 0.5);
        fondoJuego.fixedToCamera = true;

      //*** CREACIÓN DE ASSETS DEL ENTORNO ***

      this.map = this.game.add.tilemap('tilemap_lvl1');
      this.map.addTilesetImage('tileset','tiles');
      this.map.addTilesetImage('TileKit','tiles2');
      
      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      this.backgroundLayer2 = this.map.createLayer('BackgroundLayer2');
      this.groundLayer = this.map.createLayer('GroundLayer');
      //PLANO MUERTE
      this.death = this.map.createLayer('Death');
      
      //*** ASSET PASO DE NIVEL (PORTAL) ***
      this.end = this.game.add.sprite(78, 628, '00_portal');
      this.end.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.end.scale.setTo(0.5);

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
      this.death.visible = true;
      //Cambia la escala a x1.
      this.groundLayer.setScale(1,1);
      this.backgroundLayer.setScale(1,1);
      this.death.setScale(1,1);

      //*** ASSETS DE EFECTOS Y MÚSICA ***
      this.musica_fondo = this.game.add.audio('lvl1_music');
      this.jump = this.game.add.audio('jump');
      this.musica_fondo.loop = true;
      this.jump.volume = 0.3;
      this.musica_fondo.play();
      this.death_sound = this.game.add.audio('death');
      this.death_sound.volume = 0.4;

      //*** ASSETS ENEMIGOS ***

       this._enemies.push(new this.EnemyLight(this.game, 927, 1000));
       this._enemies.push(new this.EnemyLight(this.game, 1280, 950));
       this._enemies.push(new this.EnemyLight(this.game, 495, 850));

      //*** ASSETS JUGADOR ***
      this._arno = this.game.add.sprite(100, 1400, 'Idle__000');
      this._arno.scale.setTo(1.08);
      this._arno.anchor.setTo(0.5);
      //resize world and adjust to the screen
      this.groundLayer.resizeWorld(); 
      
      //nombre de la animación, frames, framerate, isloop
      this._arno.animations.add('run',
                    Phaser.Animation.generateFrameNames('Run__',0,5,'',3),10,true);
      this._arno.animations.add('stop',
                    Phaser.Animation.generateFrameNames('Idle__',0,0,'',3),0,false);
      this._arno.animations.add('jump',
                     Phaser.Animation.generateFrameNames('Jump__',0,2,'',3),4,false);
      this._arno.animations.add('death',
                     Phaser.Animation.generateFrameNames('Dead__',0,2,'',3),4,false);
      
      this.configure();
  },

  EnemyLight: function (game, x, y) {

    this.game = game;

    this.enemy = this.game.add.sprite(x, y,'Light__000');
    this.enemy.anchor.set(0.5);

    this.enemy.animations.add('enemy_idle', Phaser.Animation.generateFrameNames('Light__',0,4,'',3),10,true);
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
},
    
    //IS called one per frame.
    update: function () {
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._arno, this.groundLayer);
        var movement = this.GetMovement();
        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._arno.y;
                    this._arno.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._arno.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._arno.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:
                
                var currentJumpHeight = this._arno.y - this._initialJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight) && (!this._arno.body.blocked.up)
                    ? PlayerState.JUMP : PlayerState.FALLING;
                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._arno.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._arno.animations.play('stop');
                    }
                }
                break;     
        }
        //States
        switch(this._playerState){
                
            case PlayerState.STOP:
                this._arno.body.velocity.x = 0;
                //moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                  this._arno.body.velocity.x = 250;
                    if(this._arno.scale.x < 0)
                        this._arno.scale.x *= -1;
                      
                }
                else if(movement === Direction.LEFT){
                  this._arno.body.velocity.x = -250;
                  if(this._arno.scale.x > 0)
                        this._arno.scale.x *= -1;
                }
                else{

                  this._arno.body.velocity.x = 0;
                
                }
                if(this._playerState === PlayerState.JUMP){
                   this._arno.body.velocity.y = -400;
                    this.jump.play();
                    //moveDirection.y = -this._jumpSpeed;
                  }
                if(this._playerState === PlayerState.FALLING){
                    this._arno.body.velocity.y = 400;
                  }
                break;    
        }

        this.enviromentAnimations();
        this.checkPlayerDeath();
        this.checkPlayerPause();
        this.checkEndLevel();
        this.input.onDown.add(this.isUnpaused, this);
    },    
    
    enviromentAnimations: function () {
      
      this.end.animations.play('idle');
      for(var i = 0; i < this._enemiesTotal; ++i){
        this._enemies[i].enemy.animations.play('enemy_idle');
      }

    },

    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerDeath: function(){
        this.game.state.start('gameOver');
    },
    
    checkPlayerDeath: function(){

        if(this.game.physics.arcade.collide(this._arno, this.death)){
          this.death_sound.play();
          this._arno.animations.play('death');
          this.onPlayerDeath();
        }
        var i = 0; 
        while(i < this._enemiesTotal && !this.game.physics.arcade.collide(this._arno, this._enemies[i].enemy)){
          i++;
        }

        if(i < this._enemiesTotal){
          this.death_sound.play();
          this._arno.animations.play('death'); 
          this.onPlayerDeath();         
        } 
    },
    
    checkPlayerPause: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC))
          if(!this.game.paused){
            this.game.paused = true;
            this.pauseMenu();
          }
          this.input.onDown.add(this.isUnpaused, this);
    },

    checkEndLevel: function () {
      if(this.game.physics.arcade.collide(this._arno, this.end))
        this.onPlayerEnd();
    }, 

    onPlayerEnd: function () {
      this.game.nextLvl = 2;
      this.game.state.start('preloader');   
    },

    isStanding: function(){
        return this._arno.body.blocked.down || this._arno.body.touching.down
    },
        
    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },
        
    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },

    pauseMenu: function () {      
      

      this.pause_title = this.game.add.text(this.game.camera.x + 350, this.game.camera.y + 70, "Pause Menu");
      this.continue_text = this.game.add.text(this.game.camera.x + 270, this.game.camera.y + 120, "Click anywhere to continue");

      this.menu_button = this.game.add.button(this.game.camera.x + 410, this.game.camera.y + 450, 'button', this.backToMenu, this, 2, 1, 0);
      this.menu_button.anchor.set(0.5);
      this.unido = this.game.add.text(0, 0, "Main Menu");
      this.unido.anchor.set(0.5);
      this.menu_button.addChild(this.unido);

      this.unido.addColor("#3A44BF", 0);
      this.pause_title.addColor("#3A44BF", 0);
      this.continue_text.addColor("#3A44BF", 0);
      console.log(this._arno.x);
      console.log(this._arno.y);
    },

    isUnpaused: function () {
      if(this.game.paused){
        console.log(this.menu_button.x);
        console.log(this.menu_button.y);
        console.log(this.game.input.mousePointer.x);
        console.log(this.game.input.mousePointer.y);
        //Click dentro de botón
        if(this.game.input.mousePointer.x >= ((this.menu_button.x - this.menu_button.width / 2) - this.game.camera.x) &&
          this.game.input.mousePointer.x <= ((this.menu_button.x + this.menu_button.width / 2) - this.game.camera.x) &&
          this.game.input.mousePointer.y >= ((this.menu_button.y - this.menu_button.height / 2)- this.game.camera.y) &&
          this.game.input.mousePointer.y <= ((this.menu_button.y + this.menu_button.height / 2)- this.game.camera.y))
        {
          console.log("click!");
          this.backToMenu();
        }
      else{
        this.pause_title.destroy();
        this.menu_button.destroy();
        this.continue_text.destroy();
        this.game.paused = false;
      }
      }
    },

    backToMenu: function () {
      this.game.paused = false;
      this.game.state.start('menu');
    },

    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        //this.game.world.setBounds(0, 0, 2400, 160);
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = "#000000";
        this.game.physics.arcade.enable(this._arno);
        this.game.physics.arcade.enable(this.end);
        
        this._arno.body.collideWorldBounds = true;
        this._arno.body.setSize(15, 45);
        this._arno.body.bounce.y = 0.15;
        this._arno.body.gravity.y = 1500;
        this._arno.body.gravity.x = 0;
        this._arno.body.velocity.x = 0;
        this.game.camera.follow(this._arno);
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    //***
    shutdown: function() {
      console.log("shutdown");
      this.cache.removeImage('tiles');
      this.cache.removeImage('tiles2');
      for(var i = 0; i < this._enemiesTotal; ++i)
        this._enemies.pop();
      this.jump.destroy();
      this.musica_fondo.destroy();
      this.game.world.setBounds(0,0,800,600);
    }
    
};
    
module.exports = PlayScene;
