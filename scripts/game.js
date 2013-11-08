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

Game.Initialize = function() {	
	var efforttally = paperworktally = yessirtally = 0;
	var currentGoalIndex = 500000;
	var scrollerBase = 10;	//An arbitrary number; this is where the (hidden) scroll bar will lock itself on scroll for the Yes Sir section.
	var scrollStatus = "";
	var fps = 30;
	var efforttoggle = 1;
	var flags = {
		list: {},
		set: function(id) {
			return this.list[id] = false;
		},
		resetAll: function() {
			for(var i in this.list) {
				this.set(i);
			}
		},
		activate: function(id) {
			return this.list[id] = true;
		},
		get:	function(id) {
			return this.list[id];
		}
	}
	
	/*flags.set("fiveEffortPerClick");
	flags.set("noseToTheGrindstone");
	flags.set("strongerAcquaintanceBond");
	*/
	var interest = 0.27;	//Be sure to tip your costs, and drive home safe!
	var missedFrames = 0;	//How many frames are missed due to latency / the window not being in focus
	Game.compInt = function(base, times) {
		return Math.floor(base * Math.pow(1+interest, times));
	}
	Game.reverseCompInt = function(base, times) {
		return Math.floor(base / Math.pow(1+interest, times));
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
		for(var i = 0;i<currentGoalIndex && i < goals.length;i++) {
			var currGoal = goals[i];
			var li = $("<li>");
			$("#pastGoals").prepend(li);
			li.addClass("disabled");
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
		$("#pastGoals").prepend(li);
		var q = $("<q>");
		var html = "";
		html += (currGoal.reqObj.effort !== 0 ? "Effort: " + currGoal.reqObj.effort : "") + " ";
		html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + currGoal.reqObj.paperwork : "") + " ";
		html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + currGoal.reqObj.yessir : "");
		q.html(html);
		li.html(currGoal.name);
		li.append(q);
		li.addClass("disabled");
	}
	
	Game.updateCurrentGoals = function() {
		$("#currentGoal").empty();
		var currGoal = goals[currentGoalIndex];
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
		e.preventDefault();
		var howmuch = 1 + (flags.get("fiveEffortPerClick") === true ? 5 : 0) + (flags.get("noseToTheGrindstone") === true ? 100 : 0);
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
	
	$("#efforter").mousedown(function(e) {
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 6}, "fast")
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: '0px 9px 0px rgba(219,31,5,1)', top: 0}, "fast")
	});
	
	/*
	$("#ticker").css("opacity", 0).slideDown(2000).animate({opacity: 1}, {
		queue: false, duration: 2000
	});*/
	
	$("#paperworker").mousemove(function() {
		Game.incrementPaperwork(1/20);
	});
	
	$("#yessirer").scroll( function(e) {
		$(this).removeClass("neutral");
		var scrollerLoc = $(this).scrollTop();
		if(scrollStatus === "") {	//Status not yet set! SUCCESS, BITCHES
			Game.incrementYessir(1);
			if (scrollerLoc < scrollerBase) {
				scrollStatus = "U";
				$(this).removeClass("down");
				$(this).addClass("up");
			}
			else {
				scrollStatus = "D";
				$(this).removeClass("up");
				$(this).addClass("down");
			}
		}
		else {
			if(scrollerLoc !== scrollerBase) {	//If current location is not equal to the base that it should always be reset to, THEEEEEENNNN...
				if(scrollerLoc < scrollerBase && scrollStatus === "D") {	//If location is "lower" (i.e. higher...it's weird) and the last status is down, then tally up and switch status to up!
					Game.incrementYessir(1);
					scrollStatus = "U";
					$(this).removeClass("down");
					$(this).addClass("up");
				}
				else if(scrollerLoc > scrollerBase && scrollStatus === "U") {	//See comment above, but opposite it!...No, not the "Status not yet set" comment. Sheesh.
					Game.incrementYessir(1);
					scrollStatus = "D";
					$(this).removeClass("up");
					$(this).addClass("down");
				}
			}
		}
		$(this).scrollTop(scrollerBase);
	});
	
	$("#save").click(function() {
		Game.Save();
	});
	
	$("#reset").click(function() {
		if(confirm("Are you sure you want to reset?")) {
			Game.Reset();
			Game.Save();
			Game.Load();
			Game.updatePastGoals();
			Game.updateCurrentGoals();
			for(var i in powerups) {
				$("#" + i).remove();
			}
			twoCol();
		}
	});

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
	var addPowerUp = function(id, cost, label, description, section, func, onetime, sell) {
		powerups[id] = 0;
		powerupsfuncs[id] = {
			"cost": cost,
			"label": label,
			"section": section,
			"description": description,
			"func": func,
			"onetime": onetime,
			"sell": sell || null
		};
	}
	
	var addGoal = function(name, reqObj, unlocks) {
		goals[goals.length] = new Game.Goal(name, reqObj, unlocks);
	}
	
	Game.Goal = function(name, reqObj, unlocks) {
		this.name = name;
		this.reqObj = reqObj;
		this.unlocks = unlocks;
		this.unlocks = unlocks;
		return this;
	}
	
	var ticker = ["This is a test", "This is also a test", "Yep more tests!"];
	var tickerIndex = 0;
	
	var ticketReset = function() {
		tickerIndex = 0;
	}
	
	var tickerChange = function() {
		if(tickerIndex >= ticker.length) tickerIndex = 0;
		var whichTick = ticker[tickerIndex];
		$("#ticker").html(whichTick);
		
		tickerIndex++;
		if(tickerIndex >= ticker.length) tickerIndex = 0;
	}
	
	tickerChange();
	
	setInterval(tickerChange, 1000*15);

	var goals = [
		new Game.Goal("Class Clown", {effort: 10, paperwork: 0, yessir: 0}, function() {
			$("#effortdescribe").hide("slow");
			//Below code used to stress test
			/*for(var i = 0;i<ids.length;i++) {
				Game.listPowerUp(ids[i]);
				powerups[ids[i]]++;
			}*/
			
			Game.listPowerUp("acquaintance");
		}),
		new Game.Goal("Hall Monitor", {effort: 100, paperwork: 0, yessir: 0}, function() {
		}),
		new Game.Goal("Class Treasurer", {effort: 500, paperwork: 0, yessir: 0}, function() {
			//Game.listPowerUp("effort2");
		}),
		new Game.Goal("Class Vice President", {effort: 1000, paperwork: 0, yessir: 0}, function() {
			//Game.listPowerUp("effort3");
		}),
		new Game.Goal("Class President", {effort: 2500, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Prom Royalty", {effort: 5000, paperwork: 0, yessir: 0}, function() {
			//Game.listPowerUp("effort4");
		}),
		new Game.Goal("Sports Captain", {effort: 10000, paperwork: 0, yessir: 0}, function() {
			threeCol();
		}),
		new Game.Goal("Fry Cook", {effort: 12500, paperwork: 10, yessir: 0}, function() {
			$("#paperworkdescribe").hide("slow");
		}),
		new Game.Goal("Assistant Assistant Manager", {effort: 17500, paperwork: 100, yessir: 0}, function() {}),
		new Game.Goal("Assistant Manager", {effort: 22500, paperwork: 500, yessir: 0}, function() {}),
		new Game.Goal("General Manager", {effort: 30000, paperwork: 2000, yessir: 0}, function() {}),
		new Game.Goal("District Manager", {effort: 40000, paperwork: 5000, yessir: 0}, function() {}),
		new Game.Goal("PTA Treasurer", {effort: 50000, paperwork: 7500, yessir: 0}, function() {}),
		new Game.Goal("PTA Vice President", {effort: 60000, paperwork: 10000, yessir: 0}, function() {}),
		new Game.Goal("PTA President", {effort: 75000, paperwork: 12500, yessir: 0}, function() {}),
		new Game.Goal("City Council", {effort: 100000, paperwork: 17500, yessir: 0}, function() {}),
		new Game.Goal("Deputy Mayor", {effort: 125000, paperwork: 22500, yessir: 0}, function() {
			fourCol();
		}),
		new Game.Goal("Mayor", {effort: 150000, paperwork: 30000, yessir: 10}, function() {
			$("#yessirdescribe").hide("slow");
		}),
		new Game.Goal("Judge", {effort: 200000, paperwork: 40000, yessir: 100}, function() {}),
		new Game.Goal("Lieutenant Governor", {effort: 250000, paperwork: 50000, yessir: 500}, function() {}),
		new Game.Goal("Governor", {effort: 300000, paperwork: 60000, yessir: 2000}, function() {}),
		new Game.Goal("Senator", {effort: 500000, paperwork: 75000, yessir: 5000}, function() {}),
		new Game.Goal("Vice President", {effort: 750000, paperwork: 100000, yessir: 7500}, function() {}),
		new Game.Goal("President of the United States", {effort: 1000000, paperwork: 125000, yessir: 10000}, function() {}),
		new Game.Goal("Head of United Nations", {effort: 1500000, paperwork: 150000, yessir: 12500}, function() {}),
		new Game.Goal("President of the Western Hemisphere", {effort: 2000000, paperwork: 200000, yessir: 17500}, function() {}),
		new Game.Goal("President of Earth", {effort: 3333360, paperwork: 250000, yessir: 22500}, function() {}),
		new Game.Goal("President of the Solar System", {effort: 5000000, paperwork: 300000, yessir: 30000}, function() {}),
		new Game.Goal("President of the Solar Interstellar Neighborhood", {effort: 7500000, paperwork: 500000, yessir: 40000}, function() {}),
		new Game.Goal("President of the Milky Way Galaxy", {effort: 10000000, paperwork: 750000, yessir: 50000}, function() {}),
		new Game.Goal("President of the Local Galactic Group", {effort: 20000000, paperwork: 1000000, yessir: 60000}, function() {}),
		new Game.Goal("President of the Virgo Supercluster", {effort: 40000000, paperwork: 1500000, yessir: 75000}, function() {}),
		new Game.Goal("President of all Local Superclusters", {effort: 80000000, paperwork: 2000000, yessir: 100000}, function() {}),
		new Game.Goal("President of the Observable Universe", {effort: 160000000, paperwork: 3333360, yessir: 125000}, function() {}),
		new Game.Goal("President of Universe, Observable or Not", {effort: 240000000, paperwork: 5000000, yessir: 150000}, function() {}),
		new Game.Goal("President of The Multiverse", {effort: 320000000, paperwork: 7500000, yessir: 200000}, function() {}),
		new Game.Goal("President of Time", {effort: 500000000, paperwork: 10000000, yessir: 250000}, function() {}),
		new Game.Goal("Vice God", {effort: 750000000, paperwork: 20000000, yessir: 300000}, function() {}),
		new Game.Goal("God", {effort: 1000000000, paperwork: 40000000, yessir: 500000}, function() {})
		
		//Everything below? "DLC". Awww yeah. And no, I won't actually charge for it. DLC will include new powerups that actually take away from other columns.
		/*,
		new Game.Goal("Unlock TVHM GetElected!", {effort: 2000000000, paperwork: 80000000, yessir: 750000}, function() {}),
		new Game.Goal("TVHM Class Clown", {effort: 3000000000, paperwork: 160000000, yessir: 1000000}, function() {}),
		new Game.Goal("TVHM Hall Monitor", {effort: 5000000000, paperwork: 240000000, yessir: 1500000}, function() {}),
		new Game.Goal("TVHM Class Treasurer", {effort: 8000000000, paperwork: 320000000, yessir: 2000000}, function() {}),
		new Game.Goal("TVHM Class Vice President", {effort: 11500000000, paperwork: 500000000, yessir: 3333360}, function() {}),
		new Game.Goal("TVHM Class President", {effort: 15000000000, paperwork: 750000000, yessir: 5000000}, function() {}),
		new Game.Goal("TVHM Prom Royalty", {effort: 25000000000, paperwork: 1000000000, yessir: 7500000}, function() {}),
		new Game.Goal("TVHM Sports Captain", {effort: 50000000000, paperwork: 2000000000, yessir: 10000000}, function() {}),
		new Game.Goal("TVHM Fry Cook", {effort: 75500000000, paperwork: 3000000000, yessir: 20000000}, function() {}),
		new Game.Goal("TVHM Assistant Assistant Manager", {effort: 110000000000, paperwork: 5000000000, yessir: 40000000}, function() {}),
		new Game.Goal("TVHM Assistant Manager", {effort: 200000000000, paperwork: 8000000000, yessir: 80000000}, function() {}),
		new Game.Goal("TVHM General Manager", {effort: 330000000000, paperwork: 11500000000, yessir: 160000000}, function() {}),
		new Game.Goal("TVHM District Manager", {effort: 500000000000, paperwork: 15000000000, yessir: 240000000}, function() {}),
		new Game.Goal("TVHM PTA Treasurer", {effort: 780000000000, paperwork: 25000000000, yessir: 320000000}, function() {}),
		new Game.Goal("TVHM PTA Vice President", {effort: 1000000000000, paperwork: 50000000000, yessir: 500000000}, function() {}),
		new Game.Goal("TVHM PTA President", {effort: 1200000000000, paperwork: 75500000000, yessir: 750000000}, function() {}),
		new Game.Goal("TVHM City Council", {effort: 1600000000000, paperwork: 110000000000, yessir: 1000000000}, function() {}),
		new Game.Goal("TVHM Deputy Mayor", {effort: 2500000000000, paperwork: 200000000000, yessir: 2000000000}, function() {}),
		new Game.Goal("TVHM Mayor", {effort: 3600000000000, paperwork: 330000000000, yessir: 3000000000}, function() {}),
		new Game.Goal("TVHM Judge", {effort: 5000000000000, paperwork: 500000000000, yessir: 5000000000}, function() {}),
		new Game.Goal("TVHM Lieutenant Governor", {effort: 7500000000000, paperwork: 780000000000, yessir: 8000000000}, function() {}),
		new Game.Goal("TVHM Governor", {effort: 10000000000000, paperwork: 1000000000000, yessir: 11500000000}, function() {}),
		new Game.Goal("TVHM Senator", {effort: 20000000000000, paperwork: 1200000000000, yessir: 15000000000}, function() {}),
		new Game.Goal("TVHM Vice President", {effort: 30000000000000, paperwork: 1600000000000, yessir: 25000000000}, function() {}),
		new Game.Goal("TVHM President of the United States", {effort: 40000000000000, paperwork: 2500000000000, yessir: 50000000000}, function() {}),
		new Game.Goal("TVHM Head of United Nations", {effort: 50000000000000, paperwork: 3600000000000, yessir: 75500000000}, function() {}),
		new Game.Goal("TVHM President of the Western Hemisphere", {effort: 60000000000000, paperwork: 5000000000000, yessir: 110000000000}, function() {}),
		new Game.Goal("TVHM President of Earth", {effort: 70000000000000, paperwork: 7500000000000, yessir: 200000000000}, function() {}),
		new Game.Goal("TVHM President of the Solar System", {effort: 80000000000000, paperwork: 10000000000000, yessir: 330000000000}, function() {}),
		new Game.Goal("TVHM President of the Solar Interstellar Neighborhood", {effort: 90000000000000, paperwork: 20000000000000, yessir: 500000000000}, function() {}),
		new Game.Goal("TVHM President of the Milky Way Galaxy", {effort: 100000000000000, paperwork: 30000000000000, yessir: 780000000000}, function() {}),
		new Game.Goal("TVHM President of the Local Galactic Group", {effort: 200000000000000, paperwork: 40000000000000, yessir: 1000000000000}, function() {}),
		new Game.Goal("TVHM President of the Virgo Supercluster", {effort: 300000000000000, paperwork: 50000000000000, yessir: 1200000000000}, function() {}),
		new Game.Goal("TVHM President of all Local Superclusters", {effort: 400000000000000, paperwork: 60000000000000, yessir: 1600000000000}, function() {}),
		new Game.Goal("TVHM President of the Observable Universe", {effort: 500000000000000, paperwork: 70000000000000, yessir: 2500000000000}, function() {}),
		new Game.Goal("TVHM President of Universe, Observable or Not", {effort: 600000000000000, paperwork: 80000000000000, yessir: 3600000000000}, function() {}),
		new Game.Goal("TVHM President of The Multiverse", {effort: 700000000000000, paperwork: 90000000000000, yessir: 5000000000000}, function() {}),
		new Game.Goal("TVHM President of Time", {effort: 800000000000000, paperwork: 100000000000000, yessir: 7500000000000}, function() {}),
		new Game.Goal("TVHM Vice God", {effort: 900000000000000, paperwork: 200000000000000, yessir: 10000000000000}, function() {}),
		new Game.Goal("TVHM God", {effort: 1000000000000000, paperwork: 300000000000000, yessir: 20000000000000}, function() {}),
		new Game.Goal("Game Over", {effort: 5000000000000000, paperwork: 5000000000000000, yessir: 5000000000000000}, function() {}),
		new Game.Goal("…Or Is It?", {effort: 1, paperwork: 1, yessir: 1}, function() {})*/
	];
	
	
	//Below code used to stress test.
	/*
	var ids = [];
	for(var i = 0;i<200;i++) {
		var myID = randString(8);
		addPowerUp(myID, {effort: 1, paperwork: 0, yessir: 0}, "Stuff", "Stuff", "effortPowerUp", function(num) {
			return {
				"effort": 1*num,
				"paperwork": 0*num,
				"yessir": 0*num
			}
		}, false);
		ids[ids.length] = myID;
	}*/
	
	/* + parseFloat(9007199254740992000)*/
	
	/*
	addPowerUp("acquaintance", {effort: 15, paperwork: 0, yessir: 0}, "Acquaintance", "+0.1 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort": (0.1 + (flags.get("strongerAcquaintanceBond") === true ? 2 : 0))*num,
			"paperwork": 0*num,
			"yessir": 0*num
		};
	}, false);
	*/
	/*
	addPowerUp("friend", {effort: 100, paperwork: 0, yessir: 0}, "Friend", "+0.5 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	0.5*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("effort3", {effort: 500, paperwork: 0, yessir: 0}, "Try Harder", "+5 Effort Per Click", "effortPowerUp", function(num) {
		flags.activate("fiveEffortPerClick");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("fiveEffortPerClick");});
	
	addPowerUp("bro", {effort: 1000, paperwork: 0, yessir: 0}, "Bro", "+3 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	3*num,
			"paperwork":	0*num,
			"yessir":		0*num
		};
		
	}, false);
	
	addPowerUp("effort5", {effort: 5000, paperwork: 0, yessir: 0}, "Stronger Acquaintance Bond", "Each Acquaintaince Gains +2 Effort", "effortPowerUp", function(num) {
		flags.activate("strongerAcquaintanceBond");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("strongerAcquaintanceBond")});
	
	addPowerUp("so", {effort: 50000, paperwork: 0, yessir: 0}, "Significant Other", "+100 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	100*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("lawyer", {effort: 150000, paperwork: 0, yessir: 0}, "Personal Lawyer", "+500 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	500*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("grindstone", {effort: 250000, paperwork: 0, yessir: 0}, "Nose To The Grindstone", "+100 Effort Per Click", "effortPowerUp", function(num) {
		flags.activate("noseToTheGrindstone")
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("noseToTheGrindstone")});
	
	addPowerUp("uberlawyer", {effort: 500000, paperwork: 0, yessir: 0}, "Über Lawyer", "+1000 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	1000*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("superso", {effort: 1000000, paperwork: 0, yessir: 0}, "Super Significant Other", "+10000 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	10000*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	*/
	
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", "+0.1 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort": (0.1 + (flags.get("perfectStrangers") === true ? 2 : 0) + (flags.get("perfectStrangers2") === true ? 50 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("perfectStrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", "+2 Effort For Every Stranger", "effortPowerUp", function(num) {
		flags.activate("perfectStrangers");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("perfectStrangers");});
	
	addPowerUp("perfectStrangers2", {effort: 450000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", "+50 Effort For Every Stranger", "effortPowerUp", function(num) {
		flags.activate("perfectStrangers2");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("perfectStrangers2");});
	
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", "+0.5 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(0.5 + (flags.get("gettingtoknowyou") === true ? 5 : 0)+ (flags.get("gettingtoknowallaboutyou") === true ? 70 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("gettingtoknowyou", {effort: 24000, paperwork: 0, yessir: 0}, "Getting To Know You", "+5 Effort For Every Acquaintance", "effortPowerUp", function(num) {
		flags.activate("gettingtoknowyou");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("gettingtoknowyou");});
	
	addPowerUp("gettingtoknowallaboutyou", {effort: 620000, paperwork: 0, yessir: 0}, "Getting To Know All About You", "+70 Effort For Every Acquaintance", "effortPowerUp", function(num) {
		flags.activate("gettingtoknowallaboutyou");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("gettingtoknowallaboutyou");});
	
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", "+3 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(3 + (flags.get("joey") === true ? 10 : 0) + (flags.get("chandler") === true ? 115 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("joey", {effort: 12000, paperwork: 0, yessir: 0}, "Joey", "+10 Effort For Every Friend", "effortPowerUp", function(num) {
		flags.activate("joey");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("joey");});
	
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", "+115 Effort For Every Friend", "effortPowerUp", function(num) {
		flags.activate("chandler");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("chandler");});
	
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", "+50 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(50 + (flags.get("budlight") === true ? 115 : 0) + (flags.get("collar") === true ? 420 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", "+115 Effort For Every Bro", "effortPowerUp", function(num) {
		flags.activate("budlight");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("budlight");});
	
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", "+420 Effort For Every Bro", "effortPowerUp", function(num) {
		flags.activate("collar");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("collar");});
	
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", "+300 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(300 + (flags.get("pizza") === true ? 500 : 0) + (flags.get("hideabody") === true ? 900 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza Party", "+500 Effort For Every Best Friend", "effortPowerUp", function(num) {
		flags.activate("pizza");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("pizza");});
	
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", "+900 Effort For Every Best Friend", "effortPowerUp", function(num) {
		flags.activate("hideabody");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("hideabody");});
	
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", "+1111 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(1111 + (flags.get("idkmbffj") === true ? 1234 : 0) + (flags.get("instagram") === true ? 5000 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);

	addPowerUp("idkmbffj", {effort: 720000, paperwork: 42000, yessir: 0}, "IDK, my BFF Jill?", "+1234 Effort For Every BFF", "effortPowerUp", function(num) {
		flags.activate("idkmbffj");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("idkmbffj");});

	addPowerUp("instagram", {effort: 3141592, paperwork: 118000, yessir: 0}, "Instagram! <3", "+5000 Effort For Every BFF", "effortPowerUp", function(num) {
		flags.activate("instagram");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("instagram");});
	
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", "+9999 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(9999 + (flags.get("dunndunn") === true ? 25000 : 0) + (flags.get("bettercallsaul") === true ? 50000 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("dunndunn", {effort: 720000, paperwork: 42000, yessir: 0}, "DUNN DUNN!", "+25000 Effort For Every Personal Lawyer", "effortPowerUp", function(num) {
		flags.activate("dunndunn");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("dunndunn");});

	addPowerUp("bettercallsaul", {effort: 3141592, paperwork: 118000, yessir: 0}, "Better Call Saul!", "+50000 Effort For Every Personal Lawyer", "effortPowerUp", function(num) {
		flags.activate("bettercallsaul");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("bettercallsaul");});

	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", "+70000 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	(70000 + (flags.get("cohabitate") === true ? 150000 : 0) + (flags.get("cosign") === true ? 300000 : 0))*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);

	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", "+150000 Effort For Every Significant Other", "effortPowerUp", function(num) {
		flags.activate("cohabitate");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("cohabitate");});

	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House", "+300000 Effort For Every Significant Other", "effortPowerUp", function(num) {
		flags.activate("cosign");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("cosign");});
	
	addPowerUp("pencil", {effort: 0, paperwork: 15, yessir: 0}, "Pencil", "+0.1 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort": 		0*num,
			"paperwork":	(0.1 + (flags.get("sharpenedPencil") === true ? 2 : 0) + (flags.get("mechanicalpencil") === true ? 50 : 0))*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("sharpenedPencil", {effort: 500, paperwork: 0, yessir: 0}, "Sharpened Pencil", "+2 Paperwork For Every Pencil", "paperworkPowerUp", function(num) {
		flags.activate("sharpenedPencil");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("sharpenedPencil");});
	
	addPowerUp("mechanicalpencil", {effort: 450000, paperwork: 0, yessir: 0}, "Mechanical Pencil", "+50 Paperwork For Every Pencil", "paperworkPowerUp", function(num) {
		flags.activate("mechanicalpencil");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("mechanicalpencil");});
	
	addPowerUp("pen", {effort: 0, paperwork: 100, yessir: 0}, "Pen", "+0.5 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	(0.5 + (flags.get("moreink") === true ? 5 : 0)+ (flags.get("cyberpen") === true ? 70 : 0))*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("moreink", {effort: 0, paperwork: 500, yessir: 0}, "MORE. INK.", "+5 Paperwork For Every Pen", "paperworkPowerUp", function(num) {
		flags.activate("moreink");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("moreink");});
	
	addPowerUp("cyberpen", {effort: 0, paperwork: 450000, yessir: 0}, "Cybernetic Pen", "+70 Paperwork For Every Pen", "paperworkPowerUp", function(num) {
		flags.activate("cyberpen");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("cyberpen");});
	
	addPowerUp("typewriter", {effort: 0, paperwork: 900, yessir: 0}, "Typewriter", "+3 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	(3 + (flags.get("wordprocessor") === true ? 10 : 0) + (flags.get("talktotext") === true ? 115 : 0))*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("wordprocessor", {effort: 0, paperwork: 12000, yessir: 0}, "Word Processor", "+5 Paperwork For Every Pen", "paperworkPowerUp", function(num) {
		flags.activate("wordprocessor");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("wordprocessor");});
	
	addPowerUp("talktotext", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", "+70 Paperwork For Every Pen", "paperworkPowerUp", function(num) {
		flags.activate("talktotext");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("talktotext");});
	
	addPowerUp("printer", {effort: 0, paperwork: 25437, yessir: 0}, "Printer", "+50 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	(50 + (flags.get("budlight") === true ? 115 : 0) + (flags.get("collar") === true ? 420 : 0))*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("threeinone", {effort: 0, paperwork: 920000, yessir: 0}, "Bud Light", "+115 Effort For Every Printer", "effortPowerUp", function(num) {
		flags.activate("budlight");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("budlight");});
	
	addPowerUp("collar", {effort: 0, paperwork: 3200000, yessir: 0}, "Popped Collar", "+420 Effort For Every Printer", "effortPowerUp", function(num) {
		flags.activate("collar");
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, true, function() {flags.set("collar");});
	
	addPowerUp("scanner", {effort: 540000, paperwork: 150000, yessir: 0}, "Scanner", "+300 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "An email address (Perhaps AOL? Perhaps CompuServ?)", "+1111 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with the same handwriting", "+9999 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("robots", {effort: 512000000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", "+70000 Paperwork Per Second", "paperworkPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", "+0.1 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", "+0.5 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", "+3 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", "+50 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", "+300 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("wall", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"Tear down this wall!\"", "+1111 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", "+9999 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	addPowerUp("handseverywhere", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", "+70000 Yes Sir Per Second", "yessirPowerUp", function(num) {
		return {
			"effort":	0*num,
			"paperwork":	0*num,
			"yessir":		0*num
		}
	}, false);
	
	Game.listPowerUp = function(id) {
		if($("#" + id).length === 0) {
			var func = powerupsfuncs[id];
			var target = $("#" + func["section"]);
			var li = $("<li>");
			li.attr("id", id);
			li.attr("title", func["description"]);
			li.html(func["label"]);
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
			var sell = $("<button>Sell</button>");
			sell.attr("myPow", id);
			li.append(sell);
			sell.click(function(e) {
				e.stopPropagation();
				var id = $(this).attr("myPow");
				if(powerups[id] > 0) {
					powerups[id]--;
					var effortVal = Game.compInt(func["cost"].effort, powerups[id]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[id]), yessirVal = Game.compInt(func["cost"].yessir, powerups[id]);
					efforttally += (effortVal * 0.5);
					paperworktally += (paperworkVal * 0.5);
					yessirtally  += (yessirVal * 0.5);
					var q = $("#" + id + "_q");
					var html = "";
					html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id])) : "") + " ";
					html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id])) : "") + " ";
					html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id])) : "");
					
					q.html(html);
					var pre = $("#" + id + "_pre");
					pre.html("Total: " + powerups[id]);
					if(func["sell"] !== null) func["sell"]();
				}
			});
			/*
			sell.appendTo($("body"));
			sell.css("z-index", "50");
			sell.css("position", "absolute");
			sell.hide();
			sell.css(li.offset());
			$(li, sell).hover(function() {
				sell.show();
			}, function() {
				sell.hide();
			});
			*/
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
		
		$("#saved").fadeIn(1000).delay(5000).fadeOut(1000);
	}
	
	Game.Reset = function() {
		for(var i in powerups) {
			powerups[i] = 0;
		}
		efforttally = 0;
		paperworktally = 0;
		yessirtally = 0;
		currentGoalIndex = 0;
		flags.resetAll();
		$("#effortdescribe").show();
		$("#paperworkdescribe").show();
		$("#yessirdescribe").show();
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
		for(var i in powerups) {
			if($("#" + i).length) {
				var func = powerupsfuncs[i];
				var effortVal = Game.compInt(func["cost"].effort, powerups[i]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[i]), yessirVal = Game.compInt(func["cost"].yessir, powerups[i]);
				if(efforttally >= effortVal &&
					paperworktally >= paperworkVal &&
					yessirtally >= yessirVal) {
						if(func["onetime"] === true && powerups[i] > 0) $("#" + i).addClass("disabled");
						else $("#" + i).removeClass("disabled");
				}
				else $("#" + i).addClass("disabled");
			}
		}
		$("#efforttally").html(numberWithCommas((Math.floor(efforttally * 10) / 10).toFixed(1)) + " Effort");
		$("#paperworktally").html(numberWithCommas((Math.floor(paperworktally * 10) / 10).toFixed(1)) + " Paperwork");
		$("#yessirtally").html(numberWithCommas((Math.floor(yessirtally * 10) / 10).toFixed(1)) + " Yes, Sir!");
	}
	
	Game.Loop = function() {
		Game.Update();
		missedFrames += (new Date().getTime() - lastRun) - (1000/fps);
		missedFrames = Math.min(missedFrames, 1000*5);	//admittedly, I like this logic from Cookie Clicker; catch up on up to 5 seconds worth of frame data if there is latency.
		while(missedFrames > 0) {
			Game.Update();
			missedFrames -= 1000/fps;
		}
		Game.Draw();
		//YAY THE FRAME IS DONE! Let's make sure we're staying close to our FPS goal
		var delta = (new Date().getTime() - lastRun) / 1000;
		lastRun = new Date().getTime();
		var currFPS = ~~(1/delta);
		$("#fps").html(currFPS + " fps");
		setTimeout(Game.Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
		currentGoalIndex = 50000;			//BETA THING PLEASE IGNORE
		
	}
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Game.Load();
	Game.updatePastGoals();
	Game.updateCurrentGoals();
	
	setInterval(Game.Save, 1000*60);	//Save every 60 seconds
	
	/*
	var lastEff = 0;
	
	setInterval(function() {
		console.log("Last: " + lastEff + " Current: " + efforttally + " Diff: " + (efforttally - lastEff));
		lastEff = efforttally;
	}, 1000);*/
	
	
	//Last but not least, let's get some shit in place to track FPS, JUUUUST in case things start running slow.
	var lastRun = new Date().getTime();
	Game.Loop();
}

