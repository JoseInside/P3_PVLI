(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameOver = {
    create: function () {
        console.log("Game Over");

        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.restart, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Game");
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
},{}],2:[function(require,module,exports){
'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
//***
var PlayScene = require('./play_scene');
var GameOver = require('./gameover_scene');
var MenuScene = require('./menu_scene');

//  The Google WebFont Loader will look for this object, so create it before loading the script.


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('button', 'images/ini_button2.png');
    this.game.load.image('logo', 'images/fondo2.png');
    this.game.load.image('fondoJuego', 'images/background.png');
    //this.game.load.image('fondo', 'images/fondo.png');
    this.game.load.audio('intro', 'music/intro_theme.mp3');
  },

  create: function () {
    //this.game.state.start('preloader');
      this.game.state.start('menu');
      
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    

      this.load.onLoadStart.add(this.loadStart, this);
      //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.
      //***MOD 1a Y 3a
      //this.game.load.tilemap('tilemap', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
      
      this.game.load.image('tiles','images/tileset.png');
      this.game.load.image('tiles2','images/TileKit.png');
      this.game.load.tilemap('tilemap2', 'maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.atlasJSONHash('Idle__000','images/spritesheet.png','images/spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

      this.game.load.audio('audio_fondo','music/iceland_theme.mp3');
      this.game.load.audio('jump','music/jump.mp3');
      //TODO 2.2a Escuchar el evento onLoadComplete con el método loadComplete que el state 'play'
      //***
      this.game.load.onLoadComplete.add(this.loadComplete,this);
  
  },

  loadStart: function () {
    
    console.log("Game Assets Loading ...");
    
  },
    
    
     //TODO 2.2b function loadComplete()
    loadComplete: function () {
        this._ready = true;   
        console.log("Assets loaded")
        this.game.state.start('play');    
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

      game.state.add('boot', BootScene);
      game.state.add('preloader', PreloaderScene);
      game.state.add('play',PlayScene);
      game.state.add('gameOver', GameOver);
      game.state.add('menu', MenuScene);
      game.state.start('boot');
      

 };
//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().

window.onload = function () {
      //var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
      //TODO 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
       WebFont.load(wfconfig); 
     //TODO 1.3 iniciar el state 'boot'.  
     //this.game.state.start('boot');
         
};

},{"./gameover_scene":1,"./menu_scene":3,"./play_scene":4}],3:[function(require,module,exports){
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
        this.game.state.start('preloader');
    }, 

    shutdown: function() {

      this.intro_music.destroy();
    }

};

module.exports = MenuScene;
},{}],4:[function(require,module,exports){
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

    //Método constructor...
  create: function () {
      //Creamos al player con un sprite por defecto.
      //TODO 5 Creamos a rush 'rush' con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
      //***
      var fondoJuego = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'fondoJuego');
        fondoJuego.anchor.setTo(0.5, 0.5);
        fondoJuego.fixedToCamera = true;

      
      //*** CREACIÓN DE ASSETS DEL ENTORNO ***

      this.map = this.game.add.tilemap('tilemap2');
      this.map.addTilesetImage('tileset','tiles');
      this.map.addTilesetImage('TileKit','tiles2');
      
      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      this.backgroundLayer = this.map.createLayer('BackgroundLayer2');
      this.groundLayer = this.map.createLayer('GroundLayer');
      //plano de muerte
      this.death = this.map.createLayer('Death');
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


      //POR ÚLTIMO JUGADOR PARA NO ESTAR DETRÁS DE LA ESCENA
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

        this.checkPlayerFell();
        this.checkPlayerPause();

        this.input.onDown.add(this.isUnpaused, this);
    },    
    
    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerFell: function(){
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._arno, this.death))
          this.onPlayerFell();
    },
    checkPlayerPause: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC))
          if(!this.game.paused){
            this.game.paused = true;
            this.pauseMenu();
          }
          this.input.onDown.add(this.isUnpaused, this);

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

      this.pause_title = this.game.add.text(335, 1100, "Pause Menu");
      this.continue_text = this.game.add.text(250, 1150, "Click anywhere to continue");

      this.menu_button = this.game.add.button(400, 1400, 'button', this.backToMenu, this, 2, 1, 0);
      this.menu_button.anchor.set(0.5);
      this.unido = this.game.add.text(0, 0, "Main Menu");
      this.unido.anchor.set(0.5);
      this.menu_button.addChild(this.unido);

      this.unido.addColor("#3A44BF", 0);
      this.pause_title.addColor("#3A44BF", 0);
      this.continue_text.addColor("#3A44BF", 0);
      
    },

    isUnpaused: function () {
      
      this.pause_title.destroy();
      this.menu_button.destroy();
      this.continue_text.destroy();
      this.game.paused = false;
    },

    backToMenu: function () {
    //  this.pause_title.destroy();
    //  this.return_button.destroy();
    //  this.menu_button.destroy();
      this.game.paused = false;
      //this.game.state.start('menu');
    },

    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        //this.game.world.setBounds(0, 0, 2400, 160);
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.stage.backgroundColor = '#a9f0ff';
        this.game.stage.backgroundColor = "#000000";
        this.game.physics.arcade.enable(this._arno);
        
        
        this._arno.body.collideWorldBounds = true;
        this._arno.body.setSize(300, 480);
        this._arno.body.bounce.y = 0;
        this._arno.body.gravity.y = 1500;
        this._arno.body.gravity.x = 0;
        this._arno.body.velocity.x = 0;
        this.game.camera.follow(this._arno);
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._arno.body.velocity = point;// * this.game.time.elapseTime;
       /*
        if((this._arno.x < xMin && point.x < 0) || (this._arno.x > xMax && point.x > 0))
            this._arno.body.velocity.x = 0;
      */
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    //***
    shutdown: function() {
      console.log("shutdown");
      this.cache.removeImage('tilemap');
      this.cache.removeImage('tileset');
      this.cache.removeImage('tiles');
      this.musica_fondo.destroy();
      this.jump.destroy();
      this.game.world.setBounds(0,0,800,600);
    }
    
};
    
module.exports = PlayScene;

},{}]},{},[2]);
