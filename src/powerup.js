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

var listPowerUp = function(id) {
	if($("#" + id).length === 0) {
		var func = powerupsfuncs[id];
		var target = $("#" + func["section"]);
		var li = $("<li>");
		li.attr("id", id);
		li.html(func["label"]);
		target.append(li);
		var q = $("<q>");
		var html = "";
		html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
		html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
		html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
		html += (func["cost"].bribery !== 0 ? "Bribery: " + numberWithCommas(compInt(func["cost"].bribery, powerups[id]).toFixed(0)) : "");
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
				var effortVal = compInt(func["cost"].effort, powerups[id]), paperworkVal = compInt(func["cost"].paperwork, powerups[id]), yessirVal = compInt(func["cost"].yessir, powerups[id]);
				efforttally += (effortVal * 0.5);
				paperworktally += (paperworkVal * 0.5);
				yessirtally  += (yessirVal * 0.5);
				var q = $("#" + id + "_q");
				var html = "";
				html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
				html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
				html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
				
				q.html(html);
				var pre = $("#" + id + "_pre");
				pre.html("Total: " + powerups[id]);
				if(func["sell"] !== null) func["sell"]();
			}
		});*/
		li.click(function(goal, id) {
			return function() {
				var effortVal = compInt(func["cost"].effort, powerups[id]),
					paperworkVal = compInt(func["cost"].paperwork, powerups[id]),
					yessirVal = compInt(func["cost"].yessir, powerups[id]),
					briberyVal = compInt(func["cost"].bribery, powerups[id]);
				if(efforttally >= effortVal &&
					paperworktally >= paperworkVal &&
					yessirtally >= yessirVal &&
					briberytally >= briberyVal) {
						if(func["onetime"] === true && powerups[id] > 0) return;
						powerups[id]++;
						efforttally -= effortVal;
						paperworktally -= paperworkVal;
						yessirtally -= yessirVal;
						briberytally -= briberyVal;
						var q = $("#" + id + "_q");
						var html = "";
						html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
						html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
						html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
						html += (func["cost"].bribery !== 0 ? "Bribery: " + numberWithCommas(compInt(func["cost"].bribery, powerups[id]).toFixed(0)) : "");
						q.html(html);
						var pre = $("#" + id + "_pre");
						pre.html("" + powerups[id]);
						recalculate();
				}
			}
		}(func, id));
		var label = $("<span>");
		label.html(func["description"]());
		label.css({"position": "absolute", "right": "3px", "top": "3px", "font-size": "10px"});
		li.append(label);
		//li.tooltip({track: true});
	}
}
/*
	temporary function. Will not be permanent once game is in beta.
*/
var buildPows = function() {
	var targs = ["#effortPrimary","#effortSecondary","#effortTertiary",
		"#paperworkPrimary","#paperworkSecondary","#paperworkTertiary",
		"#yessirPrimary","#yessirSecondary","#yessirTertiary",
		"#briberyPrimary","#briberySecondary","#briberyTertiary"].join(",");
	$(targs).empty();
	listPowerUp("grindstone");	listPowerUp("back");	listPowerUp("pain");	listPowerUp("mile");	listPowerUp("believe");
	listPowerUp("stranger");	listPowerUp("perfectstrangers");	listPowerUp("perfectstrangers2");		
	listPowerUp("acquaintance");	listPowerUp("gettingtoknowyou");	listPowerUp("gettingtoknowallaboutyou");		
	listPowerUp("friend");	listPowerUp("joey");	listPowerUp("chandler");		
	listPowerUp("bro");	listPowerUp("budlight");	listPowerUp("collar");		
	listPowerUp("bestfriend");	listPowerUp("pizza");	listPowerUp("hideabody");		
	listPowerUp("bff");	listPowerUp("idkmbffj");	listPowerUp("instantgram");		
	listPowerUp("personallawyer");	listPowerUp("objection");	listPowerUp("takethat");		
	listPowerUp("sigother");	listPowerUp("cohabitate");	listPowerUp("cosign");		
	listPowerUp("superpac");	listPowerUp("babypac");	listPowerUp("mspac");		
	listPowerUp("staples");	listPowerUp("paperclips");	listPowerUp("paperbinders");		
	listPowerUp("pencil");	listPowerUp("sharpenedPencil");	listPowerUp("mechanicalpencil");		
	listPowerUp("pen");	listPowerUp("moreink");	listPowerUp("cyberpen");		
	listPowerUp("typewriter");	listPowerUp("wordprocessor");	listPowerUp("talktotext");		
	listPowerUp("printer");	listPowerUp("laserprinter");	listPowerUp("threeinone");		
	listPowerUp("altavista");	listPowerUp("lycos");	listPowerUp("compuserve");		
	listPowerUp("orphans");	listPowerUp("gruel");	listPowerUp("posters");		
	listPowerUp("robots");	listPowerUp("laserguns");	listPowerUp("sentience");		
	listPowerUp("unicron");	listPowerUp("matrix");	listPowerUp("disc");		
	listPowerUp("tippiecanoe");	listPowerUp("tyler");	listPowerUp("harrison");		
	listPowerUp("harry");	listPowerUp("barkley");	listPowerUp("truman");		
	listPowerUp("ike");	listPowerUp("nixon");	listPowerUp("eisenhower");		
	listPowerUp("great");	listPowerUp("johnson");	listPowerUp("kennedy");		
	listPowerUp("taxes");	listPowerUp("quayle");	listPowerUp("bush");		
	listPowerUp("timeforchange");	listPowerUp("gore");	listPowerUp("clinton");		
	listPowerUp("change");	listPowerUp("biden");	listPowerUp("obama");		
	listPowerUp("handsacrossamerica");	listPowerUp("morelube");	listPowerUp("chickenmeanscock");		
	listPowerUp("morelies");	listPowerUp("jobs");	listPowerUp("hungryhungry");		
}