Game.loadList = {};

Game.addLoader = function(id) {
	Game.loadList[id] = false;
}

Game.finishLoader = function(id) {
	Game.loadList[id] = true;
}

Game.checkLoad = function() {
	var loaded = true;
	var val = 0;
	var len = 0;
	for(var i in Game.loadList) {
		len++;
		if(Game.loadList[i] === false) loaded = false;
		else val++;
	}
	val = (val / len) * 100;
	document.getElementById("progress").value = val;
	$("#progressPercent").html(val.toFixed(1));
	if(loaded === false) setTimeout(Game.checkLoad, 1000/fps);
	else Game.Initialize();
}

Game.preLoad = function() {
	//Function care of http://diveintohtml5.info/storage.html
	function supports_html5_storage() {
		try {
			return ('localStorage' in window && window['localStorage'] !== null);
		} catch (e) {
			return false;
		}
	}
	
	var canvas = document.createElement('canvas');
	
	if(!supports_html5_storage() || !canvas.getContext) {
		$("#nosupport").html("We're sorry, but your browser does not support GetElected!. Please consider Google Chrome or Mozilla Firefox for all of your browsing needs.");
		return;
	}
	Game.addLoader("paperworker");
	var ctx    = canvas.getContext('2d');

	function todo(context, text, fontSize, fontColor) {
		var max_width  = 600;
		var fontSize   =  12;
		var lines      =  new Array();
		var width = 0, i, j;
		var result;
		var color = fontColor || "white";
		var font = '22px "Special Elite", cursive';
		// Font and size is required for context.measureText()
		 context.font = font

		
		// Start calculation
		while ( text.length ) {
			for( i=text.length; context.measureText(text.substr(0,i)).width > max_width; i-- );
		
			result = text.substr(0,i);
		
			if ( i !== text.length )
				for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
			
			lines.push( result.substr(0, j|| result.length) );
			width = Math.max( width, context.measureText(lines[ lines.length-1 ]).width );
			text  = text.substr( lines[ lines.length-1 ].length, text.length );
		}
		
		
		// Calculate canvas size, add margin
		context.canvas.width  = 14 + width;
		context.canvas.height =  8 + ( fontSize + 5 ) * lines.length;
		context.font   = font;

		// Render
		context.fillStyle = color;
		for ( i=0, j=lines.length; i<j; ++i ) {
			context.fillText( lines[i], 8, 5 + fontSize + (fontSize+5) * i );
		}
		
		var x = getRandomInt(0, context.canvas.width - 200);
		var y = getRandomInt(0, context.canvas.height - 200);
		var data = context.getImageData(x, y, 200, 200);
		var canv2 = document.createElement("canvas");
		canv2.width = 200;
		canv2.height = 200;
		var context2 = canv2.getContext("2d");
		context2.putImageData(data, 0, 0);
		
		var img = canv2.toDataURL();
		document.getElementById("paperworker").style.backgroundImage = "url(" + img + ")";
		Game.finishLoader("paperworker");
	}
	
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'http://fonts.googleapis.com/css?family=Special+Elite';
	document.getElementsByTagName('head')[0].appendChild(link);

	// Trick from http://stackoverflow.com/questions/2635814/
	var image = new Image;
	image.src = link.href;
	image.onerror = function() {
		setTimeout(function() {
			todo(ctx, paperwork, 12, "black");
		}, 1000);
	}
	
	/*
	Game.addLoader("yessirup");
	var img = new Image;
	img.src = "images/up.png";
	img.onload = function() {
		Game.finishLoader("yessirup");
	}
	
	Game.addLoader("yessirdown");
	var img2 = new Image;
	img2.src = "images/down.png";
	img2.onload = function() {
		Game.finishLoader("yessirdown");
	}
	*/
	
	Game.addLoader("yessir");
	var img = new Image;
	img.src = "images/yessir.png";
	img.onload = function() {
		Game.finishLoader("yessir");
	}
	Game.checkLoad();
}