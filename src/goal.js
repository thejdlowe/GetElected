/*
	Goal
		id:				String ID to be used to generate the list of goals; when the goal is clicked on, we use the li's ID to science.
		name:			String name of the goal
		reqObj:			Object of the requirements to hit the goal.
			Format:		{effort: 0, paperwork: 0, yessir: 0}
		unlocks:		function that executes when requirements are met. Use this to show next requirements; do NOT use this to show/hide goals
*/

var Goal = function(name, reqObj, unlocks) {
	this.name = name;
	this.reqObj = reqObj;
	this.unlocks = unlocks;
	return this;
}

var addGoal = function(name, reqObj, unlocks) {
	goals[goals.length] = new Goal(name, reqObj, unlocks);
}

var updatePastGoals = function() {
	$("#pastGoals").empty();
	for(var i = 0;i<currentGoalIndex && i < goals.length;i++) {
		var currGoal = goals[i];
		var li = $("<li>");
		$("#pastGoals").prepend(li);
		var q = $("<q>");
		var html = "";
		html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
		q.html(html);
		li.html(currGoal.name);
		li.append(q);
		currGoal.unlocks();
	}
}

var addPastGoal = function(currGoal) {
	var li = $("<li>");
	$("#pastGoals").prepend(li);
	var q = $("<q>");
	var html = "";
	html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
	html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
	html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
	q.html(html);
	li.html(currGoal.name);
	li.append(q);
	li.addClass("disabled");
}

var currGoalIndex = function(name) {
	for(var i = 0;i<goals.length;i++) {
		if(goals[i].name === name) return i;
	}
	return -1;
}

var updateCurrentGoals = function() {
	$("#currentGoal").empty();
	var currGoal = goals[currentGoalIndex];
	if(!currGoal) {
		var li = $("<span>");
		$("#currentGoal").append(li);
		var html = "End Game";
		li.html(html);
	}
	else {
		var li = $("<span>");
		$("#currentGoal").append(li);
		$("#effortgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.effort.toFixed(0)));
		$("#paperworkgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)));
		$("#yessirgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)));
		li.html(currGoal.name);
		//li.append(q);
		li.click(function(goal) {
			return function() {
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
	}
}