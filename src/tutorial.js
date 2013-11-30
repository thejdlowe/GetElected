var Tutorial = function() {
	try {
		if(!localStorage.save) {
			var overlay = $("<div>");
			overlay.css({"position": "absolute", "display": "none", "width": "100%", "height": "100%", "top": "0", "left": "0", "background": "rgba(0,0,0,0.3)", "z-index": "99998"});
			$("body").append(overlay);
			//randomCreate("firstone");	//Yep. First one's free.
			var act = $("#tutorial").clone();
			overlay.append(act);
			act.show().css({"position": "absolute", "width": "20%", "bottom": "40px", "right": 0});
			var button = $("<button>");
			/*
			$("#currGoal").click(function(goal) {
			return function() {
				console.log("Click");
				if(efforttally >= goal.reqObj.effort &&
					paperworktally >= goal.reqObj.paperwork &&
					yessirtally >= goal.reqObj.yessir) {
						goal.unlocks();
						currentGoalIndex++;
						efforttally -= goal.reqObj.effort;
						paperworktally -= goal.reqObj.paperwork;
						yessirtally -= goal.reqObj.yessir;
						addPastGoal(goal);
						updateCurrentGoals();
						resizer();
				}
			}
		}(currGoal));
			*/
			button.html("Close Tutorial").click(function() {
				$(overlay).remove();
				randomCreate("firstone");	//Yep. First one's free.
			});
			act.append(button);
			//actualTutorial.attr("id", "tutorial");
			overlay.fadeIn(300);
		}
	}
	catch(e) {
	}
};