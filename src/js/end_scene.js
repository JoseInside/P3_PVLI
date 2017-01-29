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