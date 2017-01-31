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