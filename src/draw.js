var Draw = function() {
	for(var i in powerups) {
		$("#" + i + " span").html(powerupsfuncs[i]["description"]());
		if($("#" + i).length) {
			$("#" + i + "_pre").html("" + powerups[i]);
			var func = powerupsfuncs[i];
			var effortVal = compInt(func["cost"].effort, powerups[i]), paperworkVal = compInt(func["cost"].paperwork, powerups[i]), yessirVal = compInt(func["cost"].yessir, powerups[i]);
			if(efforttally >= effortVal &&
				paperworktally >= paperworkVal &&
				yessirtally >= yessirVal) {
					$("#" + i).addClass("canPurchase").removeClass("cannotPurchase").attr("title", "Click to buy one");
			}
			else $("#" + i).removeClass("canPurchase").addClass("cannotPurchase").attr("title", "Cannot afford at this time");
			
			var q = $("#" + i + "_q");
			var html = "";
			html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(effortVal.toFixed(0)) : "") + " ";
			html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(paperworkVal.toFixed(0)) : "") + " ";
			html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(yessirVal.toFixed(0)) : "");
			q.html(html);
		}
	}
	$("#efforttally").html(numberWithCommas((Math.floor(efforttally * 10) / 10).toFixed(1)) + "&nbsp;Effort");
	$("#paperworktally").html(numberWithCommas((Math.floor(paperworktally * 10) / 10).toFixed(1)) + "&nbsp;Paperwork");
	$("#yessirtally").html(numberWithCommas((Math.floor(yessirtally * 10) / 10).toFixed(1)) + "&nbsp;Yes,&nbsp;Sir!");
	$("#effortpersec").html(numberWithCommas(eps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
	$("#paperworkpersec").html(numberWithCommas(pps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
	$("#yessirpersec").html(numberWithCommas(yps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
	$("#totalEffortClicks").html(totalEffortClicks);
	$("#totalEffortGained").html(totalEffortGained);
	$("#totalPaperworkWiggles").html(totalPaperworkWiggles);
	$("#totalYessirScrolls").html(totalYessirScrolls);
	$("#totalRestart").html(totalRestart);
	$("#startDate").html((new Date(startDate)).toLocaleString());
}