var Game = {};

Game.version = "Version ALPHA";

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
	var currentGoalIndex = 0;
	var scrollerBase = 10;	//An arbitrary number; this is where the (hidden) scroll bar will lock itself on scroll for the Yes Sir section.
	var scrollStatus = "";
	var fps = 30;
	var efforttoggle = 1;

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
		if(efforttally <= 0) {
			efforttally = 0;
		}
	}
	Game.incrementPaperwork = function(num) {
		paperworktally += num;
		if(paperworktally <= 0) {
			paperworktally = 0;
		}
	}
	Game.incrementYessir = function(num) {
		yessirtally += num;
		if(yessirtally <= 0) {
			yessirtally = 0;
		}
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
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
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
		html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
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
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
			q.html(html);
			li.html(currGoal.name);
			li.append(q);
			/*li.click(function(goal) {
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
			*/
		}
	}
	
	$("#yessirer").scrollTop(scrollerBase);
	$("#efforter").click(function(e) {
		e.preventDefault();
		var howmuch = 1 + flags.flag("fiveEffortPerClick") + flags.flag("noseToTheGrindstone");
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
			twoCol();
		}
	});
	
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
	
	var ticker = ["Eventually, something clever goes here.", "Something witty goes here, like, all British-humour-like.", "Man, I hope this is funny."];
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
		new Game.Goal("Class Clown", {effort: 75, paperwork: 0, yessir: 0}, function() {$("#effortdescribe").hide("slow");}),
		new Game.Goal("Hall Monitor", {effort: 150, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class Treasurer", {effort: 300, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class Vice President", {effort: 600, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class President", {effort: 1800, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Prom Royalty", {effort: 5400, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Sports Captain", {effort: 16200, paperwork: 0, yessir: 0}, function() {threeCol();}),
		new Game.Goal("Fry Cook", {effort: 32400, paperwork: 75, yessir: 0}, function() {$("#paperworkdescribe").hide("slow");}),
		new Game.Goal("Assistant Assistant Manager", {effort: 97200, paperwork: 150, yessir: 0}, function() {}),
		new Game.Goal("Assistant Manager", {effort: 291600, paperwork: 300, yessir: 0}, function() {}),
		new Game.Goal("General Manager", {effort: 583200, paperwork: 600, yessir: 0}, function() {}),
		new Game.Goal("District Manager", {effort: 1749600, paperwork: 1800, yessir: 0}, function() {}),
		new Game.Goal("PTA Treasurer", {effort: 3499200, paperwork: 5400, yessir: 0}, function() {}),
		new Game.Goal("PTA Vice President", {effort: 13996800, paperwork: 16200, yessir: 0}, function() {}),
		new Game.Goal("PTA President", {effort: 27993600, paperwork: 32400, yessir: 0}, function() {}),
		new Game.Goal("City Council", {effort: 111974400, paperwork: 97200, yessir: 0}, function() {}),
		new Game.Goal("Deputy Mayor", {effort: 335923200, paperwork: 291600, yessir: 0}, function() {fourCol();}),
		new Game.Goal("Mayor", {effort: 671846400, paperwork: 583200, yessir: 75}, function() {$("#yessirdescribe").hide("slow");}),
		new Game.Goal("Judge", {effort: 1343692800, paperwork: 1749600, yessir: 150}, function() {}),
		new Game.Goal("Lieutenant Governor", {effort: 2687385600, paperwork: 3499200, yessir: 300}, function() {}),
		new Game.Goal("Governor", {effort: 10749542400, paperwork: 13996800, yessir: 600}, function() {}),
		new Game.Goal("Senator", {effort: 21499084800, paperwork: 27993600, yessir: 1800}, function() {}),
		new Game.Goal("Vice President", {effort: 85996339200, paperwork: 111974400, yessir: 5400}, function() {}),
		new Game.Goal("President of the United States", {effort: 343985356800, paperwork: 335923200, yessir: 16200}, function() {}),
		new Game.Goal("Head of United Nations", {effort: 1031956070400, paperwork: 671846400, yessir: 32400}, function() {}),
		new Game.Goal("President of the Western Hemisphere", {effort: 2063912140800, paperwork: 1343692800, yessir: 97200}, function() {}),
		new Game.Goal("President of Earth", {effort: 6191736422400, paperwork: 2687385600, yessir: 291600}, function() {}),
		new Game.Goal("President of the Solar System", {effort: 18575209267200, paperwork: 10749542400, yessir: 583200}, function() {}),
		new Game.Goal("President of the Solar Interstellar Neighborhood", {effort: 37150418534400, paperwork: 21499084800, yessir: 1749600}, function() {}),
		new Game.Goal("President of the Milky Way Galaxy", {effort: 74300837068800, paperwork: 85996339200, yessir: 3499200}, function() {}),
		new Game.Goal("President of the Local Galactic Group", {effort: 148601674137600, paperwork: 343985356800, yessir: 13996800}, function() {}),
		new Game.Goal("President of the Virgo Supercluster", {effort: 297203348275200, paperwork: 1031956070400, yessir: 27993600}, function() {}),
		new Game.Goal("President of all Local Superclusters", {effort: 1188813393100800, paperwork: 2063912140800, yessir: 111974400}, function() {}),
		new Game.Goal("President of the Observable Universe", {effort: 2377626786201600, paperwork: 6191736422400, yessir: 335923200}, function() {}),
		new Game.Goal("President of Universe, Observable or Not", {effort: 9510507144806400, paperwork: 18575209267200, yessir: 671846400}, function() {}),
		new Game.Goal("President of The Multiverse", {effort: 38042028579225600, paperwork: 37150418534400, yessir: 1343692800}, function() {}),
		new Game.Goal("President of Time", {effort: 76084057158451200, paperwork: 74300837068800, yessir: 2687385600}, function() {}),
		new Game.Goal("Vice God", {effort: 152168114316902400, paperwork: 148601674137600, yessir: 10749542400}, function() {}),
		new Game.Goal("God", {effort: 456504342950707200, paperwork: 297203348275200, yessir: 21499084800}, function() {}),
		new Game.Goal("Ultra God", {effort: 1369513028852121600, paperwork: 1188813393100800, yessir: 85996339200}, function() {})
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
		onetime:		If this is null, do nothing. Otherwise, it's a function that runs just once.
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
	
	/*Primary Power Ups!*/
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", "+0.1 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", "+0.5 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", "+3 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", "+50 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", "+300 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", "+111 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (111 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", "+9999 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", "+70000 Effort Per Second", "effortPowerUp", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", "+0.1 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false);
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", "+0.5 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false);
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", "+3 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false);
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", "+50 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false);
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", "+300 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false);
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", "+111 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (111 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false);
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", "+9999 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false);
	addPowerUp("robots", {effort: 512000000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", "+70000 Paperwork Per Second", "paperworkPowerUp", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false);
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", "+0.1 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false);
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", "+0.5 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false);
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", "+3 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false);
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", "+50 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false);
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", "+300 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false);
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", "+111 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (111 + flags.flag("gore") + flags.flag("clinton")) * num};}, false);
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", "+9999 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false);
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", "+70000 Yes Sir Per Second", "yessirPowerUp", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false);
	
	/*Secondary Power Ups!*/
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", "+2 Effort For Every Stranger", "effortPowerUp", function(num) { flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", "+50 Effort For Every Stranger", "effortPowerUp", function(num) { flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", "+5 Effort For Every Acquaintance", "effortPowerUp", function(num) { flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 620000, paperwork: 0, yessir: 0}, "Getting To Know All About You", "+70 Effort For Every Acquaintance", "effortPowerUp", function(num) { flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", "+10 Effort For Every Friend", "effortPowerUp", function(num) { flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", "+115 Effort For Every Friend", "effortPowerUp", function(num) { flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", "+115 Effort For Every Bro", "effortPowerUp", function(num) { flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", "+420 Effort For Every Bro", "effortPowerUp", function(num) { flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", "+500 Effort For Every Best Friend", "effortPowerUp", function(num) { flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", "+900 Effort For Every Best Friend", "effortPowerUp", function(num) { flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", "+1234 Effort For Every BFF", "effortPowerUp", function(num) { flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", "+5000 Effort For Every BFF", "effortPowerUp", function(num) { flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", "+25000 Effort For Every Personal Lawyer", "effortPowerUp", function(num) { flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", "+50000 Effort For Every Personal Lawyer", "effortPowerUp", function(num) { flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", "+150000 Effort For Every Significant Other", "effortPowerUp", function(num) { flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", "+300000 Effort For Every Significant Other", "effortPowerUp", function(num) { flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", "+2 Paperwork For Every Staples", "paperworkPowerUp", function(num) { flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", "+50 Paperwork For Every Staples", "paperworkPowerUp", function(num) { flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", "+5 Paperwork For Every Pencil", "paperworkPowerUp", function(num) { flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 620000, yessir: 0}, "Mechanical Pencil", "+70 Paperwork For Every Pencil", "paperworkPowerUp", function(num) { flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", "+10 Paperwork For Every Pen", "paperworkPowerUp", function(num) { flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", "+115 Paperwork For Every Pen", "paperworkPowerUp", function(num) { flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", "+115 Paperwork For Every Typewriter", "paperworkPowerUp", function(num) { flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", "+420 Paperwork For Every Typewriter", "paperworkPowerUp", function(num) { flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", "+500 Paperwork For Every Printer", "paperworkPowerUp", function(num) { flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", "+900 Paperwork For Every Printer", "paperworkPowerUp", function(num) { flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", "+1234 Paperwork For Every Email Address", "paperworkPowerUp", function(num) { flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", "+5000 Paperwork For Every Email Address", "paperworkPowerUp", function(num) { flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", "+25000 Paperwork For Every Flock of orphans with your handwriting", "paperworkPowerUp", function(num) { flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", "+50000 Paperwork For Every Flock of orphans with your handwriting", "paperworkPowerUp", function(num) { flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", "+150000 Paperwork For Every Robots. God damned robots.", "paperworkPowerUp", function(num) { flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", "+300000 Paperwork For Every Robots. God damned robots.", "paperworkPowerUp", function(num) { flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"", "yessirPowerUp", function(num) { flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"", "yessirPowerUp", function(num) { flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"", "yessirPowerUp", function(num) { flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 620000}, "Harry S. Truman", "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"", "yessirPowerUp", function(num) { flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", "+10 Yes Sir For Every \"I Like Ike!\"", "yessirPowerUp", function(num) { flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", "+115 Yes Sir For Every \"I Like Ike!\"", "yessirPowerUp", function(num) { flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", "+115 Yes Sir For Every \"A Time For Greatness\"", "yessirPowerUp", function(num) { flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", "+420 Yes Sir For Every \"A Time For Greatness\"", "yessirPowerUp", function(num) { flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 0, paperwork: 0, yessir: 720000}, "Dan Quayle", "+500 Yes Sir For Every \"No New Taxes\"", "yessirPowerUp", function(num) { flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 0, paperwork: 0, yessir: 3200000}, "George H. W. Bush", "+900 Yes Sir For Every \"No New Taxes\"", "yessirPowerUp", function(num) { flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 0, paperwork: 0, yessir: 1120000}, "Al Gore", "+1234 Yes Sir For Every \"It's Time To Change America\"", "yessirPowerUp", function(num) { flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 0, paperwork: 0, yessir: 9876543}, "Bill Clinton", "+5000 Yes Sir For Every \"It's Time To Change America\"", "yessirPowerUp", function(num) { flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 0, paperwork: 0, yessir: 4810000}, "Joe Biden", "+25000 Yes Sir For Every \"Change\"", "yessirPowerUp", function(num) { flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 0, paperwork: 0, yessir: 10240000}, "Barack Obama", "+50000 Yes Sir For Every \"Change\"", "yessirPowerUp", function(num) { flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 0, paperwork: 0, yessir: 21345589}, "More Lube", "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"", "yessirPowerUp", function(num) { flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 0, paperwork: 0, yessir: 144233377}, "A \"Chicken\" In Every \"Pot\"", "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"", "yessirPowerUp", function(num) { flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	
	var flags = {
		list: {},
		resetAll: function() {
			for(var i in this.list) {
				this.list[i] = 0;
			}
		},
		flag:	function(id, val) {
			if(val && val !== "") {
				this.list[id] = val;
			}
			return this.list[id] || 0;
		}
	}
	
	
	
	Game.listPowerUp = function(id) {
		if($("#" + id).length === 0) {
			var func = powerupsfuncs[id];
			var target = $("#" + func["section"]);
			var li = $("<li>");
			li.attr("id", id);
			//li.attr("title", func["description"]);
			li.html(func["label"]);
			target.append(li);
			var q = $("<q>");
			var html = "";
			html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
			html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
			html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
			q.html(html);
			q.attr("id", id + "_q");
			li.append(q);
			var pre = $("<pre>");
			pre.attr("id", id + "_pre");
			pre.html("" + powerups[id]);
			li.append(pre);
			/*
			You know what? As of 11/14/13, 9:54PM:
			
			I don't like selling.
			
			Seems to be a moot point, if you ask me. And if you're asking me while reading comments, then STOP PROJECTING YOUR THOUGHTS INTO MY HEAD
			
			var sell = $("<a href=\"javascript:void(0)\">Sell</a>");
			sell.attr("myPow", id);
			sell.css({"position": "absolute", "top": "3px", "right": "3px"});
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
					html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
					html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
					html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
					
					q.html(html);
					var pre = $("#" + id + "_pre");
					pre.html("Total: " + powerups[id]);
					if(func["sell"] !== null) func["sell"]();
				}
			});*/
			
			var buy = $("<button>Buy 1</button>");
			buy.attr("id", id + "_buy");
			li.append(buy);
			buy.click(function(goal, id) {
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
							html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
							q.html(html);
							var pre = $("#" + id + "_pre");
							pre.html("" + powerups[id]);
							Game.recalculate();
					}
				}
			}(func, id));
			var label = $("<span>");
			label.html(func["description"]);
			label.css({"position": "absolute", "right": "3px", "top": "3px", "font-size": "10px"});
			li.append(label);
			/*li.click(function(goal, id) {
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
							html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
							q.html(html);
							var pre = $("#" + id + "_pre");
							pre.html("Total: " + powerups[id]);
					}
				}
			}(func, id));*/
			//li.tooltip({track: true});
		}
	}
	
	/*
	Game.listPowerUp("stranger");
	Game.listPowerUp("acquaintance");
	Game.listPowerUp("friend");
	Game.listPowerUp("bro");
	Game.listPowerUp("bestfriend");
	Game.listPowerUp("bff");
	Game.listPowerUp("personallawyer");
	Game.listPowerUp("sigother");
	Game.listPowerUp("staples");
	Game.listPowerUp("pencil");
	Game.listPowerUp("pen");
	Game.listPowerUp("typewriter");
	Game.listPowerUp("printer");
	Game.listPowerUp("altavista");
	Game.listPowerUp("orphans");
	Game.listPowerUp("robots");
	Game.listPowerUp("tippiecanoe");
	Game.listPowerUp("harry");
	Game.listPowerUp("ike");
	Game.listPowerUp("great");
	Game.listPowerUp("taxes");
	Game.listPowerUp("timeforchange");
	Game.listPowerUp("change");
	Game.listPowerUp("handsacrossamerica");
	Game.listPowerUp("perfectstrangers");
	Game.listPowerUp("perfectstrangers2");
	Game.listPowerUp("gettingtoknowyou");
	Game.listPowerUp("gettingtoknowallaboutyou");
	Game.listPowerUp("joey");
	Game.listPowerUp("chandler");
	Game.listPowerUp("budlight");
	Game.listPowerUp("collar");
	Game.listPowerUp("pizza");
	Game.listPowerUp("hideabody");
	Game.listPowerUp("idkmbffj");
	Game.listPowerUp("instantgram");
	Game.listPowerUp("objection");
	Game.listPowerUp("takethat");
	Game.listPowerUp("cohabitate");
	Game.listPowerUp("cosign");
	Game.listPowerUp("paperclips");
	Game.listPowerUp("paperbinders");
	Game.listPowerUp("sharpenedPencil");
	Game.listPowerUp("mechanicalpencil");
	Game.listPowerUp("moreink");
	Game.listPowerUp("cyberpen");
	Game.listPowerUp("wordprocessor");
	Game.listPowerUp("talktotext");
	Game.listPowerUp("laserprinter");
	Game.listPowerUp("threeinone");
	Game.listPowerUp("lycos");
	Game.listPowerUp("compuserve");
	Game.listPowerUp("gruel");
	Game.listPowerUp("posters");
	Game.listPowerUp("laserguns");
	Game.listPowerUp("sentience");
	Game.listPowerUp("tyler");
	Game.listPowerUp("harrison");
	Game.listPowerUp("barkley");
	Game.listPowerUp("truman");
	Game.listPowerUp("nixon");
	Game.listPowerUp("eisenhower");
	Game.listPowerUp("johnson");
	Game.listPowerUp("kennedy");
	Game.listPowerUp("quayle");
	Game.listPowerUp("bush");
	Game.listPowerUp("gore");
	Game.listPowerUp("clinton");
	Game.listPowerUp("biden");
	Game.listPowerUp("obama");
	Game.listPowerUp("morelube");
	Game.listPowerUp("chickenmeanscock");
	*/
	
	Game.listPowerUp("stranger");	Game.listPowerUp("perfectstrangers");	Game.listPowerUp("perfectstrangers2");
	Game.listPowerUp("acquaintance");	Game.listPowerUp("gettingtoknowyou");	Game.listPowerUp("gettingtoknowallaboutyou");
	Game.listPowerUp("friend");	Game.listPowerUp("joey");	Game.listPowerUp("chandler");
	Game.listPowerUp("bro");	Game.listPowerUp("budlight");	Game.listPowerUp("collar");
	Game.listPowerUp("bestfriend");	Game.listPowerUp("pizza");	Game.listPowerUp("hideabody");
	Game.listPowerUp("bff");	Game.listPowerUp("idkmbffj");	Game.listPowerUp("instantgram");
	Game.listPowerUp("personallawyer");	Game.listPowerUp("objection");	Game.listPowerUp("takethat");
	Game.listPowerUp("sigother");	Game.listPowerUp("cohabitate");	Game.listPowerUp("cosign");
	Game.listPowerUp("staples");	Game.listPowerUp("paperclips");	Game.listPowerUp("paperbinders");
	Game.listPowerUp("pencil");	Game.listPowerUp("sharpenedPencil");	Game.listPowerUp("mechanicalpencil");
	Game.listPowerUp("pen");	Game.listPowerUp("moreink");	Game.listPowerUp("cyberpen");
	Game.listPowerUp("typewriter");	Game.listPowerUp("wordprocessor");	Game.listPowerUp("talktotext");
	Game.listPowerUp("printer");	Game.listPowerUp("laserprinter");	Game.listPowerUp("threeinone");
	Game.listPowerUp("altavista");	Game.listPowerUp("lycos");	Game.listPowerUp("compuserve");
	Game.listPowerUp("orphans");	Game.listPowerUp("gruel");	Game.listPowerUp("posters");
	Game.listPowerUp("robots");	Game.listPowerUp("laserguns");	Game.listPowerUp("sentience");
	Game.listPowerUp("tippiecanoe");	Game.listPowerUp("tyler");	Game.listPowerUp("harrison");
	Game.listPowerUp("harry");	Game.listPowerUp("barkley");	Game.listPowerUp("truman");
	Game.listPowerUp("ike");	Game.listPowerUp("nixon");	Game.listPowerUp("eisenhower");
	Game.listPowerUp("great");	Game.listPowerUp("johnson");	Game.listPowerUp("kennedy");
	Game.listPowerUp("taxes");	Game.listPowerUp("quayle");	Game.listPowerUp("bush");
	Game.listPowerUp("timeforchange");	Game.listPowerUp("gore");	Game.listPowerUp("clinton");
	Game.listPowerUp("change");	Game.listPowerUp("biden");	Game.listPowerUp("obama");
	Game.listPowerUp("handsacrossamerica");	Game.listPowerUp("morelube");	Game.listPowerUp("chickenmeanscock");
	
	Game.Load = function() {
		try {
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
		catch(e) {
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
		try {
			for(var i in powerups) {
				localStorage[i] = powerups[i];
			}
			localStorage["efforttally"] = Math.round(efforttally);
			localStorage["paperworktally"] = Math.round(paperworktally);
			localStorage["yessirtally"] = Math.round(yessirtally);
			localStorage["currentGoalIndex"] = currentGoalIndex;
			
			$("#saved").fadeIn(1000).delay(5000).fadeOut(1000);
		}
		catch(e) {
		}
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
		Game.recalculate();
		$("#effortdescribe").show();
		$("#paperworkdescribe").show();
		$("#yessirdescribe").show();
	}
	
	var eps = pps = yps = 0;
	Game.recalculate = function() {
		eps = pps = yps = 0;
		for(var i in powerups) {
			if(powerups[i] > 0) {
				var results = powerupsfuncs[i]["func"](powerups[i]);
				eps += results["effort"];
				pps += results["paperwork"];
				yps += results["yessir"];
			}
		}
	}

	Game.Update = function() {
		/*for(var i in powerups) {
			if(powerups[i] > 0) {
				var results = powerupsfuncs[i]["func"](powerups[i]);
				Game.incrementEffort(results["effort"] / fps);
				Game.incrementPaperwork(results["paperwork"] / fps);
				Game.incrementYessir(results["yessir"] / fps);
			}
		}
		*/
		Game.incrementEffort(eps / fps);
		Game.incrementPaperwork(pps / fps);
		Game.incrementYessir(yps / fps);
		
		var goal = goals[currentGoalIndex];
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
	Game.Draw = function() {
		for(var i in powerups) {
			if($("#" + i).length) {
				$("#" + i + "_pre").html("" + powerups[i]);
				var func = powerupsfuncs[i];
				var effortVal = Game.compInt(func["cost"].effort, powerups[i]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[i]), yessirVal = Game.compInt(func["cost"].yessir, powerups[i]);
				if(efforttally >= effortVal &&
					paperworktally >= paperworkVal &&
					yessirtally >= yessirVal) {
						if(func["onetime"] === true && powerups[i] > 0) {
							$("#" + i + "_buy").html("Power Up Purchased").attr("disabled", "disabled");
						}
						else $("#" + i + "_buy").removeAttr("disabled");
				}
				else $("#" + i + "_buy").attr("disabled", "disabled");
				
				var q = $("#" + i + "_q");
				var html = "";
				html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(effortVal.toFixed(0)) : "") + " ";
				html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(paperworkVal.toFixed(0)) : "") + " ";
				html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(yessirVal.toFixed(0)) : "");
				q.html(html);
			}
		}
		$("#efforttally").html(numberWithCommas((Math.floor(efforttally * 10) / 10).toFixed(1)) + " Effort");
		$("#paperworktally").html(numberWithCommas((Math.floor(paperworktally * 10) / 10).toFixed(1)) + " Paperwork");
		$("#yessirtally").html(numberWithCommas((Math.floor(yessirtally * 10) / 10).toFixed(1)) + " Yes, Sir!");
		$("#effortpersec").html(numberWithCommas(eps.toFixed(1)) + " Effort Per Second");
		$("#paperworkpersec").html(numberWithCommas(pps.toFixed(1)) + " Paperwork Per Second");
		$("#yessirpersec").html(numberWithCommas(yps.toFixed(1)) + " Yes, Sir! Per Second");
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
		//lastRun = new Date().getTime();
		//YAY THE FRAME IS DONE! Let's make sure we're staying close to our FPS goal
		var delta = (new Date().getTime() - lastRun) / 1000;
		lastRun = new Date().getTime();
		var currFPS = ~~(1/delta);
		//console.log(currFPS + " fps");
		//console.log(eps);
		setTimeout(Game.Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
	}
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Game.Load();
	Game.updatePastGoals();
	Game.updateCurrentGoals();
	
	Game.recalculate();
	
	setInterval(Game.Save, 1000*60);	//Save every 60 seconds	
	setInterval(Game.recalculate, 1000/100);	//Recalculate EPS/PPS/YPS every 1/10th of a second; it's less stress!
	
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
	$("#fps").html(Game.version);
	if(loaded === false) setTimeout(Game.checkLoad, 1000/fps);
	else Game.Initialize();
}

Game.preLoad = function() {
	//Function care of http://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
	function supports_html5_storage() {
		try {
			localStorage.setItem("test", "test");
			localStorage.removeItem("test");
			return true;
		} catch (e) {
			return false;
		}
	}
	
	var canvas = document.createElement('canvas');
	
	if(!supports_html5_storage()) {
		$("#nosupport").html($("#nosupport").html() + "<br/>Your browser does not support the HTML5 functionality of \"Local Storage.\" Saving may not work for you. Please make sure you are using an up to date browser and that cookies are enabled.");
		//return;
	}
	
	if(!canvas.getContext) {
		$("#nosupport").html("Your browser does not support the HTML5 functionality of \"Canvas.\" Some images may appear weird.");
	}

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
	
	try {
		Game.addLoader("paperworker");
		var ctx    = canvas.getContext('2d');
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://fonts.googleapis.com/css?family=Special+Elite';
		document.getElementsByTagName('head')[0].appendChild(link);

		// Trick from http://stackoverflow.com/questions/2635814/
		var image = new Image;
		image.src = link.href;
		image.onerror = function() {
			setTimeout(function() {
				todo(ctx, paperwork, 12, "black");
			}, 1000);
		}
		
		Game.addLoader("yessir");
		var img = new Image;
		img.src = "images/yessir.png";
		img.onload = function() {
			Game.finishLoader("yessir");
		}
	}
	catch(e) {
		Game.finishLoader("paperworker");
		Game.finishLoader("yessir");
		Game.checkLoad();
	}
	
	Game.checkLoad();
}