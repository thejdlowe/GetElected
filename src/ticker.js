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