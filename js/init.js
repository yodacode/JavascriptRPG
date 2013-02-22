/***********************************************************************************************/
/***************************                               *************************************/
/***************************         INITIALISATIONS       *************************************/
/***************************                               *************************************/
/***********************************************************************************************/
	
	
	
	//Construcion of the Grid
	Grid = new GridConstructor( 330, 330, 30, $('.screen') );
	Grid.build();


	//Construction of the Start
	Bob = new BobConstructor($('.bob-sprite'), { y : 1, x : 0 }, 'up' );	

	Control = new ControlConstructor();


