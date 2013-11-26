var Load = function() {
	try {
		if(localStorage["efforttally"] && localStorage["efforttally"] !== "") {
			efforttally = Math.round(parseFloat(localStorage["efforttally"]));
			paperworktally = Math.round(parseFloat(localStorage["paperworktally"]));
			yessirtally = Math.round(parseFloat(localStorage["yessirtally"]));
			currentGoalIndex = Math.round(parseFloat(localStorage["currentGoalIndex"]));
			totalRestart = Math.round(parseFloat(localStorage["totalRestart"]));
			for(var i in powerups) {
				if(localStorage[i]) powerups[i] = Math.round(parseFloat(localStorage[i]));
			}
			$("#autogoal").prop("checked", localStorage["autogoal"] === "true");
			totalEffortClicks = Math.round(parseFloat(localStorage["totalEffortClicks"]));
			totalEffortGained = Math.round(parseFloat(localStorage["totalEffortGained"]));
			totalPaperworkWiggles = Math.round(parseFloat(localStorage["totalPaperworkWiggles"]));
			totalYessirScrolls = Math.round(parseFloat(localStorage["totalYessirScrolls"]));
			totalRestart = isNaN(totalRestart) ? 0 : totalRestart;
			totalEffortClicks = isNaN(totalEffortClicks) ? 0 : totalEffortClicks;
			totalEffortGained = isNaN(totalEffortGained) ? 0 : totalEffortGained;
			totalPaperworkWiggles = isNaN(totalPaperworkWiggles) ? 0 : totalPaperworkWiggles;
			totalYessirScrolls = isNaN(totalYessirScrolls) ? 0 : totalYessirScrolls;
			
			startDate = Math.round(parseFloat(localStorage["startDate"]));
			randomSpawn();
		}
		else {
			randomCreate("firstone");	//Yep. First one's free.
		}
	}
	catch(e) {
	}
}