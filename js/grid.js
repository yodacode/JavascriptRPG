
	



/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	

	/**
	 * Class : Grid(int gridWidth, int gridHeight int cellWidth [, jQuery $elem ])
	 * @Docs : Construction of the grid
	 */
	var GridConstructor = function Grid (gridWidth, gridHeight, cellWidth, $elem){
		
		this.gridWidth 	= gridWidth;
		this.gridHeight	= gridHeight;
		this.cellWidth 	= cellWidth;
		this.$elem 		= $elem;
		this.getGrid 	= [];
		
		this.gridWidthSize = this.gridWidth/this.cellWidth;
		this.gridHeightSize = this.gridHeight/this.cellWidth;

	};


	/**
	 * method : buid()
	 * @Docs : build coordinates y and x for the grid
	 */
	GridConstructor.prototype.build = function(){

		this.$elem
		.width(this.gridWidth)
		.height(this.gridHeight);

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



/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

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
		.appendTo(Grid.$elem)
		.width(Grid.cellWidth)
		.height(Grid.cellWidth)
		.css({
			'position' 	: 'absolute',
			'top'		: (this.y*Grid.cellWidth)+'px',
			'left'		: (this.x*Grid.cellWidth)+'px',
			'overflow'	: 'hidden'
		});

	};
	


/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


	/**
	 * Class : Bob(jQuery bobSprite, obj position)
	 * @Docs : Constructor of a Bob (a character)
	 */
	var BobConstructor = function Bob(bobSprite, position, direction) {
		
		this.y = position.y;
		this.x = position.x;

		this.direction = direction;

		this.bobSprite = bobSprite;

		this.bobSprite.css({
			'width' 	: Grid.cellWidth,
			'height' 	: Grid.cellWidth,
			'position'	: 'absolute',
			'top'		: (this.y*Grid.cellWidth)+'px', 
			'left'		: (this.x*Grid.cellWidth)+'px',
			'background': '#F0F'
		});

		console.log('position initial : '+ this.x,this.y);

	};


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
	 * method : 
	 * @Docs : 
	 */
	BobConstructor.prototype.moveTo = function(direction){
		

		this.direction = direction;

		if(this.canMoveTo(direction)){
			
			var prevPosition = this.forward();
			console.log('nouvlle position : x'+ this.x+' y'+this.y);

		}
		
	
	};

	BobConstructor.prototype.stopMove = function(){

	};


	/**
	 * method : 
	 * @Docs : 
	 */
	BobConstructor.prototype.canMoveTo = function(){
		
		var direction = this.direction;
		switch (direction){
			case 'right' : 
				if(this.x+1 >= Grid.gridWidthSize){
					return false;
				} else{
					//return Map.isWalkable(this.y,this.x+1);
					return true;
				}	
			case 'left' : 
				if(this.x-1 < 0){
					return false;
				} else {
					//return Map.isWalkable(this.y,this.x-1)
					return true;
				}
			case 'up' : 
				if(this.y-1 < 0){
					return false;
				} else {
					//return Map.isWalkable(this.y-1,this.x);
					return true;
				}
			case 'down' : 
				if(this.y+1 >= Grid.gridHeightSize){
					return false;
				} else {
					//return Map.isWalkable(this.y+1,this.x);	
					return true;
				}
		}
	};


/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


	var ControlConstructor = function Control() {
		
		this.direction = null;
		var self = this;
		
		$(document).on('keydown', function(e){
			switch(e.keyCode ) {
				case 37 : 
					this.direction = 'left';
					break;
				case 38 : 
					this.direction = 'up';
					break;
				case 39 : 
					this.direction = 'up';
					break;
				case 40 : 
					this.direction = 'down';
					break;
				case 40 : 
					this.direction = 'down';
					break;
				default : 
					break;	
			}
			//$('.screen').append('<p>toto</p>');
			Bob.moveTo(this.direcion);
		});

		$(document).on('keyup', function(e){
			//Bob.stopMove();
		});

		
	};


	/**
	 * Class : Control()
	 * @Docs : Permet de catché la direction et l'etat du bouton  
	 */
	var ControlConstructor = function Control() {
		var self = this;
		this.statment = {
			up : 'nopress',
			down : 'nopress',
			right : 'nopress',
			left : 'nopress'
		}

		$(document).on('keydown', function(e){
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
			//Sasha.direction = $(this).find('.direction').text();
			//self.statment[this.direction] = 'press';
			Bob.moveTo(this.direction);
			//console.log('press : '+this.direction);
		});

		$(window).on('keyup', function () {
			//console.log('nopress');
			//self.statment[this.direction] = 'nopress';			
		});
	};

	//Construcion of the Grid
	Grid = new GridConstructor( 330, 330, 30, $('.screen') );
	Grid.build();


	//Construction of the Start
	Bob = new BobConstructor($('.bob-sprite'), { y : 1, x : 0 }, 'up' );	

	Control = new ControlConstructor();
	







	
