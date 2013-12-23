var randomCreate = function(pre) {	//if it gets pre passed to it, then it's not random
	clearTimeout(randSpawnTimer);	//JUUUUST in case.
	var life = 1000 * 15;		//Life will last fifteen seconds. SO MACABRE.
	var width = height = 200;	//it will be 200 pixels in size.
	var x = 0;
	var y = 0;
	var myrand = $("<div>");
	myrand.addClass("random");
	$("body").append(myrand);
	
	x = getRandomInt(0, $("#game").width() - width);
	y = getRandomInt($("#game").offset().top, ($("#game").height() + $("#game").offset().top) - height);
	myrand.css({"top": y + "px", "left": x + "px"});
	myrand.fadeIn(5000);
	
	pre = pre || "";
	
	myrand.click(function(e) {
		clearTimeout(randTimer);
		$(this).remove();
		if(pre === "firstone") {
			flags.flag("multiplier", 2);
			recalculate();
			setTimeout(function() {
				flags.flag("multiplier", 1);
				recalculate();
			}, 1000 * 60);
			html = "First One's Free: Resource generation 2x for 60 seconds";
		}
		else if(holiday && holiday === true) {
			incrementEffort(efforttally * .02);
			incrementPaperwork(paperworktally * .02);
			incrementYessir(yessirtally * .02);
			incrementBribery(briberytally * .02);
			html = "Happy Holidays: +2% all resources";
		}
		else {
			/*
				Possible results:
					caucus:			+10% of all resources (one time)
					gridlock:		all resource generating halved for 60 seconds
					landslide:		8x resource generating for 30 seconds
					lameduck:		-10% of all resources (one time)
			*/
			var results = ["caucus", "gridlock", "landslide", "lameduck"];
			var weight = [0.50, 0.05, 0.05, 0.10];
			
			//weighted random from http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
			
			var weighed_list = [];

			// Loop over weights
			for (var i = 0; i < weight.length; i++) {
				var multiples = weight[i] * 100;

				// Loop over the list of items
				for (var j = 0; j < multiples; j++) {
					weighed_list.push(results[i]);
				}
			}
			var index = getRandomInt(0, weighed_list.length - 1);
			var lucky = weighed_list[index];
			var html = "";
			if(lucky === "caucus") {
				incrementEffort(efforttally * .1);
				incrementPaperwork(paperworktally * .1);
				incrementYessir(yessirtally * .1);
				incrementBribery(briberytally * .1);
				html = "Caucus: +10% all resources";
			}
			else if(lucky === "gridlock") {
				flags.flag("multiplier", 0.5);
				recalculate();
				setTimeout(function() {
					flags.flag("multiplier", 1);
					recalculate();
				}, 1000 * 60);
				html = "Gridlock: Resource generation halved for one minute";
			}
			else if(lucky === "landslide") {
				flags.flag("multiplier", 8);
				recalculate();
				setTimeout(function() {
					flags.flag("multiplier", 1);
					recalculate();
				}, 1000 * 30);
				html = "Landslide: Resource generation 8x for 30 seconds";
			}
			else if(lucky === "lameduck") {
				incrementEffort(-efforttally * .1);
				incrementPaperwork(-paperworktally * .1);
				incrementYessir(-yessirtally * .1);
				incrementBribery(-briberytally * .1);
				html = "Lame Duck: -10% all resources";
			}
		}
		log(html);
		randomSpawn();
	});
	var randTimer = setTimeout(function() {
		myrand.fadeOut(5000, function() {
			$(this).remove();
			randomSpawn();
		});
	}, life);
}

var randomSpawn = function() {
	var oneMinute = 1000 * 60;	//Just...just to keep typing down. Yeah.
	var min = 3;
	var max = 7;
	var result = getRandomInt(min, max);
	console.log("Next random spawn in " + result + " minutes. You're welcome.");
	randSpawnTimer = setTimeout(randomCreate, result * oneMinute);
}

window.randomCreate = randomCreate;