var initPokemon = function() {
		
	
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	
	/**
	 * Class : Screen(Object params)
	 * @Docs : Permet de construir un objet Screen 
	 */
	var ScreenConstructor = function Screen (params){
		
		this.cellWidth 	= params.cellWidth; 
		this.cellHeight = params.cellHeight;
		this.screenWidth 	= params.screenWidth;
		this.screenHeight	= params.screenHeight;
		this.$elem 		= params.$elem;

		this.ScreenWidthCell = (this.screenWidth/this.cellWidth);
		this.ScreenHeightCell = (this.screenHeight/this.cellHeight);

		
	};


	/**
	 * method : buid()
	 * @Docs : build coordinates y and x for the grid
	 */
	ScreenConstructor.prototype.build = function(){

		var width = this.$elem.width()/this.cellWidth;
		var height = this.$elem.height()/this.cellWidth;
		var grid = [];
		
		this.$elem
		.width(this.screenWidth)
		.height(this.screenHeight);


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
	var BobConstructor = function Bob(params) {
		this.y = params.position.top;
		this.x = params.position.left;
		this.speed = params.speed;
		Screen.$elem.append('<div class="'+params.bobSprite+'"></div>');
		this.bobSprite = $('.' + params.bobSprite);

		this.direction = params.direction;
		this.step = 'a';
		this.bobSprite.html('<img src="img/sacha-'+params.direction+'-stop.png"/>');
		this.bobSprite.css({'top':(this.y*Screen.cellHeight)+'px', 'left':(this.x*Screen.cellWidth)+'px'});
		this.isRuning = false;

		this.initKeyboard();
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
		
		if(this.step == 'a') this.step = 'b';
		else this.step = 'a';

		this.bobSprite.empty();
		this.bobSprite.append('<img src="img/sacha-'+this.direction+'-'+this.step+'.png"/>');	

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
		var self = this;
		this.bobSprite.empty();
	 	this.bobSprite.append('<img src="img/sacha-down-stop.png"/>');
		window.clearInterval(self.timerMove);
	};
	
	/**
	 * method : moveTo(string direction)
	 * @Docs : Permet de faire bouger Sasha sur la map
	 */
	BobConstructor.prototype.moveTo = function(direction){
		
		var self = this;
		this.timerMoveTo = null;
		this.previousTime = +(new Date);
		this.currentTime = +(new Date);
		this.timeGoCell = this.speed;
		this.progress = 0;
		this.currentStep = 0;
		
		
		
		if(this.canMoveTo(direction)){
			
			var prevPosition = self.forward();
			
			this.timerMoveTo = window.setInterval(function(){
				var newStep;			
				//Calcul du pourcentage de progression dans la case 
				//obtenu par le ratio du temps parcouru sur le temps que l'on met à parcourir une cellule
				self.currentTime = +(new Date);
				self.progress = ((self.currentTime - self.previousTime) % self.timeGoCell) / self.timeGoCell;
				

				newStep = Math.floor((self.currentTime - self.previousTime) / self.timeGoCell);
				
				//si on change de case alors on marque le new step et on clear l'interval 
				if(newStep != self.currentStep){
					self.currentStep = newStep;
					if(self.canMoveTo(self.direction)){
						prevPosition = self.forward();
						self.updateRender(prevPosition, self.progress);
					} else{
						self.updateRender(prevPosition, 1);
						clearInterval(self.timerMoveTo);
						self.timerMoveTo = null;
					} 
				} else {
					self.updateRender(prevPosition, self.progress);
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
		if (this.isPress != true) return false;
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
	


	BobConstructor.prototype.initKeyboard = function () {
		var self = this;
		this.isPress = false;
				
		$(document).on('keydown', function(e){
			if (self.timerMoveTo) return ;
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

			self.direction = this.direction;
			self.isPress = true;
			self.moveTo(self.direction);

		});

		$(window).keyup(function () {	

			self.isPress = false;
			if (self.timerMoveTo) return ;
			self.stopMove(self.direction);
		
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
	
	

	var Screen = new ScreenConstructor({
		screenWidth : 330,
		screenHeight : 330,
		cellWidth : 30,
		cellHeight : 30,
		$elem : $('.screen')
	});

	Screen.build();

	var Bob = new BobConstructor({
		bobSprite : 'sasha', 
		direction : 'up',
		speed : 200,
		position : {
			top : 6,
			left : 5
		}
	});

	console.log(Bob);

	
};




$(function () { setTimeout(initPokemon, 50); });