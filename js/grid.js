var initApplication = function(){
	







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
	var BobConstructor = function Bob(bobSprite, position) {
		
		this.y = position.y;
		this.x = position.y;

		this.bobSprite = bobSprite;

		this.bobSprite.css({
			'width' 	: Grid.cellWidth,
			'height' 	: Grid.cellWidth,
			'position'	: 'absolute',
			'top'		: (this.y*Grid.cellWidth)+'px', 
			'left'		: (this.x*Grid.cellWidth)+'px',
			'background': '#F0F'
		});

	};




	/**
	 * Class : Goal(jQuery goalSprite, obj position)
	 * @Docs : Constructor of a goal selectable
	 */
	var GoalConstructor = function Goal(goalSprite, position) {
		
		this.y = position.y;
		this.x = position.y;

		this.goalSprite = goalSprite;

		this.goalSprite.css({
			'width' 	: Grid.cellWidth,
			'height' 	: Grid.cellWidth,
			'position'	: 'absolute',
			'top'		: (this.y*Grid.cellWidth)+'px', 
			'left'		: (this.x*Grid.cellWidth)+'px',
			'background': '#F00'
		});

	};



/***********************************************************************************************/
/***************************                               *************************************/
/***************************         INITIALISATIONS       *************************************/
/***************************                               *************************************/
/***********************************************************************************************/
	
	

	Grid = new GridConstructor( 330, 330, 30, $('.screen') );
	Grid.build();

	Bob = new BobConstructor($('.bob-sprite'), { y : 0, x : 0 } );	
	Goal = new GoalConstructor($('.goal-sprite'), { y : 10, x : 10 } );

		

};




initApplication();


