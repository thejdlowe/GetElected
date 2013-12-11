var Initialize = function() {
	$(window).resize(function() {
		resizer();
	});
	$("#yessirer").scrollTop(scrollerBase);
	$("#efforter").click(function(e) {
		e.preventDefault();
		totalEffortClicks++;
		var howMuch = 1;
		var whichFlags = ["grindstone", "back", "pain", "mile", "believe"];
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
		var whichFlags = ["advpaper", "ultpaper", "sweetpaper", "multidimenpaper", "prettyprettypen"];
		for(var i = 0;i<whichFlags.length;i++) {
			howMuch += flags.flag(whichFlags[i]);
		}
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
			var whichFlags = ["stronghandshakes", "deeperlies", "longcommercials", "infiltratereddit", "telepathy"];
			for(var i = 0;i<whichFlags.length;i++) {
				howMuch += flags.flag(whichFlags[i]);
			}
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
	
	var x = y = 0;
	$("#buck").draggable({ containment: "parent", stop: function() {
			var obj1 = {
				x:		$(this).offset().left,
				y:		$(this).offset().top,
				width:	$(this).width(),
				height:	$(this).height()
			};
			var obj2 = {
				x:		$("#goal").offset().left,
				y:		$("#goal").offset().top,
				width:	$("#goal").width(),
				height:	$("#goal").height()
			};

			if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
				obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
					var howMuch = 1;
					var whichFlags = ["fivebribe", "seventyfivebribe", "fivehundredbribe", "twentyfivehundredbribe", "thirtythousandbribe"];
					for(var i = 0;i<whichFlags.length;i++) {
						howMuch += flags.flag(whichFlags[i]);
					}
					howMuch *= flags.flag("multiplier");

					incrementBribery(howMuch);
					var newTop = $("#goal").offset().top + ($("#goal").height() / 2);
					var newLeft = $("#goal").offset().left + ($("#goal").width() / 2);

					$(this).animate({height: 0, width: 0}, 400, function() {
						$(this).animate({top: 0, left: 0, height: 50, width: 50}, 5);
					});
			}
			else {
				$(this).animate({top: 0, left: 0}, 500);
			}
		}
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
	
	tickerChange();
	setInterval(tickerChange, 1000*15);
	
	goals = [
		new Goal("Participation Award", {effort: 2, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Best Hand Turkey Drawer", {effort: 25, paperwork: 0, yessir: 0, bribery: 0}, function() {$("#effortdescribe").hide("slow");}),
		new Goal("Class Clown", {effort: 75, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Hall Monitor", {effort: 150, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class Treasurer", {effort: 300, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class Vice President", {effort: 600, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class President", {effort: 1800, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Prom Royalty", {effort: 3600, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Sports Captain", {effort: 5800, paperwork: 0, yessir: 0, bribery: 0}, function() {threeCol();}),
		new Goal("Valedictorian", {effort: 10000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Summa Cum Laude", {effort: 16100, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Pledge", {effort: 23500, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Treasurer", {effort: 32000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Vice President", {effort: 41300, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity President", {effort: 52000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Inter-Fraternity Council President", {effort: 67200, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Big Man On Campus", {effort: 85000, paperwork: 0, yessir: 0, bribery: 0}, function() {threeCol();}),
		new Goal("Fry Cook", {effort: 100000, paperwork: 1000, yessir: 0, bribery: 0}, function() {$("#paperworkdescribe").hide("slow");}),
		new Goal("Asst. Employee Of The Week", {effort: 128000, paperwork: 1280, yessir: 0, bribery: 0}, function() {}),
		new Goal("Employee Of The Week", {effort: 163840, paperwork: 1638, yessir: 0, bribery: 0}, function() {}),
		new Goal("Employee Of The Year", {effort: 209715, paperwork: 2097, yessir: 0, bribery: 0}, function() {}),
		new Goal("Assistant Assistant Manager", {effort: 268435, paperwork: 2684, yessir: 0, bribery: 0}, function() {}),
		new Goal("Assistant Manager", {effort: 343597, paperwork: 3436, yessir: 0, bribery: 0}, function() {}),
		new Goal("General Manager", {effort: 439804, paperwork: 4398, yessir: 0, bribery: 0}, function() {}),
		new Goal("District Manager", {effort: 562949, paperwork: 5629, yessir: 0, bribery: 0}, function() {}),
		new Goal("Teacher", {effort: 720575, paperwork: 7206, yessir: 0, bribery: 0}, function() {}),
		new Goal("Vice Principal", {effort: 922336, paperwork: 9223, yessir: 0, bribery: 0}, function() {}),
		new Goal("Principal", {effort: 1199037, paperwork: 11990, yessir: 0, bribery: 0}, function() {}),
		new Goal("Professor", {effort: 1558748, paperwork: 15587, yessir: 0, bribery: 0}, function() {}),
		new Goal("Dean of Students", {effort: 2026372, paperwork: 20264, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA Treasurer", {effort: 2634284, paperwork: 26343, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA Vice President", {effort: 3424569, paperwork: 34246, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA President", {effort: 4451940, paperwork: 44519, yessir: 0, bribery: 0}, function() {}),
		new Goal("City Council", {effort: 5787522, paperwork: 57875, yessir: 0, bribery: 0}, function() {}),
		new Goal("Undersheriff", {effort: 7523779, paperwork: 75238, yessir: 0, bribery: 0}, function() {}),
		new Goal("Sheriff", {effort: 9780913, paperwork: 97809, yessir: 0, bribery: 0}, function() {fourCol();}),
		new Goal("Deputy Mayor", {effort: 12715187, paperwork: 127152, yessir: 1272, bribery: 0}, function() {fourCol();}),
		new Goal("Mayor", {effort: 17165502, paperwork: 171655, yessir: 1717, bribery: 0}, function() {$("#yessirdescribe").hide("slow");}),
		new Goal("Chupacabra", {effort: 23173428, paperwork: 231734, yessir: 2317, bribery: 0}, function() {}),
		new Goal("Ruler of The Forests", {effort: 31284128, paperwork: 312841, yessir: 3128, bribery: 0}, function() {}),
		new Goal("Judge", {effort: 42233573, paperwork: 422336, yessir: 4223, bribery: 0}, function() {}),
		new Goal("Lieutenant Governor", {effort: 57015324, paperwork: 570153, yessir: 5702, bribery: 0}, function() {}),
		new Goal("Governor", {effort: 76970687, paperwork: 769707, yessir: 7697, bribery: 0}, function() {}),
		new Goal("Senator", {effort: 103910427, paperwork: 1039104, yessir: 10391, bribery: 0}, function() {}),
		new Goal("Vice President", {effort: 140279076, paperwork: 1402791, yessir: 14028, bribery: 0}, function() {}),
		new Goal("President of the United States", {effort: 210418614, paperwork: 2104186, yessir: 21042, bribery: 0}, function() {}),
		new Goal("Nobel Peace Prize", {effort: 315627921, paperwork: 3156279, yessir: 31563, bribery: 0}, function() {}),
		new Goal("Head of United Nations", {effort: 473441882, paperwork: 4734419, yessir: 47344, bribery: 0}, function() {}),
		new Goal("President of the Western Hemisphere", {effort: 710162823, paperwork: 7101628, yessir: 71016, bribery: 0}, function() {fiveCol();}),
		new Goal("President of Earth", {effort: 1065244235, paperwork: 10652442, yessir: 106524, bribery: 1065}, function() {}),
		new Goal("The Greatest Human, Like, Ever", {effort: 1597866353, paperwork: 15978664, yessir: 159787, bribery: 1598}, function() {}),
		new Goal("President of the Solar System", {effort: 3627156621, paperwork: 36271566, yessir: 362716, bribery: 3627}, function() {}),
		new Goal("President of the Solar Interstellar Neighborhood", {effort: 8233645530, paperwork: 82336455, yessir: 823365, bribery: 8234}, function() {}),
		new Goal("President of the Milky Way Galaxy", {effort: 18690375353, paperwork: 186903754, yessir: 1869038, bribery: 18690}, function() {}),
		new Goal("President of the Local Galactic Group", {effort: 42427152051, paperwork: 424271521, yessir: 4242715, bribery: 42427}, function() {}),
		new Goal("President of the Virgo Supercluster", {effort: 99703807320, paperwork: 997038073, yessir: 9970381, bribery: 99704}, function() {}),
		new Goal("President of all Local Superclusters", {effort: 234303947202, paperwork: 2343039472, yessir: 23430395, bribery: 234304}, function() {}),
		new Goal("President of the Observable Universe", {effort: 550614275925, paperwork: 5506142759, yessir: 55061428, bribery: 550614}, function() {}),
		new Goal("President of Universe, Observable or Not", {effort: 1734434969164, paperwork: 17344349692, yessir: 173443497, bribery: 1734435}, function() {}),
		new Goal("President of The Multiverse", {effort: 5463470152867, paperwork: 54634701529, yessir: 546347015, bribery: 5463470}, function() {}),
		new Goal("President of Time", {effort: 17209930981531, paperwork: 172099309815, yessir: 1720993098, bribery: 17209931}, function() {}),
		new Goal("Vice God", {effort: 54211282591823, paperwork: 542112825918, yessir: 5421128259, bribery: 54211283}, function() {}),
		new Goal("God", {effort: 170765540164242, paperwork: 1707655401642, yessir: 17076554016, bribery: 170765540}, function() {}),
		new Goal("Ultra God", {effort: 537911451517362, paperwork: 5379114515174, yessir: 53791145152, bribery: 537911452}, function() {}),
		new Goal("The One", {effort: 1694421072279691, paperwork: 16944210722797, yessir: 169442107228, bribery: 1694421072}, function() {}),
		new Goal("Pretty Good Incremental Game Developer", {effort: 5337426377681028, paperwork: 53374263776810, yessir: 533742637768, bribery: 5337426378}, function() {}),
		new Goal("Awesome Game Developer", {effort: 16812893089695240, paperwork: 168128930896952, yessir: 1681289308970, bribery: 16812893090}, function() {}),
		new Goal("Creator of GetElected!", {effort: 52960613232540016, paperwork: 529606132325400, yessir: 5296061323254, bribery: 52960613233}, function() {}),
		new Goal("Nirvana", {effort: 166825931682501088, paperwork: 1668259316825011, yessir: 16682593168250, bribery: 166825931683}, function() {}),
		new Goal("Reincarnate - True Vote Hunter Mode", {effort: 525501684799878460, paperwork: 5255016847998786, yessir: 52550168479988, bribery: 525501684800}, function() {}),
		new Goal("TVHM Participation Award", {effort: 2000000000, paperwork: 2000000000, yessir: 2000000000, bribery: 2000000000}, function() {}),
		new Goal("TVHM Best Hand Turkey Drawer", {effort: 25000000000, paperwork: 25000000000, yessir: 25000000000, bribery: 25000000000}, function() {}),
		new Goal("TVHM Class Clown", {effort: 75000000000, paperwork: 75000000000, yessir: 75000000000, bribery: 75000000000}, function() {}),
		new Goal("TVHM Hall Monitor", {effort: 150000000000, paperwork: 150000000000, yessir: 150000000000, bribery: 150000000000}, function() {}),
		new Goal("TVHM Class Treasurer", {effort: 300000000000, paperwork: 300000000000, yessir: 300000000000, bribery: 300000000000}, function() {}),
		new Goal("TVHM Class Vice President", {effort: 600000000000, paperwork: 600000000000, yessir: 600000000000, bribery: 600000000000}, function() {}),
		new Goal("TVHM Class President", {effort: 1800000000000, paperwork: 1800000000000, yessir: 1800000000000, bribery: 1800000000000}, function() {}),
		new Goal("TVHM Prom Royalty", {effort: 3600000000000, paperwork: 3600000000000, yessir: 3600000000000, bribery: 3600000000000}, function() {}),
		new Goal("TVHM Sports Captain", {effort: 5800000000000, paperwork: 5800000000000, yessir: 5800000000000, bribery: 5800000000000}, function() {}),
		new Goal("TVHM Valedictorian", {effort: 10000000000000, paperwork: 10000000000000, yessir: 10000000000000, bribery: 10000000000000}, function() {}),
		new Goal("TVHM Summa Cum Laude", {effort: 16100000000000, paperwork: 16100000000000, yessir: 16100000000000, bribery: 16100000000000}, function() {}),
		new Goal("TVHM Fraternity Pledge", {effort: 23500000000000, paperwork: 23500000000000, yessir: 23500000000000, bribery: 23500000000000}, function() {}),
		new Goal("TVHM Fraternity Treasurer", {effort: 32000000000000, paperwork: 32000000000000, yessir: 32000000000000, bribery: 32000000000000}, function() {}),
		new Goal("TVHM Fraternity Vice President", {effort: 41300000000000, paperwork: 41300000000000, yessir: 41300000000000, bribery: 41300000000000}, function() {}),
		new Goal("TVHM Fraternity President", {effort: 52000000000000, paperwork: 52000000000000, yessir: 52000000000000, bribery: 52000000000000}, function() {}),
		new Goal("TVHM Inter-Fraternity Council President", {effort: 67200000000000, paperwork: 67200000000000, yessir: 67200000000000, bribery: 67200000000000}, function() {}),
		new Goal("TVHM Big Man On Campus", {effort: 85000000000000, paperwork: 85000000000000, yessir: 85000000000000, bribery: 85000000000000}, function() {}),
		new Goal("TVHM Fry Cook", {effort: 100000000000000, paperwork: 100000000000000, yessir: 100000000000000, bribery: 100000000000000}, function() {}),
		new Goal("TVHM Asst. Employee Of The Week", {effort: 128000000000000, paperwork: 128000000000000, yessir: 128000000000000, bribery: 128000000000000}, function() {}),
		new Goal("TVHM Employee Of The Week", {effort: 163840000000000, paperwork: 163840000000000, yessir: 163840000000000, bribery: 163840000000000}, function() {}),
		new Goal("TVHM Employee Of The Year", {effort: 209715000000000, paperwork: 209715000000000, yessir: 209715000000000, bribery: 209715000000000}, function() {}),
		new Goal("TVHM Assistant Assistant Manager", {effort: 268435000000000, paperwork: 268435000000000, yessir: 268435000000000, bribery: 268435000000000}, function() {}),
		new Goal("TVHM Assistant Manager", {effort: 343597000000000, paperwork: 343597000000000, yessir: 343597000000000, bribery: 343597000000000}, function() {}),
		new Goal("TVHM General Manager", {effort: 439804000000000, paperwork: 439804000000000, yessir: 439804000000000, bribery: 439804000000000}, function() {}),
		new Goal("TVHM District Manager", {effort: 562949000000000, paperwork: 562949000000000, yessir: 562949000000000, bribery: 562949000000000}, function() {}),
		new Goal("TVHM Teacher", {effort: 720575000000000, paperwork: 720575000000000, yessir: 720575000000000, bribery: 720575000000000}, function() {}),
		new Goal("TVHM Vice Principal", {effort: 922336000000000, paperwork: 922336000000000, yessir: 922336000000000, bribery: 922336000000000}, function() {}),
		new Goal("TVHM Principal", {effort: 1199037000000000, paperwork: 1199037000000000, yessir: 1199037000000000, bribery: 1199037000000000}, function() {}),
		new Goal("TVHM Professor", {effort: 1558748000000000, paperwork: 1558748000000000, yessir: 1558748000000000, bribery: 1558748000000000}, function() {}),
		new Goal("TVHM Dean of Students", {effort: 2026372000000000, paperwork: 2026372000000000, yessir: 2026372000000000, bribery: 2026372000000000}, function() {}),
		new Goal("TVHM PTA Treasurer", {effort: 2634284000000001, paperwork: 2634284000000001, yessir: 2634284000000001, bribery: 2634284000000001}, function() {}),
		new Goal("TVHM PTA Vice President", {effort: 3424569000000001, paperwork: 3424569000000001, yessir: 3424569000000001, bribery: 3424569000000001}, function() {}),
		new Goal("TVHM PTA President", {effort: 4451940000000001, paperwork: 4451940000000001, yessir: 4451940000000001, bribery: 4451940000000001}, function() {}),
		new Goal("TVHM City Council", {effort: 5787522000000002, paperwork: 5787522000000002, yessir: 5787522000000002, bribery: 5787522000000002}, function() {}),
		new Goal("TVHM Undersheriff", {effort: 7523779000000002, paperwork: 7523779000000002, yessir: 7523779000000002, bribery: 7523779000000002}, function() {}),
		new Goal("TVHM Sheriff", {effort: 9780913000000002, paperwork: 9780913000000002, yessir: 9780913000000002, bribery: 9780913000000002}, function() {}),
		new Goal("TVHM Deputy Mayor", {effort: 12715187000000002, paperwork: 12715187000000002, yessir: 12715187000000002, bribery: 12715187000000002}, function() {}),
		new Goal("TVHM Mayor", {effort: 17165502000000002, paperwork: 17165502000000002, yessir: 17165502000000002, bribery: 17165502000000002}, function() {}),
		new Goal("TVHM Chupacabra", {effort: 23173428000000004, paperwork: 23173428000000004, yessir: 23173428000000004, bribery: 23173428000000004}, function() {}),
		new Goal("TVHM Ruler of The Forests", {effort: 31284128000000004, paperwork: 31284128000000004, yessir: 31284128000000004, bribery: 31284128000000004}, function() {}),
		new Goal("TVHM Judge", {effort: 42233573000000008, paperwork: 42233573000000008, yessir: 42233573000000008, bribery: 42233573000000008}, function() {}),
		new Goal("TVHM Lieutenant Governor", {effort: 57015324000000008, paperwork: 57015324000000008, yessir: 57015324000000008, bribery: 57015324000000008}, function() {}),
		new Goal("TVHM Governor", {effort: 76970687000000016, paperwork: 76970687000000016, yessir: 76970687000000016, bribery: 76970687000000016}, function() {}),
		new Goal("TVHM Senator", {effort: 103910427000000016, paperwork: 103910427000000016, yessir: 103910427000000016, bribery: 103910427000000016}, function() {}),
		new Goal("TVHM Vice President", {effort: 140279076000000016, paperwork: 140279076000000016, yessir: 140279076000000016, bribery: 140279076000000016}, function() {}),
		new Goal("TVHM President of the United States", {effort: 210418614000000032, paperwork: 210418614000000032, yessir: 210418614000000032, bribery: 210418614000000032}, function() {}),
		new Goal("TVHM Nobel Peace Prize", {effort: 315627921000000060, paperwork: 315627921000000060, yessir: 315627921000000060, bribery: 315627921000000060}, function() {}),
		new Goal("TVHM Head of United Nations", {effort: 473441882000000060, paperwork: 473441882000000060, yessir: 473441882000000060, bribery: 473441882000000060}, function() {}),
		new Goal("TVHM President of the Western Hemisphere", {effort: 710162823000000130, paperwork: 710162823000000130, yessir: 710162823000000130, bribery: 710162823000000130}, function() {}),
		new Goal("TVHM President of Earth", {effort: 1065244235000000130, paperwork: 1065244235000000130, yessir: 1065244235000000130, bribery: 1065244235000000130}, function() {}),
		new Goal("TVHM The Greatest Human, Like, Ever", {effort: 1597866353000000260, paperwork: 1597866353000000260, yessir: 1597866353000000260, bribery: 1597866353000000260}, function() {}),
		new Goal("TVHM President of the Solar System", {effort: 3627156621000000500, paperwork: 3627156621000000500, yessir: 3627156621000000500, bribery: 3627156621000000500}, function() {}),
		new Goal("TVHM President of the Solar Interstellar Neighborhood", {effort: 8233645530000001000, paperwork: 8233645530000001000, yessir: 8233645530000001000, bribery: 8233645530000001000}, function() {}),
		new Goal("TVHM President of the Milky Way Galaxy", {effort: 18690375353000006000, paperwork: 18690375353000006000, yessir: 18690375353000006000, bribery: 18690375353000006000}, function() {}),
		new Goal("TVHM President of the Local Galactic Group", {effort: 42427152051000010000, paperwork: 42427152051000010000, yessir: 42427152051000010000, bribery: 42427152051000010000}, function() {}),
		new Goal("TVHM President of the Virgo Supercluster", {effort: 99703807320000020000, paperwork: 99703807320000020000, yessir: 99703807320000020000, bribery: 99703807320000020000}, function() {}),
		new Goal("TVHM President of all Local Superclusters", {effort: 234303947202000030000, paperwork: 234303947202000030000, yessir: 234303947202000030000, bribery: 234303947202000030000}, function() {}),
		new Goal("TVHM President of the Observable Universe", {effort: 550614275925000060000, paperwork: 550614275925000060000, yessir: 550614275925000060000, bribery: 550614275925000060000}, function() {}),
		new Goal("TVHM President of Universe, Observable or Not", {effort: 1734434969164000300000, paperwork: 1734434969164000300000, yessir: 1734434969164000300000, bribery: 1734434969164000300000}, function() {}),
		new Goal("TVHM President of The Multiverse", {effort: 5463470152867001000000, paperwork: 5463470152867001000000, yessir: 5463470152867001000000, bribery: 5463470152867001000000}, function() {}),
		new Goal("TVHM President of Time", {effort: 17209930981531003000000, paperwork: 17209930981531003000000, yessir: 17209930981531003000000, bribery: 17209930981531003000000}, function() {}),
		new Goal("TVHM Vice God", {effort: 54211282591823010000000, paperwork: 54211282591823010000000, yessir: 54211282591823010000000, bribery: 54211282591823010000000}, function() {}),
		new Goal("TVHM God", {effort: 170765540164242020000000, paperwork: 170765540164242020000000, yessir: 170765540164242020000000, bribery: 170765540164242020000000}, function() {}),
		new Goal("TVHM Ultra God", {effort: 537911451517362100000000, paperwork: 537911451517362100000000, yessir: 537911451517362100000000, bribery: 537911451517362100000000}, function() {}),
		new Goal("TVHM The One", {effort: 1694421072279691400000000, paperwork: 1694421072279691400000000, yessir: 1694421072279691400000000, bribery: 1694421072279691400000000}, function() {}),
		new Goal("TVHM Pretty Good Incremental Game Developer", {effort: 5337426377681029000000000, paperwork: 5337426377681029000000000, yessir: 5337426377681029000000000, bribery: 5337426377681029000000000}, function() {}),
		new Goal("TVHM Awesome Game Developer", {effort: 16812893089695242000000000, paperwork: 16812893089695242000000000, yessir: 16812893089695242000000000, bribery: 16812893089695242000000000}, function() {}),
		new Goal("TVHM Creator of GetElected!", {effort: 52960613232540020000000000, paperwork: 52960613232540020000000000, yessir: 52960613232540020000000000, bribery: 52960613232540020000000000}, function() {}),
		new Goal("TVHM Nirvana", {effort: 166825931682501100000000000, paperwork: 166825931682501100000000000, yessir: 166825931682501100000000000, bribery: 166825931682501100000000000}, function() {}),
		new Goal("Kill Screen", {effort: 166826123942950600000000000000, paperwork: 166826123942950600000000000000, yessir: 166826123942950600000000000000, bribery: 166826123942950600000000000000}, function() {})
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
	
	addThePowerUps();
	
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