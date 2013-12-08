var testing = true;
var incrementEffort = function(num) {
	efforttally += num;
	totalEffortGained += num;
	totalEffortGained = Math.round(totalEffortGained);
	if(efforttally <= 0) {
		efforttally = 0;
	}
}
var incrementPaperwork = function(num) {
	paperworktally += num;
	if(paperworktally <= 0) {
		paperworktally = 0;
	}
}
var incrementYessir = function(num) {
	yessirtally += num;
	if(yessirtally <= 0) {
		yessirtally = 0;
	}
}

var incrementBribery = function(num) {
	briberytally += num;
	if(briberytally <= 0) {
		briberytally = 0;
	}
}

if(testing === true) {
	window.incrementEffort = incrementEffort;
	window.incrementPaperwork = incrementPaperwork;
	window.incrementYessir = incrementYessir;
	window.incrementBribery = incrementBribery;
}