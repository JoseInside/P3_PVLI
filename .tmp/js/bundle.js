(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EndScene = {

    create: function () {
        console.log("End");

        var end_background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'end_back');
        end_background.anchor.setTo(0.5, 0.5);
        end_background.fixedToCamera = true;

        var endText = this.game.add.text(400, 100, "Congratz! You've reached the clouds!");
        var rText = this.game.add.text (0, 0, "Main Menu");

        var button = this.game.add.button(400, 200, 'button', this.returnMenu, this, 2, 1, 0);
        button.anchor.set(0.5);
        button.addChild(rText);
        
        endText.font ='Sniglet';
        rText.font = 'Sniglet';
        endText.addColor("#FFFFFF", 0);
        rText.addColor("#3A44BF", 0);
        endText.anchor.set(0.5);
        rText.anchor.set(0.5);

        this.intro_music = this.game.add.audio('intro');
        this.intro_music.loop = true;
        this.intro_music.play();

    },
    
    //TODO 7 declarar el callback del boton.
    returnMenu: function() {
      this.game.state.start('menu');
    },  
};

module.exports = EndScene;
},{}],2:[function(require,module,exports){
var GameOver = {

    create: function () {
        console.log("Game Over");

        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.restart, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Level");
        var rText = this.game.add.text (0, 0, "Main Menu");
        goText.font ='Sniglet';
        text.font = 'Sniglet';
        rText.font = 'Sniglet';
        goText.addColor("#FFFFFF", 0);
        text.addColor("#3A44BF", 0);
        rText.addColor("#3A44BF", 0);
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        rText.anchor.set(0.5);
        button.addChild(text);
        
        //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
         var button2 = this.game.add.button(400, 200, 
                                          'button', 
                                          this.returnMenu, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        button2.addChild(rText);
    },
    
    //TODO 7 declarar el callback del boton.
    returnMenu: function() {
      this.game.state.start('menu');
    },

    restart: function () {
        this.game.state.start('preloader');      
    }
    
};

module.exports = GameOver;
},{}],3:[function(require,module,exports){
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

//Scena de juego.
var Play2Scene = {
    _arno: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 130, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _enemiesTotal: 3,
    _enemies : [],

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
      //this.map.addTilesetImage('tileset','tiles');
      this.map.addTilesetImage('TileKit','tiles2');
      
      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      //this.backgroundLayer = this.map.createLayer('BackgroundLayer2');
      this.groundLayer = this.map.createLayer('GroundLayer');
      //PLANO MUERTE
      this.death = this.map.createLayer('Death');
      
      //*** ASSET PASO DE NIVEL (PORTAL) ***
      this.end = this.game.add.sprite(988, 400, '00_portal');
      this.end.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.end.scale.setTo(0.5);
      //Teletransporte
      this.teleport1 = this.game.add.sprite(1496, 1160, '00_portal');
      this.teleport1.animations.add('idle', Phaser.Animation.generateFrameNames('Portal__',0,3,'',3),10,true);
      this.teleport1.scale.setTo(0.5);
      this.teleport2 = this.game.add.sprite(78, 1000, '00_portal');
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
      this.musica_fondo = this.game.add.audio('audio_fondo');
      this.jump = this.game.add.audio('jump');
      this.musica_fondo.loop = true;
      this.musica_fondo.play();

      //*** ASSETS ENEMIGOS ***

       this._enemies.push(new this.EnemyLight(this.game, 1005, 1010));
       this._enemies.push(new this.EnemyLight(this.game, 392, 1321));
       this._enemies.push(new this.EnemyLight(this.game, 829, 1350));

      //*** ASSETS JUGADOR ***
      this._arno = this.game.add.sprite(100, 1400, 'Idle__000');
      this._arno.scale.setTo(0.1,0.1);
      this._arno.anchor.setTo(0,0);
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
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
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
                  
                    //moveDirection.x = this._speed;
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
                    //moveDirection.y = 0;
                    //moveDirection.x = 200;
                  }
                break;    
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
      for(var i = 0; i < this._enemiesTotal; ++i){
        this._enemies[i].enemy.animations.play('enemy_idle');
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
        
        if(this.game.physics.arcade.collide(this._arno, this.death))
          this.onPlayerDeath();
        
        var i = 0;
        
        while(i < this._enemiesTotal && !this.game.physics.arcade.collide(this._arno, this._enemies[i].enemy)){
          i++;
        }

        if(i < this._enemiesTotal)
          this.onPlayerDeath();
      
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
      if(this.game.physics.arcade.collide(this._arno, this.end))
        this.onPlayerEnd();
      if(this.game.physics.arcade.collide(this._arno, this.teleport1)){
        this._arno.x = this.teleport2.x;
        this._arno.y = this.teleport2.y;
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

        this._arno.body.collideWorldBounds = true;
        this._arno.body.setSize(300, 480);
        this._arno.body.bounce.y = 0;
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
      this.game.world.setBounds(0,0,800,600);
    }
    
};
    
module.exports = Play2Scene;

},{}],4:[function(require,module,exports){
'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
//***
var PlayScene = require('./play_scene');
var GameOver = require('./gameover_scene');
var MenuScene = require('./menu_scene');
var EndScene = require('./end_scene');
var Play2Scene = require('./lvl2_scene');

//  The Google WebFont Loader will look for this object, so create it before loading the script.

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('button', 'images/ini_button2.png');
    this.game.load.image('logo', 'images/fondo2.png');
    this.game.load.image('fondo_lvl1', 'images/background.png');
    this.game.load.image('fondo_lvl2', 'images/lvl2_back.png');
    this.game.load.image('end_back', 'images/end_back.png');
    //this.game.load.image('fondo', 'images/fondo.png');
    this.game.load.audio('intro', 'music/intro_theme.mp3');
  },

  create: function () {
    this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function (bool) {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";

      this.load.onLoadStart.add(this.loadStart, this);
      
      //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.

      this.game.load.image('tiles','images/tileset.png');
      this.game.load.image('tiles2','images/TileKit.png');
      this.game.load.tilemap('tilemap2', 'maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.tilemap('tilemap_lvl2', 'maps/lvl2.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.atlasJSONHash('Idle__000','images/spritesheet.png','images/spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlasJSONHash('00_portal','images/end_portal.png','images/end_portal.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlasJSONHash('Light__000','images/enemysheet.png','images/enemysheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

      this.game.load.audio('audio_fondo','music/iceland_theme.mp3');
      this.game.load.audio('jump','music/jump.mp3');
      
      this.game.load.onLoadComplete.add(this.loadComplete,this);
  
  },

  loadStart: function () {
    
    console.log("Game Assets Loading ...");   
  },
    
    
     //TODO 2.2b function loadComplete()
    loadComplete: function () {
        this._ready = true;   
        console.log("Assets loaded");

        console.log(this.game.nextLvl);
        if(this.game.nextLvl === 1){
     
        this.game.state.start('lvl2');    
        }
        else if (this.game.nextLvl === 2){

          this.game.state.start('lvl2'); 
        }
    },
    
    update: function(){
        this._loadingBar
    }
};

var wfconfig = {
 
    active: function() { 
        console.log("font loaded");
        init();
        
    },
 
    google: {
        families: ['Sniglet']
    }
};
 
function init () {

   var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

      game.nextLvl = 1;

      game.state.add('boot', BootScene);
      game.state.add('preloader', PreloaderScene);
      game.state.add('play',PlayScene);
      game.state.add('gameOver', GameOver);
      game.state.add('menu', MenuScene);
      game.state.add('end', EndScene);
      game.state.add('lvl2',Play2Scene);

      game.state.start('boot');
      

 };
//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().

window.onload = function () {
       WebFont.load(wfconfig); 
};

},{"./end_scene":1,"./gameover_scene":2,"./lvl2_scene":3,"./menu_scene":5,"./play_scene":6}],5:[function(require,module,exports){
var MenuScene = {

    preload : function()
    {
      console.log("preload de menu scene");
      this.game.stage.backgroundColor = "#000000";
      
      
    },
    create: function () {
        
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY + 250, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Play!");
        textStart.addColor("#3A44BF", 0);
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);

        this.intro_music = this.game.add.audio('intro');
        this.intro_music.loop = true;
        this.intro_music.play();

    },
    
    actionOnClick: function(){
        this.game.nextLvl = 1;
        this.game.state.start('preloader');
    }, 

    shutdown: function() {

      this.intro_music.destroy();
    }

};

module.exports = MenuScene;
},{}],6:[function(require,module,exports){
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
    //Método constructor...
  create: function () {
      //Creamos al player con un sprite por defecto.
      //TODO 5 Creamos a rush 'rush' con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
      //***
      var fondoJuego = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'fondo_lvl1');
        fondoJuego.anchor.setTo(0.5, 0.5);
        fondoJuego.fixedToCamera = true;

      //*** CREACIÓN DE ASSETS DEL ENTORNO ***

      this.map = this.game.add.tilemap('tilemap2');
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
      this.musica_fondo = this.game.add.audio('audio_fondo');
      this.jump = this.game.add.audio('jump');
      this.musica_fondo.loop = true;
      this.musica_fondo.play();

      //*** ASSETS ENEMIGOS ***

       this._enemies.push(new this.EnemyLight(this.game, 300, 850));
       this._enemies.push(new this.EnemyLight(this.game, 1526, 1040));
       this._enemies.push(new this.EnemyLight(this.game, 495, 850));

      //*** ASSETS JUGADOR ***
      this._arno = this.game.add.sprite(100, 1400, 'Idle__000');
      this._arno.scale.setTo(0.1,0.1);
      this._arno.anchor.setTo(0,0);
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
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
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
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');
    },
    
    checkPlayerDeath: function(){
        
        if(this.game.physics.arcade.collide(this._arno, this.death))
          this.onPlayerDeath();
        
        var i = 0;
        
        while(i < this._enemiesTotal && !this.game.physics.arcade.collide(this._arno, this._enemies[i].enemy)){
          i++;
        }

        if(i < this._enemiesTotal)
          this.onPlayerDeath();
      
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
        this._arno.body.setSize(300, 480);
        this._arno.body.bounce.y = 0;
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
      this.game.world.setBounds(0,0,800,600);
    }
    
};
    
module.exports = PlayScene;

},{}]},{},[4]);
