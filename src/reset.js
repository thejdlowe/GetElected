var Reset = function() {
	for(var i in powerups) {
		powerups[i] = 0;
	}
	efforttally = 0;
	paperworktally = 0;
	yessirtally = 0;
	totalRestart += currentGoalIndex;
	currentGoalIndex = 0;
	totalEffortClicks = 0;
	totalEffortGained = 0;
	totalPaperworkWiggles = 0;
	totalYessirScrolls = 0;
	flags.resetAll();
	flags.flag("multiplier", 1);
	startDate = (new Date()).getTime()
	recalculate();
	resizer();
	clearTimeout(randSpawnTimer);
	$("#effortdescribe").show();
	$("#paperworkdescribe").show();
	$("#yessirdescribe").show();
	randomCreate("firstone");
	buildPows();
}