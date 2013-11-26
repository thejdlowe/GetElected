var Loop = function() {
	Update();
	missedFrames += (new Date().getTime() - lastRun) - (1000/fps);
	missedFrames = Math.min(missedFrames, 1000*5);	//admittedly, I like this logic from Cookie Clicker; catch up on up to 5 seconds worth of frame data if there is latency.
	while(missedFrames > 0) {
		Update();
		missedFrames -= 1000/fps;
	}

	Draw();
	//lastRun = new Date().getTime();
	//YAY THE FRAME IS DONE! Let's make sure we're staying close to our FPS goal
	//var delta = (new Date().getTime() - lastRun) / 1000;
	lastRun = new Date().getTime();
	//var currFPS = ~~(1/delta);
	//console.log(currFPS + " fps");
	//console.log(eps);
	//console.log(autogoal + " " + localStorage["autogoal"] + " " +  $('#autogoal').prop('checked'));
	setTimeout(Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
}