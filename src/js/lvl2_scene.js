'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3, 'FINAL': 4}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

var vuelta = false;

//Scena de juego.
var Play2Scene = {
    _arno: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 130, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _enemiesTotal: 4, //Número máximo de enemigos en este nivel.
    _enemies : [],  //Array de enemigos.
    _maxMove : 70, //Movimiento máximo de los enemigos.
    _FINAL : false, //Final del juego (bool).


  create: function () {
      //Creamos al player con un sprite por defecto.
      //TODO 5 Creamos a rush 'rush' con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
      //***
      var fondoJuego = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'fondo_lvl2');
        fondoJuego.anchor.setTo(0.5);
        fondoJuego.fixedToCamera = true;
        fondoJuego.scale.setTo(0.4);

      //*** CREACIÓN DE ASSETS DEL ENTORNO ***

      this.map = this.game.add.tilemap('tilemap_lvl2');
      this.map.addTilesetImage('TileKit','tiles2');
      
      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      //this.backgroundLayer = this.map.createLayer('BackgroundLayer2');
      this.groundLayer = this.map.createLayer('GroundLayer');
      //PLANO MUERTE
      this.death = this.map.createLayer('Death');
      
      //*** ASSET PASO DE NIVEL (PORTAL) ***
      this.end = this.game.add.sprite(980, 450, 'wings');
      this.end.scale.setTo(0.7);

      this.final = this.game.add.sprite(905, 150, 'Portal__000');
      this.final.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.final.anchor.setTo(0);
      this.final.angle -= 90;
      this.final.scale.setTo(0.9);

      console.log(this.final)
      //Teletransporte
      this.teleport1 = this.game.add.sprite(1496, 1060, '00_portal');
      this.teleport1.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.teleport1.scale.setTo(0.5);

      this.teleport2 = this.game.add.sprite(78, 960, '00_portal');
      this.teleport2.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.teleport2.scale.setTo(0.5);

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
      this.death.visible = true;
      //Cambia la escala a x1.
      this.groundLayer.setScale(1,1);
      this.backgroundLayer.setScale(1,1);
      this.death.setScale(1,1);

      //*** ASSETS DE EFECTOS Y MÚSICA ***
      this.musica_fondo = this.game.add.audio('lvl2_music');
      this.jump = this.game.add.audio('jump');
      this.jump.volume = 0.3;
      this.musica_fondo.loop = true;
      this.musica_fondo.play();
      this.death_sound = this.game.add.audio('death');
      this.death_sound.volume = 0.4;
      this.end_sound = this.game.add.audio('end_sound');

      //*** ASSETS ENEMIGOS ***

       this._enemies.push(new this.EnemyLight(this.game, 990, 1010, 1));
       this._enemies.push(new this.EnemyLight(this.game, 380, 1321, 2));
       this._enemies.push(new this.EnemyLight(this.game, 829, 1350, 1));
       this._enemies.push(new this.EnemyLight(this.game, 1215, 1230, 1));

      //*** ASSETS JUGADOR ***
      //this._arno = this.game.add.sprite(100, 1400, 'Idle__000');
      this._arno = this.game.add.sprite(712, 550, 'Idle__000');
      this._arno.scale.setTo(1.08);
      this._arno.anchor.setTo(0.5, 1);
      console.log(this._arno)
      //resize world and adjust to the screen
      this.groundLayer.resizeWorld(); 
      
      //nombre de la animación, frames, framerate, isloop
      this._arno.animations.add('run',
                    Phaser.Animation.generateFrameNames('Run__',0,5,'',3),10,true);
      this._arno.animations.add('stop',
                    Phaser.Animation.generateFrameNames('Idle__',0,0,'',3),0,false);
      this._arno.animations.add('jump',
                     Phaser.Animation.generateFrameNames('Jump__',0,2,'',3),0,false);
      
      this.configure();
  },

  EnemyLight: function (game, x, y, type) {

    this.game = game;

    this.enemy = this.game.add.sprite(x, y,'Light__000');
    this.enemy.anchor.set(0.5);
    this.enemy.pivote = {x, y};
    this.enemy.AItype = type; //Type 1 or 2

    this.enemy.animations.add('enemy_idle', Phaser.Animation.generateFrameNames('Light__',0,4,'',3),10,true);
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
},
    
    //IS called one per frame.
    update: function () {
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._arno, this.groundLayer);
        var movement = this.GetMovement();
        //transitions
        if(!this._FINAL){
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
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    if(this._arno.scale.x < 0)
                        this._arno.scale.x *= -1;
                    else this._arno.body.velocity.x = 250;
                      
                }
                else if(movement === Direction.LEFT){
                  if(this._arno.scale.x > 0)
                        this._arno.scale.x *= -1;
                  else this._arno.body.velocity.x = -250;
                }
                else{

                  this._arno.body.velocity.x = 0;
                
                }
                if(this._playerState === PlayerState.JUMP){
                   this._arno.body.velocity.y = -400;
                    this.jump.play();
                  }
                if(this._playerState === PlayerState.FALLING){
                    this._arno.body.velocity.y = 400;    
                  }
                break;  
        }
      }
      else{
       this._arno.body.velocity.y = -75;
       this._arno.body.velocity.x = 0;
      }

        this.enviromentAnimations();
        this.checkPlayerDeath();
        this.checkPlayerPause();
        this.checkPlayerCollisions();
        this.input.onDown.add(this.isUnpaused, this);
    },    
    
    enviromentAnimations: function () {
      
      this.end.animations.play('idle');
      this.teleport1.animations.play('idle');
      this.teleport2.animations.play('idle');
      this.final.animations.play('idle');

      for(var i = 0; i < this._enemiesTotal; ++i){
        this._enemies[i].enemy.animations.play('enemy_idle');
      }
      this.enemyAI();

    },

    enemyAI: function (){
      for(var i = 0; i < this._enemiesTotal; ++i){
        if(this._enemies[i].enemy.AItype === 1){
          if(this._enemies[i].enemy.pivote.x + this._maxMove > this._enemies[i].enemy.x && !this.vuelta)
            this._enemies[i].enemy.body.velocity.x = 150;
          else if (this._enemies[i].enemy.pivote.x - this._maxMove < this._enemies[i].enemy.x){
            this.vuelta = true;
            this._enemies[i].enemy.body.velocity.x = -150;
          }
          else this.vuelta = false;
        }
        else if (this._enemies[i].enemy.AItype === 2){

        }
      }
    },

    canJump: function(collisionWithTilemap){
      return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerDeath: function(){
        //TODO 6 Carga de 'gameOver';
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

    checkPlayerCollisions: function () {
      if(this.game.physics.arcade.collide(this._arno, this.end)){
        this.game.add.tween(this._arno).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        this._arno.loadTexture('final_arno', 0);
        this.end.destroy();
        this.end_sound.play();
        this._FINAL = true;
      }
      if(this.game.physics.arcade.overlap(this._arno, this.teleport1)){
        this._arno.x = this.teleport2.x;
        this._playerState = PlayerState.FALLING;
      }
      if(this.game.physics.arcade.collide(this._arno, this.final)){
        console.log("collide!");
        this.onPlayerEnd();
      }
    }, 

    onPlayerEnd: function () {
      this.game.state.start('end');
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
        this.game.physics.arcade.enable(this.teleport1);
        this.game.physics.arcade.enable(this.final);
        this.final.body.setSize(100, 1);

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
      this.cache.removeImage('tiles2');
      for(var i = 0; i < this._enemiesTotal; ++i)
        this._enemies.pop();
      this.jump.destroy();
      this.musica_fondo.destroy();
      this.game.world.setBounds(0,0,800,600);
    }
    
};
    
module.exports = Play2Scene;
