var Initialize = function() {
	$(window).resize(function() {
		resizer();
	});
	$("#yessirer").scrollTop(scrollerBase);
	$("#efforter").click(function(e) {
		e.preventDefault();
		totalEffortClicks++;
		var whichFlags = ["grindstone", "back", "pain", "mile", "believe"];
		var howMuch = 1;
		for(var i = 0;i<whichFlags.length;i++) {
			howMuch += flags.flag(whichFlags[i]);
		}
		
		howMuch *= flags.flag("multiplier");

		incrementEffort(howMuch);
		
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		var obj = $("#effortclone").clone();
		obj.css("position", "absolute");
		obj.html("+" + howMuch);
		$("body").append(obj);
		var left = 15 * efforttoggle;
		efforttoggle *= -1;
		obj.css({"opacity": 1, "left": e.pageX, "top": e.pageY - 30});
		obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
			$(this).remove();
		});
		Draw();
	});
	
	$("#efforter").mousedown(function(e) {
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 6}, "fast")
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: '0px 9px 0px rgba(219,31,5,1)', top: 0}, "fast")
	});
	
	$("#paperworker").mousemove(function(e) {
		var howMuch = 1/20;
		totalPaperworkWiggles++;
		howMuch *= flags.flag("multiplier");
		incrementPaperwork(howMuch);
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		if(Math.random() < 0.10) {
			var obj = $("#effortclone").clone();
			obj.css("position", "absolute");
			obj.html("+" + howMuch);
			$("body").append(obj);
			var left = 15 * efforttoggle;
			efforttoggle *= -1;
			obj.css({"opacity": 1, "left": e.pageX, "top": e.pageY - 30});
			obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
				$(this).remove();
			});
		}
		
		Draw();
	});
	
	$("#yessirer").scroll( function(e) {
		$(this).removeClass("neutral");
		var scrollerLoc = $(this).scrollTop();
		if(scrollStatus === "") {	//Status not yet set! SUCCESS, BITCHES
			incrementYessir(1);
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
			var howMuch = 1;
			howMuch *= flags.flag("multiplier");
			if(scrollerLoc !== scrollerBase) {	//If current location is not equal to the base that it should always be reset to, THEEEEEENNNN...
				if(scrollerLoc < scrollerBase && scrollStatus === "D") {	//If location is "lower" (i.e. higher...it's weird) and the last status is down, then tally up and switch status to up!
					totalYessirScrolls++;
					incrementYessir(howMuch);
					scrollStatus = "U";
					$(this).removeClass("down");
					$(this).addClass("up");
				}
				else if(scrollerLoc > scrollerBase && scrollStatus === "U") {	//See comment above, but opposite it!...No, not the "Status not yet set" comment. Sheesh.
					totalYessirScrolls++;
					incrementYessir(howMuch);
					scrollStatus = "D";
					$(this).removeClass("up");
					$(this).addClass("down");
				}
			}
			Draw();
		}
		$(this).scrollTop(scrollerBase);
	});
	
	$("#save").click(function() {
		Save();
	});
	
	$("#reset").click(function() {
		if(confirm("Are you sure you want to reset?")) {
			Reset();
			Save();
			Load();
			updatePastGoals();
			updateCurrentGoals();
			twoCol();
		}
	});
	
	$("#export").click(function() {
		Save();
		Export();
	});
	
	$("#import").click(function() {
		Import();
	});
	
	Tutorial();
	
	/*
	for(var i in resizelists) {
		var currList = resizelists[i].join(",");
		$(currList).perfectScrollbar();
	}*/
	
	tickerChange();
	setInterval(tickerChange, 1000*15);
	
	goals = [
		new Goal("Class Clown", {effort: 75, paperwork: 0, yessir: 0}, function() {$("#effortdescribe").hide("slow");}),
		new Goal("Hall Monitor", {effort: 150, paperwork: 0, yessir: 0}, function() {}),
		new Goal("Class Treasurer", {effort: 300, paperwork: 0, yessir: 0}, function() {}),
		new Goal("Class Vice President", {effort: 600, paperwork: 0, yessir: 0}, function() {}),
		new Goal("Class President", {effort: 1800, paperwork: 0, yessir: 0}, function() {}),
		new Goal("Prom Royalty", {effort: 5400, paperwork: 0, yessir: 0}, function() {}),
		new Goal("Sports Captain", {effort: 16200, paperwork: 0, yessir: 0}, function() {threeCol();}),
		new Goal("Fry Cook", {effort: 32400, paperwork: 75, yessir: 0}, function() {$("#paperworkdescribe").hide("slow");}),
		new Goal("Assistant Assistant Manager", {effort: 97200, paperwork: 150, yessir: 0}, function() {}),
		new Goal("Assistant Manager", {effort: 291600, paperwork: 300, yessir: 0}, function() {}),
		new Goal("General Manager", {effort: 583200, paperwork: 600, yessir: 0}, function() {}),
		new Goal("District Manager", {effort: 1749600, paperwork: 1800, yessir: 0}, function() {}),
		new Goal("PTA Treasurer", {effort: 3499200, paperwork: 5400, yessir: 0}, function() {}),
		new Goal("PTA Vice President", {effort: 13996800, paperwork: 16200, yessir: 0}, function() {}),
		new Goal("PTA President", {effort: 27993600, paperwork: 32400, yessir: 0}, function() {}),
		new Goal("City Council", {effort: 111974400, paperwork: 97200, yessir: 0}, function() {}),
		new Goal("Deputy Mayor", {effort: 335923200, paperwork: 291600, yessir: 0}, function() {fourCol();}),
		new Goal("Mayor", {effort: 671846400, paperwork: 583200, yessir: 75}, function() {$("#yessirdescribe").hide("slow");}),
		new Goal("Judge", {effort: 1343692800, paperwork: 1749600, yessir: 150}, function() {}),
		new Goal("Lieutenant Governor", {effort: 2687385600, paperwork: 3499200, yessir: 300}, function() {}),
		new Goal("Governor", {effort: 10749542400, paperwork: 13996800, yessir: 600}, function() {}),
		new Goal("Senator", {effort: 21499084800, paperwork: 27993600, yessir: 1800}, function() {}),
		new Goal("Vice President", {effort: 85996339200, paperwork: 111974400, yessir: 5400}, function() {}),
		new Goal("President of the United States", {effort: 343985356800, paperwork: 335923200, yessir: 16200}, function() {}),
		new Goal("Head of United Nations", {effort: 1031956070400, paperwork: 671846400, yessir: 32400}, function() {}),
		new Goal("President of the Western Hemisphere", {effort: 2063912140800, paperwork: 1343692800, yessir: 97200}, function() {}),
		new Goal("President of Earth", {effort: 6191736422400, paperwork: 2687385600, yessir: 291600}, function() {}),
		new Goal("President of the Solar System", {effort: 18575209267200, paperwork: 10749542400, yessir: 583200}, function() {}),
		new Goal("President of the Solar Interstellar Neighborhood", {effort: 37150418534400, paperwork: 21499084800, yessir: 1749600}, function() {}),
		new Goal("President of the Milky Way Galaxy", {effort: 74300837068800, paperwork: 85996339200, yessir: 3499200}, function() {}),
		new Goal("President of the Local Galactic Group", {effort: 148601674137600, paperwork: 343985356800, yessir: 13996800}, function() {}),
		new Goal("President of the Virgo Supercluster", {effort: 297203348275200, paperwork: 1031956070400, yessir: 27993600}, function() {}),
		new Goal("President of all Local Superclusters", {effort: 1188813393100800, paperwork: 2063912140800, yessir: 111974400}, function() {}),
		new Goal("President of the Observable Universe", {effort: 2377626786201600, paperwork: 6191736422400, yessir: 335923200}, function() {}),
		new Goal("President of Universe, Observable or Not", {effort: 9510507144806400, paperwork: 18575209267200, yessir: 671846400}, function() {}),
		new Goal("President of The Multiverse", {effort: 38042028579225600, paperwork: 37150418534400, yessir: 1343692800}, function() {}),
		new Goal("President of Time", {effort: 76084057158451200, paperwork: 74300837068800, yessir: 2687385600}, function() {}),
		new Goal("Vice God", {effort: 152168114316902400, paperwork: 148601674137600, yessir: 10749542400}, function() {}),
		new Goal("God", {effort: 456504342950707200, paperwork: 297203348275200, yessir: 21499084800}, function() {}),
		new Goal("Ultra God", {effort: 1369513028852121600, paperwork: 1188813393100800, yessir: 85996339200}, function() {})
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
	
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", function() { return "+" + (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", function() { return "+" + (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", function() { return "+" + (3 + flags.flag("joey") + flags.flag("chandler")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", function() { return "+" + (50 + flags.flag("budlight") + flags.flag("collar")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", function() { return "+" + (300 + flags.flag("pizza") + flags.flag("hideabody")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", function() { return "+" + (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", function() { return "+" + (9999 + flags.flag("objection") + flags.flag("takethat")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", function() { return "+" + (70000 + flags.flag("cohabitate") + flags.flag("cosign")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("superpac", {effort: 81000000, paperwork: 7598950, yessir: 999000}, "Super PAC", function() { return "+" + (500000 + flags.flag("babypac") + flags.flag("mspac")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (500000 + flags.flag("babypac") + flags.flag("mspac")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", function() { return "+" + (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false)
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", function() { return "+" + (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false)
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", function() { return "+" + (3 + flags.flag("moreink") + flags.flag("cyberpen")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false)
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", function() { return "+" + (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false)
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", function() { return "+" + (300 + flags.flag("laserprinter") + flags.flag("threeinone")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false)
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", function() { return "+" + (2400 + flags.flag("lycos") + flags.flag("compuserve")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (2400 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false)
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", function() { return "+" + (9999 + flags.flag("gruel") + flags.flag("posters")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false)
	addPowerUp("robots", {effort: 101200000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", function() { return "+" + (70000 + flags.flag("laserguns") + flags.flag("sentience")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false)
	addPowerUp("unicron", {effort: 155848000, paperwork: 81000000, yessir: 1599000}, "Living planet with amazing handwriting", function() { return "+" + (500000 + flags.flag("matrix") + flags.flag("disc")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (500000 + flags.flag("matrix") + flags.flag("disc")) * num,"yessir": 0};}, false)
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", function() { return "+" + (0.1 + flags.flag("tyler") + flags.flag("harrison")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false)
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", function() { return "+" + (0.5 + flags.flag("barkley") + flags.flag("truman")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false)
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", function() { return "+" + (3 + flags.flag("nixon") + flags.flag("eisenhower")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false)
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", function() { return "+" + (50 + flags.flag("johnson") + flags.flag("kennedy")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false)
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", function() { return "+" + (300 + flags.flag("quayle") + flags.flag("bush")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false)
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", function() { return "+" + (2400 + flags.flag("gore") + flags.flag("clinton")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (2400 + flags.flag("gore") + flags.flag("clinton")) * num};}, false)
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", function() { return "+" + (9999 + flags.flag("biden") + flags.flag("obama")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false)
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", function() { return "+" + (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false)
	addPowerUp("morelies", {effort: 8500000000, paperwork: 370370367, yessir: 134829756}, "\"Here, Have Some Empty Promises\"", function() { return "+" + (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) * num};}, false)
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", function() { return "+2 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers").length > 0 && num > 0) {$("#perfectstrangers").remove();}flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", function() { return "+50 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers2").length > 0 && num > 0) {$("#perfectstrangers2").remove();}flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", function() { return "+5 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowyou").length > 0 && num > 0) {$("#gettingtoknowyou").remove();}flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 98000, paperwork: 0, yessir: 0}, "Getting To Know All About You", function() { return "+70 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowallaboutyou").length > 0 && num > 0) {$("#gettingtoknowallaboutyou").remove();}flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", function() { return "+10 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#joey").length > 0 && num > 0) {$("#joey").remove();}flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", function() { return "+115 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#chandler").length > 0 && num > 0) {$("#chandler").remove();}flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", function() { return "+115 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#budlight").length > 0 && num > 0) {$("#budlight").remove();}flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", function() { return "+420 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#collar").length > 0 && num > 0) {$("#collar").remove();}flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", function() { return "+500 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#pizza").length > 0 && num > 0) {$("#pizza").remove();}flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", function() { return "+900 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#hideabody").length > 0 && num > 0) {$("#hideabody").remove();}flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", function() { return "+1234 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#idkmbffj").length > 0 && num > 0) {$("#idkmbffj").remove();}flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", function() { return "+5000 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#instantgram").length > 0 && num > 0) {$("#instantgram").remove();}flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", function() { return "+25000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#objection").length > 0 && num > 0) {$("#objection").remove();}flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", function() { return "+50000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#takethat").length > 0 && num > 0) {$("#takethat").remove();}flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", function() { return "+150000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cohabitate").length > 0 && num > 0) {$("#cohabitate").remove();}flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", function() { return "+300000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cosign").length > 0 && num > 0) {$("#cosign").remove();}flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("babypac", {effort: 231777551, paperwork: 32000000, yessir: 1241100}, "Baby PAC", function() { return "+1750000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#babypac").length > 0 && num > 0) {$("#babypac").remove();}flags.flag("babypac", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("babypac", 0);});
	addPowerUp("mspac", {effort: 1557773120, paperwork: 68800000, yessir: 9000000}, "Ms. PAC", function() { return "+5000000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#mspac").length > 0 && num > 0) {$("#mspac").remove();}flags.flag("mspac", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mspac", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", function() { return "+2 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperclips").length > 0 && num > 0) {$("#paperclips").remove();}flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", function() { return "+50 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperbinders").length > 0 && num > 0) {$("#paperbinders").remove();}flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", function() { return "+5 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#sharpenedPencil").length > 0 && num > 0) {$("#sharpenedPencil").remove();}flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 98000, yessir: 0}, "Mechanical Pencil", function() { return "+70 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#mechanicalpencil").length > 0 && num > 0) {$("#mechanicalpencil").remove();}flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", function() { return "+10 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#moreink").length > 0 && num > 0) {$("#moreink").remove();}flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", function() { return "+115 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#cyberpen").length > 0 && num > 0) {$("#cyberpen").remove();}flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", function() { return "+115 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#wordprocessor").length > 0 && num > 0) {$("#wordprocessor").remove();}flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", function() { return "+420 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#talktotext").length > 0 && num > 0) {$("#talktotext").remove();}flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", function() { return "+500 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#laserprinter").length > 0 && num > 0) {$("#laserprinter").remove();}flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", function() { return "+900 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#threeinone").length > 0 && num > 0) {$("#threeinone").remove();}flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", function() { return "+1234 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#lycos").length > 0 && num > 0) {$("#lycos").remove();}flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", function() { return "+5000 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#compuserve").length > 0 && num > 0) {$("#compuserve").remove();}flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", function() { return "+25000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#gruel").length > 0 && num > 0) {$("#gruel").remove();}flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", function() { return "+50000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#posters").length > 0 && num > 0) {$("#posters").remove();}flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", function() { return "+150000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#laserguns").length > 0 && num > 0) {$("#laserguns").remove();}flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", function() { return "+300000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#sentience").length > 0 && num > 0) {$("#sentience").remove();}flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("matrix", {effort: 794220000, paperwork: 64036767, yessir: 2716000}, "Matrix of...Eh.", function() { return "+1750000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#matrix").length > 0 && num > 0) {$("#matrix").remove();}flags.flag("matrix", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("matrix", 0);});
	addPowerUp("disc", {effort: 1588440000, paperwork: 177407054, yessir: 5432000}, "Silver Disc", function() { return "+5000000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#disc").length > 0 && num > 0) {$("#disc").remove();}flags.flag("disc", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("disc", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", function() { return "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#tyler").length > 0 && num > 0) {$("#tyler").remove();}flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", function() { return "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#harrison").length > 0 && num > 0) {$("#harrison").remove();}flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", function() { return "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#barkley").length > 0 && num > 0) {$("#barkley").remove();}flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 98000}, "Harry S. Truman", function() { return "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#truman").length > 0 && num > 0) {$("#truman").remove();}flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", function() { return "+10 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#nixon").length > 0 && num > 0) {$("#nixon").remove();}flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", function() { return "+115 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#eisenhower").length > 0 && num > 0) {$("#eisenhower").remove();}flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", function() { return "+115 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#johnson").length > 0 && num > 0) {$("#johnson").remove();}flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", function() { return "+420 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#kennedy").length > 0 && num > 0) {$("#kennedy").remove();}flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 18660000, paperwork: 18660000, yessir: 18660000}, "Dan Quayle", function() { return "+500 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#quayle").length > 0 && num > 0) {$("#quayle").remove();}flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 49440000, paperwork: 49440000, yessir: 49440000}, "George H. W. Bush", function() { return "+900 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#bush").length > 0 && num > 0) {$("#bush").remove();}flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 30720000, paperwork: 30720000, yessir: 30720000}, "Al Gore", function() { return "+1234 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#gore").length > 0 && num > 0) {$("#gore").remove();}flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 254520000, paperwork: 254520000, yessir: 254520000}, "Bill Clinton", function() { return "+5000 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#clinton").length > 0 && num > 0) {$("#clinton").remove();}flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 96840000, paperwork: 96840000, yessir: 96840000}, "Joe Biden", function() { return "+25000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#biden").length > 0 && num > 0) {$("#biden").remove();}flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 3696600000, paperwork: 3696600000, yessir: 3696600000}, "Barack Obama", function() { return "+50000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#obama").length > 0 && num > 0) {$("#obama").remove();}flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 2382660000, paperwork: 2382660000, yessir: 2382660000}, "More Lube", function() { return "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#morelube").length > 0 && num > 0) {$("#morelube").remove();}flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 8022000000, paperwork: 8022000000, yessir: 8022000000}, "A \"Chicken\" In Every \"Pot\"", function() { return "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#chickenmeanscock").length > 0 && num > 0) {$("#chickenmeanscock").remove();}flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	addPowerUp("jobs", {effort: 4765320000, paperwork: 4765320000, yessir: 4765320000}, "\"Jobs For Everyone, For Real!\"", function() { return "+1750000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#jobs").length > 0 && num > 0) {$("#jobs").remove();}flags.flag("jobs", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("jobs", 0);});
	addPowerUp("hungryhungry", {effort: 9530640000, paperwork: 9530640000, yessir: 9530640000}, "\"I Will End World Hunger Forever.\"", function() { return "+5000000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#hungryhungry").length > 0 && num > 0) {$("#hungryhungry").remove();}flags.flag("hungryhungry", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hungryhungry", 0);});
	addPowerUp("grindstone", {effort: 1100, paperwork: 0, yessir: 0}, "Nose To The Grindstone", function() {return "+5 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#grindstone").length > 0 && num > 0) {$("#grindstone").remove();} flags.flag("grindstone", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("grindstone", 0);});
	addPowerUp("back", {effort: 21000, paperwork: 0, yessir: 0}, "Put Your Back Into It", function() {return "+75 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#back").length > 0 && num > 0) {$("#back").remove();} flags.flag("back", 75); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("back", 0);});
	addPowerUp("pain", {effort: 480000, paperwork: 0, yessir: 0}, "No Pain, No Gain", function() {return "+500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#pain").length > 0 && num > 0) {$("#pain").remove();} flags.flag("pain", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pain", 0);});
	addPowerUp("mile", {effort: 3456000, paperwork: 0, yessir: 0}, "Go The Extra Mile", function() {return "+2500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#mile").length > 0 && num > 0) {$("#mile").remove();} flags.flag("mile", 2500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mile", 0);});
	addPowerUp("believe", {effort: 9999990, paperwork: 0, yessir: 0}, "Believe In Yourself", function() {return "+30000 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#believe").length > 0 && num > 0) {$("#believe").remove();} flags.flag("believe", 30000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("believe", 0);});
	
	/*
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", function() { return "+" + (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", function() { return "+" + (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", function() { return "+" + (3 + flags.flag("joey") + flags.flag("chandler")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", function() { return "+" + (50 + flags.flag("budlight") + flags.flag("collar")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", function() { return "+" + (300 + flags.flag("pizza") + flags.flag("hideabody")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", function() { return "+" + (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", function() { return "+" + (9999 + flags.flag("objection") + flags.flag("takethat")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", function() { return "+" + (70000 + flags.flag("cohabitate") + flags.flag("cosign")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("superpac", {effort: 81000000, paperwork: 7598950, yessir: 999000}, "Super PAC", function() { return "+" + (500000 + flags.flag("babypac") + flags.flag("mspac")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (500000 + flags.flag("babypac") + flags.flag("mspac")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", function() { return "+" + (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false)
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", function() { return "+" + (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false)
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", function() { return "+" + (3 + flags.flag("moreink") + flags.flag("cyberpen")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false)
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", function() { return "+" + (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false)
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", function() { return "+" + (300 + flags.flag("laserprinter") + flags.flag("threeinone")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false)
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", function() { return "+" + (2400 + flags.flag("lycos") + flags.flag("compuserve")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (2400 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false)
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", function() { return "+" + (9999 + flags.flag("gruel") + flags.flag("posters")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false)
	addPowerUp("robots", {effort: 101200000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", function() { return "+" + (70000 + flags.flag("laserguns") + flags.flag("sentience")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false)
	addPowerUp("unicron", {effort: 155848000, paperwork: 81000000, yessir: 1599000}, "Living planet with amazing handwriting", function() { return "+" + (500000 + flags.flag("matrix") + flags.flag("disc")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (500000 + flags.flag("matrix") + flags.flag("disc")) * num,"yessir": 0};}, false)
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", function() { return "+" + (0.1 + flags.flag("tyler") + flags.flag("harrison")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false)
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", function() { return "+" + (0.5 + flags.flag("barkley") + flags.flag("truman")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false)
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", function() { return "+" + (3 + flags.flag("nixon") + flags.flag("eisenhower")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false)
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", function() { return "+" + (50 + flags.flag("johnson") + flags.flag("kennedy")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false)
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", function() { return "+" + (300 + flags.flag("quayle") + flags.flag("bush")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false)
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", function() { return "+" + (2400 + flags.flag("gore") + flags.flag("clinton")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (2400 + flags.flag("gore") + flags.flag("clinton")) * num};}, false)
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", function() { return "+" + (9999 + flags.flag("biden") + flags.flag("obama")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false)
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", function() { return "+" + (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false)
	addPowerUp("morelies", {effort: 8500000000, paperwork: 370370367, yessir: 134829756}, "\"Here, Have Some Empty Promises\"", function() { return "+" + (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) * num};}, false)
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", function() { return "+2 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers").length > 0 && num > 0) {$("#perfectstrangers").remove();}flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", function() { return "+50 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers2").length > 0 && num > 0) {$("#perfectstrangers2").remove();}flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", function() { return "+5 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowyou").length > 0 && num > 0) {$("#gettingtoknowyou").remove();}flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 620000, paperwork: 0, yessir: 0}, "Getting To Know All About You", function() { return "+70 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowallaboutyou").length > 0 && num > 0) {$("#gettingtoknowallaboutyou").remove();}flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", function() { return "+10 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#joey").length > 0 && num > 0) {$("#joey").remove();}flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", function() { return "+115 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#chandler").length > 0 && num > 0) {$("#chandler").remove();}flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", function() { return "+115 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#budlight").length > 0 && num > 0) {$("#budlight").remove();}flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", function() { return "+420 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#collar").length > 0 && num > 0) {$("#collar").remove();}flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", function() { return "+500 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#pizza").length > 0 && num > 0) {$("#pizza").remove();}flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", function() { return "+900 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#hideabody").length > 0 && num > 0) {$("#hideabody").remove();}flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", function() { return "+1234 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#idkmbffj").length > 0 && num > 0) {$("#idkmbffj").remove();}flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", function() { return "+5000 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#instantgram").length > 0 && num > 0) {$("#instantgram").remove();}flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", function() { return "+25000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#objection").length > 0 && num > 0) {$("#objection").remove();}flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", function() { return "+50000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#takethat").length > 0 && num > 0) {$("#takethat").remove();}flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", function() { return "+150000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cohabitate").length > 0 && num > 0) {$("#cohabitate").remove();}flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", function() { return "+300000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cosign").length > 0 && num > 0) {$("#cosign").remove();}flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("babypac", {effort: 231777551, paperwork: 32000000, yessir: 1241100}, "Baby PAC", function() { return "+1750000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#babypac").length > 0 && num > 0) {$("#babypac").remove();}flags.flag("babypac", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("babypac", 0);});
	addPowerUp("mspac", {effort: 1557773120, paperwork: 68800000, yessir: 9000000}, "Ms. PAC", function() { return "+5000000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#mspac").length > 0 && num > 0) {$("#mspac").remove();}flags.flag("mspac", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mspac", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", function() { return "+2 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperclips").length > 0 && num > 0) {$("#paperclips").remove();}flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", function() { return "+50 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperbinders").length > 0 && num > 0) {$("#paperbinders").remove();}flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", function() { return "+5 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#sharpenedPencil").length > 0 && num > 0) {$("#sharpenedPencil").remove();}flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 620000, yessir: 0}, "Mechanical Pencil", function() { return "+70 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#mechanicalpencil").length > 0 && num > 0) {$("#mechanicalpencil").remove();}flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", function() { return "+10 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#moreink").length > 0 && num > 0) {$("#moreink").remove();}flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", function() { return "+115 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#cyberpen").length > 0 && num > 0) {$("#cyberpen").remove();}flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", function() { return "+115 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#wordprocessor").length > 0 && num > 0) {$("#wordprocessor").remove();}flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", function() { return "+420 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#talktotext").length > 0 && num > 0) {$("#talktotext").remove();}flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", function() { return "+500 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#laserprinter").length > 0 && num > 0) {$("#laserprinter").remove();}flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", function() { return "+900 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#threeinone").length > 0 && num > 0) {$("#threeinone").remove();}flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", function() { return "+1234 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#lycos").length > 0 && num > 0) {$("#lycos").remove();}flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", function() { return "+5000 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#compuserve").length > 0 && num > 0) {$("#compuserve").remove();}flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", function() { return "+25000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#gruel").length > 0 && num > 0) {$("#gruel").remove();}flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", function() { return "+50000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#posters").length > 0 && num > 0) {$("#posters").remove();}flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", function() { return "+150000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#laserguns").length > 0 && num > 0) {$("#laserguns").remove();}flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", function() { return "+300000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#sentience").length > 0 && num > 0) {$("#sentience").remove();}flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("matrix", {effort: 794220000, paperwork: 64036767, yessir: 2716000}, "Matrix of...Eh.", function() { return "+1750000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#matrix").length > 0 && num > 0) {$("#matrix").remove();}flags.flag("matrix", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("matrix", 0);});
	addPowerUp("disc", {effort: 1588440000, paperwork: 177407054, yessir: 5432000}, "Silver Disc", function() { return "+5000000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#disc").length > 0 && num > 0) {$("#disc").remove();}flags.flag("disc", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("disc", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", function() { return "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#tyler").length > 0 && num > 0) {$("#tyler").remove();}flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", function() { return "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#harrison").length > 0 && num > 0) {$("#harrison").remove();}flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", function() { return "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#barkley").length > 0 && num > 0) {$("#barkley").remove();}flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 620000}, "Harry S. Truman", function() { return "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#truman").length > 0 && num > 0) {$("#truman").remove();}flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", function() { return "+10 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#nixon").length > 0 && num > 0) {$("#nixon").remove();}flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", function() { return "+115 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#eisenhower").length > 0 && num > 0) {$("#eisenhower").remove();}flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", function() { return "+115 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#johnson").length > 0 && num > 0) {$("#johnson").remove();}flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", function() { return "+420 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#kennedy").length > 0 && num > 0) {$("#kennedy").remove();}flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 18660000, paperwork: 18660000, yessir: 18660000}, "Dan Quayle", function() { return "+500 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#quayle").length > 0 && num > 0) {$("#quayle").remove();}flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 49440000, paperwork: 49440000, yessir: 49440000}, "George H. W. Bush", function() { return "+900 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#bush").length > 0 && num > 0) {$("#bush").remove();}flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 30720000, paperwork: 30720000, yessir: 30720000}, "Al Gore", function() { return "+1234 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#gore").length > 0 && num > 0) {$("#gore").remove();}flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 254520000, paperwork: 254520000, yessir: 254520000}, "Bill Clinton", function() { return "+5000 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#clinton").length > 0 && num > 0) {$("#clinton").remove();}flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 96840000, paperwork: 96840000, yessir: 96840000}, "Joe Biden", function() { return "+25000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#biden").length > 0 && num > 0) {$("#biden").remove();}flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 3696600000, paperwork: 3696600000, yessir: 3696600000}, "Barack Obama", function() { return "+50000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#obama").length > 0 && num > 0) {$("#obama").remove();}flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 2382660000, paperwork: 2382660000, yessir: 2382660000}, "More Lube", function() { return "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#morelube").length > 0 && num > 0) {$("#morelube").remove();}flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 8022000000, paperwork: 8022000000, yessir: 8022000000}, "A \"Chicken\" In Every \"Pot\"", function() { return "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#chickenmeanscock").length > 0 && num > 0) {$("#chickenmeanscock").remove();}flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	addPowerUp("jobs", {effort: 4765320000, paperwork: 4765320000, yessir: 4765320000}, "\"Jobs For Everyone, For Real!\"", function() { return "+1750000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#jobs").length > 0 && num > 0) {$("#jobs").remove();}flags.flag("jobs", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("jobs", 0);});
	addPowerUp("hungryhungry", {effort: 9530640000, paperwork: 9530640000, yessir: 9530640000}, "\"I Will End World Hunger Forever.\"", function() { return "+5000000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#hungryhungry").length > 0 && num > 0) {$("#hungryhungry").remove();}flags.flag("hungryhungry", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hungryhungry", 0);});
	addPowerUp("grindstone", {effort: 1100, paperwork: 0, yessir: 0}, "Nose To The Grindstone", function() {return "+5 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#grindstone").length > 0 && num > 0) {$("#grindstone").remove();} flags.flag("grindstone", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("grindstone", 0);});
	addPowerUp("back", {effort: 21000, paperwork: 0, yessir: 0}, "Put Your Back Into It", function() {return "+75 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#back").length > 0 && num > 0) {$("#back").remove();} flags.flag("back", 75); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("back", 0);});
	addPowerUp("pain", {effort: 480000, paperwork: 0, yessir: 0}, "No Pain, No Gain", function() {return "+500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#pain").length > 0 && num > 0) {$("#pain").remove();} flags.flag("pain", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pain", 0);});
	addPowerUp("mile", {effort: 3456000, paperwork: 0, yessir: 0}, "Go The Extra Mile", function() {return "+2500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#mile").length > 0 && num > 0) {$("#mile").remove();} flags.flag("mile", 2500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mile", 0);});
	addPowerUp("believe", {effort: 9999990, paperwork: 0, yessir: 0}, "Believe In Yourself", function() {return "+30000 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#believe").length > 0 && num > 0) {$("#believe").remove();} flags.flag("believe", 30000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("believe", 0);});*/
	
	flags.flag("multiplier", 1);	//This is not the greatest variable in the code. No. This is just a tribute.
	buildPows();					//TEMPORARY FUNCTION!
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Load();
	updatePastGoals();
	updateCurrentGoals();
	
	buildTabs();
	
	recalculate();
	
	setInterval(Save, 1000*30);	//Save every 30 seconds	
	setInterval(recalculate, 1000/100);	//Recalculate EPS/PPS/YPS every 1/10th of a second; it's less stress!
	
	resizer();

	setInterval(function() {	//check for updates every 30 minutes!
		$.ajax("status.html").done(function(data) {
			if(currNotes != data) {
				var myAlert = null;
				if(document.getElementById("myAlert")) myAlert = $("#myAlert");
				else myAlert = $("<div>");
				myAlert.attr("id", "myAlert");
				$("body").append(myAlert);
				myAlert.html("A change has gone live for GetElected! Here are the notes:<br /><br />" + data);
				myAlert.css({"position": "absolute", "top": "50%", "left": "50%", "margin": "-" + (myAlert.height() / 2) + "px 0 0 -" +(myAlert.width() / 2) + "px" });
				myAlert.fadeIn(1000).delay(15000).fadeOut(1000);
			}
		});
	}, 1000 * 60 * 30);
	
	$.ajax("status.html").done(function(data) {
		currNotes = data;
	});

	/*
	setInterval(function() {	//JUST to make sure that effort is calculating correctly, as there are worries that it is not correct.
		console.log("Last Second: " + lastEffort + "      Current Second: " + efforttally + "     Difference: " + (efforttally - lastEffort));
		console.log("EPS " + eps);
		console.log("What " + (eps / fps));
		lastEffort = efforttally;
	}, 1000);*/
	
	//Last but not least, let's get some shit in place to track FPS, JUUUUST in case things start running slow.
	lastRun = new Date().getTime();
	if(startDate === 0 || isNaN(startDate)) startDate = (new Date()).getTime();
	Loop();
}