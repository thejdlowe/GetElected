/*
	Functions ONLY having to deal with interest.
*/


var compInt = function(base, times) {
	return Math.floor(base * Math.pow(1+interest, times));
}

var reverseCompInt = function(base, times) {
	return Math.floor(base / Math.pow(1+interest, times));
}