var resizelists = {
	"#effortTarget": ["#effortPrimary","#effortSecondary","#effortTertiary"],
	"#paperworkTarget": ["#paperworkPrimary","#paperworkSecondary","#paperworkTertiary"],
	"#yessirTarget": ["#yessirPrimary","#yessirSecondary","#yessirTertiary"],
	"#pastGoalsTarget": ["#pastGoals"]
}

var resizer = function() {
	for(var i in resizelists) {
		var currList = resizelists[i].join(",");
		$(currList).each(function() {
			if($(this).attr("id") === "pastGoals") {
				//console.log($(this).parent().height() + " " + $("#game").height());
				$(this).css("height", ($(this).parent().height() - $(i).offset().top - $("#navbar").height()) + "px");
			}
			else $(this).css("height", ($("#game").height() - $(i).offset().top - $("#navbar").height()) + "px");
			//$(this).css("height", ($(i).parent().height() - $(i).offset().top + $("#navbar").height()) + "px");
		});
		//$(currList).perfectScrollbar("update");
	}
}