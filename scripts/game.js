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
	//$("#paperworker").html(paperwork);
	//$("#paperworker").css("clip", "rect(0px, 200px, 200px, 0px)");
	/*
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'http://fonts.googleapis.com/css?family=Special+Elite';
	document.getElementsByTagName('head')[0].appendChild(link);
	var image = new Image();
	image.src = link;
	image.onerror = function() {
	
		var canvas = document.getElementById("paperworkBuffer");
		var context = canvas.getContext("2d");
		var maxWidth = 500;
		var lineHeight = 25;
		var x = (canvas.width - maxWidth) / 2;
		var y = 60;


		context.font = '50px "Special Elite" cursive';
		context.fillStyle = '#333';

		wrapText(context, paperwork, x, y, maxWidth, lineHeight);
	}*/
	var efforttally = paperworktally = yessirtally = 0;
	var currentGoalIndex = 0;
	var scrollerBase = 10;	//An arbitrary number; this is where the (hidden) scroll bar will lock itself on scroll for the Yes Sir section.
	var scrollStatus = "";
	var fps = 30;
	var efforttoggle = 1;
	var effortFlag1 = 0;
	var interest = 0.35;	//Be sure to tip your costs, and drive home safe!
	var missedFrames = 0;	//How many frames are missed due to latency / the window not being in focus
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
	
	$("#efforter").mousedown(function(e) {
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 6}, "fast")
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: '0px 9px 0px rgba(219,31,5,1)', top: 0}, "fast")
	});
	
	$("#ticker").css("opacity", 0).slideDown(2000).animate({opacity: 1}, {
		queue: false, duration: 2000
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

	var goals = [
		new Game.Goal("Class Clown", {effort: 10, paperwork: 0, yessir: 0}, function() {
			$("#effortdescribe").hide("slow");
			Game.listPowerUp("acquaintance");
		}),
		new Game.Goal("Hall Monitor", {effort: 100, paperwork: 0, yessir: 0}, function() {
		}),
		new Game.Goal("Class Treasurer", {effort: 500, paperwork: 0, yessir: 0}, function() {
			Game.listPowerUp("effort2");
		}),
		new Game.Goal("Class Vice President", {effort: 1000, paperwork: 0, yessir: 0}, function() {
			Game.listPowerUp("effort3");
		}),
		new Game.Goal("Class President", {effort: 2500, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Prom Royalty", {effort: 5000, paperwork: 0, yessir: 0}, function() {
			Game.listPowerUp("effort4");
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
		new Game.Goal("Mayor", {effort: 150000, paperwork: 30000, yessir: 10}, function() {}),
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
		//Everything below? "DLC". Awww yeah.
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
	
	addPowerUp("acquaintance", {effort: 20, paperwork: 0, yessir: 0}, "Acquaintance", "+0.1 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort": 0.1*num,
			"paperwork": 0*num,
			"yessir": 0*num
		};
	}, false);
	
	addPowerUp("effort2", {effort: 100, paperwork: 0, yessir: 0}, "Friend", "+0.5 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	0.5*num,
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
	
	addPowerUp("effort4", {effort: 1000, paperwork: 0, yessir: 0}, "Your Bro, Yo!", "+3 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	3*num,
			"paperwork":	0*num,
			"yessir":		0*num
		};
		
	}, false);
	
	addPowerUp("effort5", {effort: 5000, paperwork: 0, yessir: 0}, "Best Friend", "+10 Effort Per Second", "effortPowerUp", function(num) {
		return {
			"effort":	10*num,
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
		effortFlag1 = 0;
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
		currentGoalIndex = 50;
		setTimeout(Game.Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
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