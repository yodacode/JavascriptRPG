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





/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

	/**
	 * Class : Sprite()
	 * @Docs : Construction of  sprite 
	 */
	var SpriteConstructor = function Sprite(x,y) {
		this.x = x;
		this.y = y;
	};


	/**
	 * method : addSprite()
	 * @Docs : Recupère les coordonnées et coupe l'image en sprite grâce à la method updateRender
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
	





/***********************************************************************************************/
/***************************                               *************************************/
/***************************         INITIALISATIONS       *************************************/
/***************************                               *************************************/
/***********************************************************************************************/

	Grid = new GridConstructor(330,330,30,$('.screen'));
	Grid.build();


};




initApplication();


