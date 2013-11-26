var Save = function() {
	/*
		OK, let's declare the variables we NEED to save:
		powerups
		efforttally
		paperworktally
		yessirtally
		currentGoalIndex
	*/
	try {
		for(var i in powerups) {
			localStorage[i] = powerups[i];
		}
		localStorage["efforttally"] = Math.round(efforttally);
		localStorage["paperworktally"] = Math.round(paperworktally);
		localStorage["yessirtally"] = Math.round(yessirtally);
		localStorage["currentGoalIndex"] = currentGoalIndex;
		localStorage["autogoal"] = autogoal;
		localStorage["totalEffortClicks"] = totalEffortClicks;
		localStorage["totalEffortGained"] = totalEffortGained;
		localStorage["totalPaperworkWiggles"] = totalPaperworkWiggles;
		localStorage["totalYessirScrolls"] = totalYessirScrolls;
		localStorage["startDate"] = startDate;
		localStorage["totalRestart"] = totalRestart;
		
		log("Game Saved");
	}
	catch(e) {
	}
}