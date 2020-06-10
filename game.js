//function for when window is fully loaded
window.onload = function() {
	//get the canvas and context(2d or 3rd)
	var canvas = document.getElementById("viewport");
	var context = canvas.getContext("2d");

	//level object
	var level = {
		x: 250,
		y: 113,
		columns: 8,
		rows: 8,
		tilewidth: 40,
		tileheight: 40,
		tiles: [],
		selectedtile: { selected: false, column: 0, row: 0 }
	}

	var tilecolors = [[255, 128, 128],
                      [128, 255, 128],
                      [128, 128, 255],
                      [255, 255, 128],
                      [255, 128, 255],
                      [128, 255, 255],
                      [255, 255, 255]];

	//timing and fps
	var lastframe = 0;
	var fpstime = 0;
	var framecount = 0;
	var fps = 0;

	//initialize the game
	function init() {

		//initialize the 2-d tile array
		for (var i=0; i<level.columns; i++) {
			level.tiles[i] = [];
			for (var j=0; j<level.rows; j++) {
				//define a tile type and a shift parameter for animation
				level.tiles[i][j] = { type: 0, shift: 0 }
			}
		}

		//add mouse event listeners
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mouseout", onMouseOut);

		//main game loop
		main(0);
	}

	function createLevel() {
		var done = false;

		//keeps generating levels until correct condition is met
		while (!done) {

			//generates level with random tiles
			for (var i=0; i<level.columns; i++) {
				for (var j=0; j<level.rows; j++) {
					level.tiles[i][j].type = getRandomTile();
				}
			}

			resolveClusters();
			findMoves();

			if (moves.length > 0) {
				done = true;
			}
		}
	}

	//remove clusters and insert tiles
	function resolveClusters() {
		findClusters();

		while (clusters.length > 0) {
			removeClusters();
			shiftTiles();
			findClusters();
		}
	}

	//array of found clusters
	var clusters = []; // { column, row, length, horizontal }

	function findClusters() {
		//reset clusters
		clusters = []

		//find horizontal clusters
		for (var j=0; j<level.rows; j++) {
			//start with a single tile, cluster of 1
			var matchlength = 1;

			for (var i=0; i<level.columns; i++) {
				var checkcluster = false;

				if (i == level.columns-1) {
					checkcluster = true;
				} else {
					//check type of next tile
					if (level.tiles[i][j].type == level.tiles[i+1][j].type &&
						level.tiles[i][j].type != -1) {
						//same type as the previous tile, increase matchlength
						matchlength += 1;
					} else {
						//different type
						checkcluster = true;
					}

				}

				//check if there was a cluster
				if (checkcluster) {
					if (matchlength >= 3) {
						//horizontal cluster found
						clusters.push({ column: i+1-matchlength, row: j,
										length: matchlength, horizontal: true });
					}

					matchlength = 1;
				}
			}
		}

		//find vertical clusters
		for (var i=0; i<level.columns; i++) {
			//start w/a single tile, cluster of 1
			var matchlength = 1;

			for (var j=0; j<level.rows; j++) {
				var checkcluster = false;

				if (j == level.rows-1) {
					//last tile
					checkcluster = true;
				} else {
					//check the type of the next tile
					if (level.tiles[i][j].type == level.tiles[i][j+1].type &&
						level.tiles[i][j].type != -1) {
						//same type as previous tile, increase matchlength
						matchlength +=1;
					} else {
						//different type
						checkcluster = true;
					}
				}

				//check if there was a cluster
				if (checkcluster) {
					if (matchlength >= 3) {
						//vertical cluster found
						clusters.push({ column: i, row: j+1-matchlength,
										length: matchlength, horizontal: false })
					}

					matchlength = 1;
				}
			}
		}
	}

	//need to add algos for finding moves, removing clusters and an AI bot to find moves - incomplete

	//main game loop
	function main (tframe) {
		//request animation frames
		window.requestAnimationFrame(main);

		//update and render game
		update(tframe);
		render();

	}

	//update game state
	function update(tframe) {
		var dt = (tframe - lastframe) / 1000;
		lastframe = tframe;

		//update fps counter
		updateFps(dt);
	}

	function updateFps(dt) {
		if (fpstime > 0.25) {
			//calculate fps
			fps = Math.round(framecount / fpstime);

			//reset time and framecount
			fpstime = 0;
			framecount = 0;
		}

		//increase time and framecount
		fpstime += dt;
		framecount++;
	}

	//render the game
	function render() {
		//draw the frame
		drawFrame();
	}

	function drawFrame() {
		//draw background and border
		context.fillStyle = "#d0d0d0";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "#e8eaec";
		context.fillRect(1, 1, canvas.width-2, canvas.height-2);

		//draw header
		context.fillStyle = "#303030";
		context.fillRect(0,0, canvas.width, 65);

		//draw title
		context.fillStyle = "#ffffff";
		context.font = "24px Arial";
		context.fillText("HTML5 Canvas Match-3 Game", 10, 30);

		//display fps
		context.fillStyle = "#ffffff";
		context.font = "12px Arial";
		context.fillText("FPS: " + fps, 13, 50);
	}

	//mouse event handlers
	function onMouseMove(e) {}
	function onMouseDown(e) {}
	function onMouseUp(e) {}
	function onMouseOut(e) {}

	//get the mouse position
	function getMousePosition(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
			y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
		};
	}

	//calling init starts the game

	init();
}