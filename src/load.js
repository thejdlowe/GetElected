var Load = function() {
	try {
		console.log("localStorage: " + localStorage["efforttally"])
		if(localStorage.save && localStorage.save !== "") {
			var str = LZString.decompressFromBase64(localStorage.save);
			if(localStorage["efforttally"]) {
				localStorage.clear();
				Save();
			}
			var obj = JSON.parse(str);
			
			var l = function(val) {
				return Math.round(parseFloat(val));
			}
			
			efforttally = l(obj["efforttally"]);
			paperworktally = l(obj["paperworktally"]);
			yessirtally = l(obj["yessirtally"]);
			if(obj["currGoalLabel"]) currentGoalIndex = currGoalIndex(obj["currGoalLabel"]);
			else currentGoalIndex = l(obj["currentGoalIndex"]);
			totalRestart = l(obj["totalRestart"]);
			for(var i in powerups) {
				if(obj[i]) powerups[i] = l(obj[i]);
			}
			$("#autogoal").prop("checked", obj["autogoal"] === "true");
			totalEffortClicks = l(obj["totalEffortClicks"]);
			totalEffortGained = l(obj["totalEffortGained"]);
			totalPaperworkWiggles = l(obj["totalPaperworkWiggles"]);
			totalYessirScrolls = l(obj["totalYessirScrolls"]);
			startDate = l(obj["startDate"]);
			
			
			totalRestart = isNaN(totalRestart) ? 0 : totalRestart;
			totalEffortClicks = isNaN(totalEffortClicks) ? 0 : totalEffortClicks;
			totalEffortGained = isNaN(totalEffortGained) ? 0 : totalEffortGained;
			totalPaperworkWiggles = isNaN(totalPaperworkWiggles) ? 0 : totalPaperworkWiggles;
			totalYessirScrolls = isNaN(totalYessirScrolls) ? 0 : totalYessirScrolls;
			
			randomSpawn();
		}
		else if(localStorage["efforttally"] && localStorage["efforttally"] !== "") {
			console.log("success");
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
		}
	}
	catch(e) {
		return alert("There was a problem loading the save data.");
	}
}