function twoCol() {
	$("#col1").animate({"width": "75%"}, 500, function(){});
	$("#col2").hide();
	$("#col3").hide();
}

function threeCol() {
	$("#col1").animate({"width": "35%"}, 500, function(){});
	$("#col2").animate({"width": "42%", "left": "35%"}, 500, function(){});
	$("#col2").show();
	$("#col3").hide();
}

function fourCol() {
	$("#col1").animate({"width": "25%"}, 500, function(){});
	$("#col2").animate({"width": "25%", "left": "25%"}, 500, function(){});
	$("#col3").animate({"width": "25%", "left": "50%"}, 500, function(){});
	$("#col2").show();
	$("#col3").show();
}

//function from http://stackoverflow.com/a/10899795/1644838
function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function randString(len, charSet) {
	charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}