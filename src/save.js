var Save = function(str) {
	try {
		if(str) {
			localStorage.save = LZString.compressToBase64(str);
		}
		else {
			var obj = {
				saveVer: version
			};
			
			for(var i in powerups) {
				obj[i] = powerups[i];
			}
			obj["efforttally"] = Math.round(efforttally);
			obj["paperworktally"] = Math.round(paperworktally);
			obj["yessirtally"] = Math.round(yessirtally);
			obj["briberytally"] = Math.round(briberytally);
			obj["currGoalLabel"] = currGoalLabel(currentGoalIndex);
			obj["numberA"] = $("#numberA").val();
			//obj["currentGoalIndex"] = currentGoalIndex;
			obj["autogoal"] = autogoal;
			obj["lowgraphics"] = lowgraphics;
			obj["totalEffortClicks"] = totalEffortClicks;
			obj["totalEffortGained"] = totalEffortGained;
			obj["totalPaperworkWiggles"] = totalPaperworkWiggles;
			obj["totalYessirScrolls"] = totalYessirScrolls;
			obj["startDate"] = startDate;
			obj["totalRestart"] = totalRestart;
			
			localStorage.save = LZString.compressToBase64(JSON.stringify(obj));
			if(testing === true) localStorage.rawsave = JSON.stringify(obj);
			//console.log(JSON.stringify(obj));
			
			/*for(var i in powerups) {
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
			localStorage["totalRestart"] = totalRestart;*/
		}
		log("Game Saved");
	}
	catch(e) {
	}
}