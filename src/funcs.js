/*
	Generic functions.
*/
var twoCol = function() {
	$("#col1").animate({"width": "75%"}, 500, function(){});
	$("#col2").hide();
	$("#col3").hide();
	$("#col4").hide();
}

var threeCol = function() {
	$("#col1").animate({"width": "35%"}, 500, function(){});
	$("#col2").animate({"width": "40%", "left": "35%"}, 500, function(){});
	$("#col2").show();
	$("#col3").hide();
	$("#col4").hide();
}

var fourCol = function() {
	$("#col1").animate({"width": "25%"}, 500, function(){});
	$("#col2").animate({"width": "25%", "left": "25%"}, 500, function(){});
	$("#col3").animate({"width": "25%", "left": "50%"}, 500, function(){});
	$("#col2").show();
	$("#col3").show();
	$("#col4").hide();
}

var fiveCol = function() {
	$("#col1").animate({"width": "20%"}, 500, function(){});
	$("#col2").animate({"width": "20%", "left": "20%"}, 500, function(){});
	$("#col3").animate({"width": "20%", "left": "40%"}, 500, function(){});
	$("#col4").animate({"width": "20%", "left": "60%"}, 500, function(){});
	$("#col2").show();
	$("#col3").show();
	$("#col4").show();
}

//function from http://stackoverflow.com/a/10899795/1644838
/*
	http://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
*/
var numberWithCommas = function(number) {
	var numberA = $("#numberA").val();
	var decPlaces, abbrev;
	if(numberA === "low") {
		// 2 decimal places => 100, 3 => 1000, etc
		decPlaces = 6;
		decPlaces = Math.pow(10,decPlaces);

		// Enumerate number abbreviations
		abbrev = [ "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion" ];

		// Go through the array backwards, so we do the largest first
		for (var i=abbrev.length-1; i>=0; i--) {

			// Convert array index to "1000", "1000000", etc
			var size = Math.pow(10,(i+1)*3);

			// If the number is bigger or equal do the abbreviation
			if(size <= number) {
				 // Here, we multiply by decPlaces, round, and then divide by decPlaces.
				 // This gives us nice rounding to a particular decimal place.
				 number = Math.round(number*decPlaces/size)/decPlaces;

				 // Handle special case where we round up to the next abbreviation
				 if((number == 1000) && (i < abbrev.length - 1)) {
					 number = 1;
					 i++;
				 }

				 // Add the letter for the abbreviation
				 number += "&nbsp;" + abbrev[i];

				 // We are done... stop
				 break;
			}
		}

		return number;
	}
	else if(numberA === "medium") {
		// 2 decimal places => 100, 3 => 1000, etc
		decPlaces = 3;
		decPlaces = Math.pow(10,decPlaces);

		// Enumerate number abbreviations
		abbrev = [ "k", "M", "G", "T", "P", "E", "Z", "Y"];

		// Go through the array backwards, so we do the largest first
		for (var i=abbrev.length-1; i>=0; i--) {

			// Convert array index to "1000", "1000000", etc
			var size = Math.pow(10,(i+1)*3);

			// If the number is bigger or equal do the abbreviation
			if(size <= number) {
				 // Here, we multiply by decPlaces, round, and then divide by decPlaces.
				 // This gives us nice rounding to a particular decimal place.
				 number = Math.round(number*decPlaces/size)/decPlaces;

				 // Handle special case where we round up to the next abbreviation
				 if((number == 1000) && (i < abbrev.length - 1)) {
					 number = 1;
					 i++;
				 }

				 // Add the letter for the abbreviation
				 number += "&nbsp;" + abbrev[i];

				 // We are done... stop
				 break;
			}
		}

		return number;
	}
	else if(numberA === "high") {
		return Number(number).toExponential(3);
	}
	else {
		var parts=number.toString().split(".");
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	}
}

var randString = function(len, charSet) {
	charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}