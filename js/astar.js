/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	
	/**
	 * Class : Debug()
	 * @Docs : Constructor for construct datas uses for the debug
	 */
	var AstarConstructor = function Astar(){
		//init	
	};

	/**
	 * Class : manathan()
	 * @Docs : 
	 */
	AstarConstructor.prototype.manhattan = function (pos0, pos1){
		var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        var result = d1 + d2;
        console.log('manathan = '+ result);
        return d1 + d2;
	};


	Astar = new AstarConstructor();
	Astar.manhattan(
		{
			x : Bob.x,
			y : Bob.y
		 },
		 {
		 	x : Goal.x,
			y : Goal.y
		 }
	);