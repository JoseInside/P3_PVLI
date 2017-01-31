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