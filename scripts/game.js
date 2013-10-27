//max int: 9,007,199,254,740,992
var Game = {};

/*
	Game.Goal
		id:				String ID to be used to generate the list of goals; when the goal is clicked on, we use the li's ID to science.
		name:			String name of the goal
		reqObj:			Object of the requirements to hit the goal.
			Format:		{effort: 0, paperwork: 0, yessir: 0}
		unlocks:		function that executes when requirements are met. Use this to show next requirements; do NOT use this to show/hide goals
*/

Game.Goal = function(name, reqObj, unlocks) {
	//this.id = id;
	this.name = name;
	this.reqObj = reqObj;
	this.unlocks = unlocks;
	return this;
}

Game.Goals = [
	new Game.Goal("Two Column", {effort: 10, paperwork: 0, yessir: 0}, function() {
		twoCol();
		Game.listPowerUp("effort1");
	}),
	new Game.Goal("Three Column", {effort: 9007199254740990, paperwork: 9007199254740990, yessir: 9007199254740990}, function() {
		threeCol();
		Game.listPowerUp("effort2");
		Game.listPowerUp("effort3");
	}),
	new Game.Goal("Four Column", {effort: 30, paperwork: 0, yessir: 0}, function() {
		fourCol();
	})
];

Game.Initialize = function() {
	//Function care of http://diveintohtml5.info/storage.html
	function supports_html5_storage() {
		try {
			return ('localStorage' in window && window['localStorage'] !== null);
		} catch (e) {
			return false;
		}
	}
	
	if(!supports_html5_storage()) {
		$("#nosupport").html("We're sorry, but your browser does not support GetElected!. Please consider Google Chrome or Mozilla Firefox for all of your browsing needs.");
		return;
	}
	var efforttally = paperworktally = yessirtally = 0;
	var currentGoalIndex = 50;
	var scrollerBase = 10;
	var scrollStatus = "";
	var fps = 30;	//starting at 10 Frames Per Second, then stepping it up to make sure no slow down; goal is at least 30
	var efforttoggle = 1;
	var effortFlag1 = 0;
	var interest = 0.35;	//Be sure to tip your costs, and drive home safe!
	Game.compInt = function(base, times) {
		return Math.floor(base * Math.pow(1+interest, times));
	}
	Game.incrementEffort = function(num) {
		efforttally += num;
	}
	Game.incrementPaperwork = function(num) {
		paperworktally += num;
	}
	Game.incrementYessir = function(num) {
		yessirtally += num;
	}

	Game.updatePastGoals = function() {
		$("#pastGoals").empty();
		for(var i = 0;i<currentGoalIndex && i < Game.Goals.length;i++) {
			var currGoal = Game.Goals[i];
			var li = $("<li>");
			$("#pastGoals").append(li);
			var q = $("<q>");
			var html = "";
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir) : "");
			q.html(html);
			li.html(currGoal.name);
			li.append(q);
			currGoal.unlocks();
		}
	}
	
	Game.addPastGoal = function(currGoal) {
		var li = $("<li>");
		$("#pastGoals").append(li);
		var q = $("<q>");
		var html = "";
		html += (currGoal.reqObj.effort !== 0 ? "Effort: " + currGoal.reqObj.effort : "") + " ";
		html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + currGoal.reqObj.paperwork : "") + " ";
		html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + currGoal.reqObj.yessir : "");
		q.html(html);
		li.html(currGoal.name);
		li.append(q);
	}
	
	Game.updateCurrentGoals = function() {
		$("#currentGoal").empty();
		var currGoal = Game.Goals[currentGoalIndex];
		if(!currGoal) {
			var li = $("<li>");
			$("#currentGoal").append(li);
			var html = "End Game";
			li.html(html);
		}
		else {
			var li = $("<li>");
			$("#currentGoal").append(li);
			var q = $("<q>");
			var html = "";
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir) : "");
			q.html(html);
			li.html(currGoal.name);
			li.append(q);
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
							Game.addPastGoal(goal);
							Game.updateCurrentGoals();
					}
				}
			}(currGoal));
		}
	}
	
	$("#yessirer").scrollTop(scrollerBase);
	$("#efforter").click(function(e) {
		var howmuch = 1 + (effortFlag1 === true ? 5 : 0);
		Game.incrementEffort(howmuch);
		
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		var obj = $("#effortclone").clone();
		obj.html("+" + howmuch);
		$("body").append(obj);
		var left = 15 * efforttoggle;
		efforttoggle *= -1;
		obj.offset({left: e.pageX, top: e.pageY - 30});
		obj.css("opacity", 100);
		obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
			$(this).remove();
		});
	});
	
	$("#ticker").css("opacity", 0).slideDown(2000).animate({opacity: 1}, {
		queue: false, duration: 2000
	});
	
	$("#efforter").mousedown(function(e) {
		//$(this).stop().removeClass("effortup");
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 3}, 'fast');
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: "5px 5px 2px rgba(0, 0, 0, 0.3)"}, 'fast');
		//$(this).stop().addClass("effortup");
	});
	
	
	$("#paperworker").mousemove(function() {
		Game.incrementPaperwork(1/20);
	});
	
	$("#yessirer").scroll( function(e) {
		var scrollerLoc = $(this).scrollTop();
		if(scrollStatus === "") {	//Status not yet set! SUCCESS, BITCHES
			Game.incrementYessir(1);
			if (scrollerLoc < scrollerBase) scrollStatus = "U";
			else scrollStatus = "D";
		}
		else {
			if(scrollerLoc !== scrollerBase) {	//If current location is not equal to the base that it should always be reset to, THEEEEEENNNN...
				if(scrollerLoc < scrollerBase && scrollStatus === "D") {	//If location is "lower" (i.e. higher...it's weird) and the last status is down, then tally up and switch status to up!
					Game.incrementYessir(1);
					scrollStatus = "U";
				}
				else if(scrollerLoc > scrollerBase && scrollStatus === "U") {	//See comment above, but opposite it!...No, not the "Status not yet set" comment. Sheesh.
					Game.incrementYessir(1);
					scrollStatus = "D";
				}
			}
		}
		$(this).scrollTop(scrollerBase);
	});
	
	Game.myFunc = function(id, count, func) {
		this.id = id;
		this.count = count;
		this.func = func;
		return this;
	}
	
	var powerups = {};			//this is the one that will be saved! THIS ONE! It will contain an id, and the number of how many of each power up the player has.
	var powerupsfuncs = {};		//this is what will hold the id of the powerup, the cost(s?), the label, what section it goes to, and the function that will execute every frame during Game.Update().
	
	/*
		id:				id of the power up
		cost:			object, in the format of {effort: 10, paperwork: 0, yessir: 0}
		lable:			Primary Label of the Power Up
		description:	Secondary description of power up (Flavor text!)
		section:		Where it will go to. Either effortPowerUp, paperworkPowerUp, or yessirPowerUp
		func:			function that executes every 1000/fps ms. MUST ALWAYS RETURN OBJECT IN THE FOLLOWING FORMAT:	
			{
				"effort": 1*num,
				"paperwork": 0*num,
				"yessir": 0*num
			};
		onetime:		Can the player use this only one time? true if...well, true. False if nope.
	*/
	var addPowerUp = function(id, cost, label, description, section, func, onetime) {
		powerups[id] = 0;
		powerupsfuncs[id] = {
			"cost": cost,
			"label": label,
			"section": section,
			"description": description,
			"func": func,
			"onetime": onetime
		};
	}
	
	addPowerUp("effort1", {effort: 10, paperwork: 0, yessir: 0}, "Acquaintance", "+1 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort": 1*num,
			"paperwork": 0*num,
			"yessir": 0*num
		};
	}, false);
	
	addPowerUp("effort2", {effort: 50, paperwork: 0, yessir: 0}, "Friend", "+5 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	5*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("effort3", {effort: 100, paperwork: 0, yessir: 0}, "Try Harder", "+5 Effort Per Click", "effortPowerUp", function(num) {
		effortFlag1 = true;
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true);
	
	Game.listPowerUp = function(id) {
		//powerups[id]++;
		if($("#" + id).length === 0) {
			var func = powerupsfuncs[id];
			var target = $("#" + func["section"]);
			var li = $("<li>");
			li.attr("id", id);
			li.attr("title", func["description"]);
			li.html(func["label"]);
			//li.html();
			target.append(li);
			var q = $("<q>");
			var html = "";
			html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id])) : "") + " ";
			html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id])) : "") + " ";
			html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id])) : "");
			q.html(html);
			q.attr("id", id + "_q");
			li.append(q);
			var pre = $("<pre>");
			pre.attr("id", id + "_pre");
			pre.html("Total: " + powerups[id]);
			li.append(pre);
			li.click(function(goal, id) {
				return function() {
					var effortVal = Game.compInt(func["cost"].effort, powerups[id]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[id]), yessirVal = Game.compInt(func["cost"].yessir, powerups[id]);
					if(efforttally >= effortVal &&
						paperworktally >= paperworkVal &&
						yessirtally >= yessirVal) {
							if(func["onetime"] === true && powerups[id] > 0) return;
							powerups[id]++;
							efforttally -= effortVal;
							paperworktally -= paperworkVal;
							yessirtally -= yessirVal;
							var q = $("#" + id + "_q");
							var html = "";
							html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id])) : "") + " ";
							html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id])) : "") + " ";
							html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id])) : "");
							q.html(html);
							var pre = $("#" + id + "_pre");
							pre.html("Total: " + powerups[id]);
					}
				}
			}(func, id));
			li.tooltip({track: true});
		}
	}
	
	Game.Load = function() {
		if(localStorage["efforttally"] && localStorage["efforttally"] !== "") {
			efforttally = ~~localStorage["efforttally"];
			paperworktally = ~~localStorage["paperworktally"];
			yessirtally = ~~localStorage["yessirtally"];
			currentGoalIndex = ~~localStorage["currentGoalIndex"];
			for(var i in powerups) {
				if(localStorage[i]) powerups[i] = ~~localStorage[i];
			}
		}
	}
	
	Game.Save = function() {
		/*
			OK, let's declare the variables we NEED to save:
			powerups
			efforttally
			paperworktally
			yessirtally
			currentGoalIndex
		*/
		for(var i in powerups) {
			localStorage[i] = powerups[i];
		}
		localStorage["efforttally"] = Math.round(efforttally);
		localStorage["paperworktally"] = Math.round(paperworktally);
		localStorage["yessirtally"] = Math.round(yessirtally);
		localStorage["currentGoalIndex"] = currentGoalIndex;
	}

	Game.Update = function() {
		for(var i in powerups) {
			if(powerups[i] > 0) {
				var results = powerupsfuncs[i]["func"](powerups[i]);
				Game.incrementEffort(results["effort"] / fps);
				Game.incrementPaperwork(results["paperwork"] / fps);
				Game.incrementYessir(results["yessir"] / fps);
			}
		}
	}
	Game.Draw = function() {
		$("#efforttally").html(numberWithCommas(Math.floor(efforttally)) + " Effort");
		$("#paperworktally").html(numberWithCommas(Math.floor(paperworktally)) + " Paperwork");
		$("#yessirtally").html(numberWithCommas(Math.floor(yessirtally)) + " Yes, Sir!");
	}
	
	Game.Loop = function() {
		Game.Update();
		Game.Draw();
		//YAY THE FRAME IS DONE! Let's make sure we're staying close to our FPS goal
		var delta = (new Date().getTime() - lastRun) / 1000;
		lastRun = new Date().getTime();
		var currFPS = ~~(1/delta);
		$("#fps").html(currFPS + " fps");
		setTimeout(Game.Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
	}
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Game.Load();
	Game.updatePastGoals();
	Game.updateCurrentGoals();
	setInterval(Game.Save, 1000*10);	//Save every 60 seconds
	
	//Last but not least, let's get some shit in place to track FPS, JUUUUST in case things start running slow.
	var lastRun = new Date().getTime();
	Game.Loop();
}