'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
//***
var PlayScene = require('./lvl1_scene');
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
    this.game.load.image('final_arno', 'images/final_sprite.png');
    this.game.load.audio('intro', 'music/intro_theme.mp3');
    this.game.load.audio('final', 'music/final_music.wav');
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
      
      this.game.load.image('tiles2','images/TileKit.png');

      if(this.game.nextLvl === 1){
        this.game.load.image('tiles','images/tileset.png');
        this.game.load.tilemap('tilemap_lvl1', 'maps/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.audio('lvl1_music','music/mushroom_theme.mp3');
      }
      else if (this.game.nextLvl === 2){
        this.game.load.image('wings', 'images/wings.png');
        this.game.load.image('final_arno', 'images/final_sprite.png');
        this.game.load.tilemap('tilemap_lvl2', 'maps/lvl2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.atlasJSONHash('Portal__000','images/final_sheet.png','images/final_sheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.game.load.audio('lvl2_music', 'music/lvl2_music.mp3');
        this.game.load.audio('end_sound','music/end_sound.wav');

      }
      
      this.game.load.atlasJSONHash('Idle__000','images/satyr_sheet.png','images/satyr_sheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlasJSONHash('00_portal','images/end_portal.png','images/end_portal.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.atlasJSONHash('Light__000','images/enemysheet.png','images/enemysheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.audio('jump','music/jump.mp3');
      this.game.load.audio('death','music/death.mp3');
      this.game.load.onLoadComplete.add(this.loadComplete,this);
  
  },

  loadStart: function () {
    
    console.log("Game Assets Loading ...");   
  },
    
  loadComplete: function () {
    this._ready = true;   
    console.log("Assets loaded");

    if(this.game.nextLvl === 1){
      this.game.state.start('lvl1');    
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
      game.state.add('lvl1',PlayScene);
      game.state.add('gameOver', GameOver);
      game.state.add('menu', MenuScene);
      game.state.add('end', EndScene);
      game.state.add('lvl2',Play2Scene);

      game.state.start('boot');
      

 };


window.onload = function () {
       WebFont.load(wfconfig); 
};
