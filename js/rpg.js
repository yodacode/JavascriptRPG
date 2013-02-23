var initPokemon = function() {
		
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	
	/**
	 * Class : Screen(jQuery screen)
	 * @Docs : Permet de construir un objet Screen 
	 */
	var ScreenConstructor = function Screen (screenWidth, screenHeight, cellWidth, cellHeight, $elem){
		
		this.cellWidth 	= cellWidth; 
		this.cellHeight = cellHeight;
		this.screenWidth 	= screenWidth;
		this.screenHeight	= screenHeight;
		this.$elem 		= $elem;

		this.ScreenWidthCell = (this.screenWidth/this.cellWidth);
		this.ScreenHeightCell = (this.screenHeight/this.cellHeight);

		console.log('width'+ this.ScreenWidthCell+ 'height '+ this.ScreenHeightCell);
	};


	/**
	 * method : buid()
	 * @Docs : build coordinates y and x for the grid
	 */
	ScreenConstructor.prototype.build = function(){

		this.$elem
		.width(this.screenWidth)
		.height(this.screenHeight);

		var width = this.$elem.width()/this.cellWidth;
		var height = this.$elem.height()/this.cellWidth;
		var grid = [];

		for(var y = 0; y < height; y++){
			grid[y] = [];
			for(var x = 0; x < width; x++){
				grid[y][x] = new SpriteConstructor(x,y);
				grid[y][x].build();
			}
		}
		
		this.getGrid = grid;

	};
	

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	/**
	 * Class : Sprite(int x, int y)
	 * @Docs : Sprite constructor
	 */
	var SpriteConstructor = function Sprite(x,y) {
		this.x = x;
		this.y = y;
	};


	/**
	 * method : build()
	 * @Docs : build the sprite with the good size and give it the good position on the grid
	 */
	SpriteConstructor.prototype.build = function() {
		$('<div data-y="'+this.y+'" data-x="'+this.x+'" class="sprite"></div>')
		.appendTo(Screen.$elem)
		.width(Screen.cellWidth)
		.height(Screen.cellWidth)
		.css({
			'position' 	: 'absolute',
			'top'		: (this.y*Screen.cellWidth)+'px',
			'left'		: (this.x*Screen.cellWidth)+'px',
			'overflow'	: 'hidden'
		});

	};
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	
	/**
	 * Class : Sasha(jQuery sasha, string direction, obj position)
	 * @Docs : Permet de construir un objet Sasha
	 */
	var BobConstructor = function Bob(bobSprite, direction, position) {
		this.y = position.top;
		this.x = position.left;
		this.bobSprite = bobSprite;
		this.direction = direction;
		this.step = 'a';
		this.bobSprite.append('<img src="img/sacha-down-stop.png"/>');
		this.bobSprite.css({'top':(this.y*Screen.cellHeight)+'px', 'left':(this.x*Screen.cellWidth)+'px'});
		this.isRuning = false;
	};
	
	

	
	/**
	 * method : forward(direction)
	 * @Docs : Permet de faire avancer la position de Sasha
	 * return la position de la case précédente
	 */
	BobConstructor.prototype.forward = function(){
		var prevCoords = {	
			x : this.x,
			y : this.y
		};
		
		switch (this.direction){
			case 'right' : 
				this.x += 1;
				break;
			case 'left' : 
				this.x -= 1;
				break;
			case 'up' : 
				this.y -= 1;
				break;
			case 'down' : 
				this.y += 1;
				break;
		}
		return prevCoords;
	};
	
	/**
	 * method : updateRender(direction)
	 * @Docs : Permet de mettre à jour le rendu de Sasha sur la carte
	 */
	BobConstructor.prototype.updateRender = function(coords, progress){
		var top = coords.y*Screen.cellHeight;
		var left = coords.x*Screen.cellWidth;
		switch (this.direction){
			case 'right' : 
				left += Screen.cellWidth * progress;
				break;
			case 'left' : 
				left -= Screen.cellWidth * progress;
				break;
			case 'up' : 
				top -= Screen.cellHeight * progress;
				break;
			case 'down' : 
				top += Screen.cellHeight * progress;
				break;
		} 		
		this.bobSprite.css({
			'top' : top+'px',
			'left' : left+'px',
		}); 
	};
	

	
	/**
	 * method : stopMove(string direction)
	 * @Docs : Permet l'arrêt de la method move
	 */
	BobConstructor.prototype.stopMove = function(direction){
		this.bobSprite.empty();
	 	this.bobSprite.append('<img src="img/sacha-down-stop.png"/>');
		var self = this;
		window.clearInterval(self.timerMove);
	};
	
	/**
	 * method : moveTo(string direction)
	 * @Docs : Permet de faire bouger Sasha sur la map
	 */
	BobConstructor.prototype.moveTo = function(direction){
		
		this.timerMoveTo = null;
		this.previousTime = +(new Date);
		this.currentTime = +(new Date);
		this.timeGoCell = 100;
		this.progress = 0;
		this.currentStep = 0;
		
		var self = this;
		
		
		if(this.canMoveTo(direction)){
			console.log("y "+this.y+" x "+ this.x);
			var prevPosition = Bob.forward();
			
			this.timerMoveTo = window.setInterval(function(){
			
				//Calcul du pourcentage de progression dans la case 
				//obtenu par le ratio du temps parcouru sur le temps que l'on met à parcourir une cellule
				self.currentTime = +(new Date);
				self.progress = ((self.currentTime - self.previousTime) % self.timeGoCell) / self.timeGoCell;
				

				var newStep = Math.floor((self.currentTime - self.previousTime) / self.timeGoCell);
				
				//si on change de case alors on marque le new step et on clear l'interval 
				if(newStep != self.currentStep){
					self.currentStep = newStep;
					if(self.canMoveTo(self.direction)){
						prevPosition = Bob.forward();
						Bob.updateRender(prevPosition, self.progress);
					} else{
						Bob.updateRender(prevPosition, 1);
						clearInterval(self.timerMoveTo);
						self.timerMoveTo = null;
					} 
				} else {
					Bob.updateRender(prevPosition, self.progress);
				}
			},30);
			
		}		
	};
	

	

	
	/**
	 * method : canMoveTo(string direction)
	 * @Docs : Permet de tester si Sasha peut bouger sur la map
	 */
	BobConstructor.prototype.canMoveTo = function(direction){
		var ScreenWidthCell = Screen.ScreenWidthCell;
		var ScreenHeightCell = Screen.ScreenHeightCell;

		//if(Control.statment[direction] != true) return false;
		if (Control.isPress != true) return false;
		switch (direction){
			case 'right' : 
				if(this.x+1 >= ScreenWidthCell){
					return false;
				} else{
					return true;
				}	
			case 'left' : 
				if(this.x-1 < 0){
					return false;
				} else {
					return true;
				}
			case 'up' : 
				if(this.y-1 < 0){
					return false;
				} else {
					return true;
				}
			case 'down' : 
				if(this.y+1 >= ScreenHeightCell){
					return false;
				} else {
					return true;
				}
		}
	};
	

	
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	

	/**
	 * Class : Control()
	 * @Docs : Permet de catché la direction et l'etat du bouton  
	 */
	var ControlConstructor = function Control() {
		
		var self = this;
		this.isPress = false;
		
		this.initKeyboard();
	};


	ControlConstructor.prototype.initKeyboard = function(){

		var self = this;

		$(document).on('keydown', function(e){
			if (Bob.timerMoveTo) return ;
			switch(e.keyCode ) {
				case 37 : 
					this.direction = 'left';
					break;
				case 38 : 
					this.direction = 'up';
					break;
				case 39 : 
					this.direction = 'right';
					break;
				case 40 : 
					this.direction = 'down';
					break;
				default : 
					break;	
			}

			Bob.direction = this.direction;
			self.isPress = true;
			Bob.moveTo(Bob.direction);

		});

		$(window).keyup(function () {	

			self.isPress = false;
			if (Bob.timerMoveTo) return ;
			Bob.stopMove(Bob.direction);
		
		});
	};




/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	


	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	


/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	
	
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


	
	 
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	


	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	

	var Screen = new ScreenConstructor(330, 330, 30, 30, $('.screen'));
	Screen.build();


	var Bob = new BobConstructor($('.sasha'), 'down', {top : 6, left : 5});
	var Control = new ControlConstructor();

	
};




$(function () { setTimeout(initPokemon, 50); });