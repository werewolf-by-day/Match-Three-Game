//function for when window is fully loaded
window.onload = function() {
	//get the canvas and context(2d or 3rd)
	var canvas = document.getElementById("viewport");
	var context = canvas.getContext("2d");

	//timing and fps
	var lastframe = 0;
	var fpstime = 0;
	var framecount = 0;
	var fps = 0;

	//initialize the game
	function init() {
		//add mouse event listeners
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mouseout", onMouseOut);

		//main game loop
		main(0);
	}

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