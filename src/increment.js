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