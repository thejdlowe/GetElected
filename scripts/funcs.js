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