var loadList = {};

var addLoader = function(id) {
	loadList[id] = false;
}

var finishLoader = function(id) {
	loadList[id] = true;
}

var checkLoad = function() {
	var loaded = true;
	var val = 0;
	var len = 0;
	for(var i in loadList) {
		len++;
		if(loadList[i] === false) loaded = false;
		else val++;
	}
	val = (val / len) * 100;
	document.getElementById("progress").value = val;
	$("#progressPercent").html(val.toFixed(1));
	$("#fps").html(version);
	if(loaded === false) setTimeout(checkLoad, 1000/fps);
	else { 
		Initialize();
	}
}

var preLoad = function() {
	//Function care of http://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
	function supports_html5_storage() {
		try {
			localStorage.setItem("test", "test");
			localStorage.removeItem("test");
			return true;
		} catch (e) {
			return false;
		}
	}
	
	var canvas = document.createElement('canvas');
	
	if(!supports_html5_storage()) {
		$("#nosupport").html($("#nosupport").html() + "<br/>Your browser does not support the HTML5 functionality of \"Local Storage.\" Saving may not work for you. Please make sure you are using an up to date browser and that cookies are enabled.");
	}
	
	if(!canvas.getContext) {
		$("#nosupport").html("Your browser does not support the HTML5 functionality of \"Canvas.\" Some images may appear weird.");
	}
	
	try {
		addLoader("paperworker");
		var image = new Image();
		image.onload = function() {
			var x = getRandomInt(0, this.width - 200);
			var y = getRandomInt(0, this.height - 200);
			$("#paperworker").css({"background-image": "url(" + this.src + ")", "background-position": x + "px " + y + "px"});
			finishLoader("paperworker");
		}
		image.src = "images/paperwork.png";
		
		addLoader("yessir");
		var img = new Image;
		img.src = "images/yessir.png";
		img.onload = function() {
			finishLoader("yessir");
		}
	}
	catch(e) {
		finishLoader("paperworker");
		finishLoader("yessir");
		Initialize();
	}
	
	checkLoad();
}

$(document).ready(preLoad);