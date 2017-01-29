'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
//***
var PlayScene = require('./play_scene');
var GameOver = require('./gameover_scene');
var MenuScene = require('./menu_scene');
var EndScene = require('./end_scene');

//  The Google WebFont Loader will look for this object, so create it before loading the script.


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('button', 'images/ini_button2.png');
    this.game.load.image('logo', 'images/fondo2.png');
    this.game.load.image('fondoJuego', 'images/background.png');
    this.game.load.image('end_back', 'images/end_back.png');
    //this.game.load.image('fondo', 'images/fondo.png');
    this.game.load.audio('intro', 'music/intro_theme.mp3');
  },

  create: function () {
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
      //this.game.load.image('end_portal','images/end_portal.png');
      this.game.load.tilemap('tilemap2', 'maps/map2.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.atlasJSONHash('Idle__000','images/spritesheet.png','images/spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlasJSONHash('00_portal','images/end_portal.png','images/end_portal.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

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
      game.state.add('end', EndScene);
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
