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
		//return;
	}
	
	if(!canvas.getContext) {
		$("#nosupport").html("Your browser does not support the HTML5 functionality of \"Canvas.\" Some images may appear weird.");
	}

	function todo(context, text, fontSize, fontColor) {
		var max_width  = 600;
		var fontSize   =  12;
		var lines      =  new Array();
		var width = 0, i, j;
		var result;
		var color = fontColor || "white";
		var font = '22px "Special Elite", cursive';
		// Font and size is required for context.measureText()
		 context.font = font

		
		// Start calculation
		while ( text.length ) {
			for( i=text.length; context.measureText(text.substr(0,i)).width > max_width; i-- );
		
			result = text.substr(0,i);
		
			if ( i !== text.length )
				for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
			
			lines.push( result.substr(0, j|| result.length) );
			width = Math.max( width, context.measureText(lines[ lines.length-1 ]).width );
			text  = text.substr( lines[ lines.length-1 ].length, text.length );
		}
		
		
		// Calculate canvas size, add margin
		context.canvas.width  = 14 + width;
		context.canvas.height =  8 + ( fontSize + 5 ) * lines.length;
		context.font   = font;

		// Render
		context.fillStyle = color;
		for ( i=0, j=lines.length; i<j; ++i ) {
			context.fillText( lines[i], 8, 5 + fontSize + (fontSize+5) * i );
		}
		
		var x = getRandomInt(0, context.canvas.width - 200);
		var y = getRandomInt(0, context.canvas.height - 200);
		var data = context.getImageData(x, y, 200, 200);
		var canv2 = document.createElement("canvas");
		canv2.width = 200;
		canv2.height = 200;
		var context2 = canv2.getContext("2d");
		context2.putImageData(data, 0, 0);
		
		var img = canv2.toDataURL();
		document.getElementById("paperworker").style.backgroundImage = "url(" + img + ")";
		finishLoader("paperworker");
	}
	
	try {
		/*addLoader("paperworker");
		var ctx    = canvas.getContext('2d');
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'http://fonts.googleapis.com/css?family=Special+Elite';
		document.getElementsByTagName('head')[0].appendChild(link);

		// Trick from http://stackoverflow.com/questions/2635814/
		var image = new Image;
		image.src = link.href;
		image.onerror = function() {
			setTimeout(function() {
				todo(ctx, paperwork, 12, "black");
			}, 1000);
		}
		*/
		
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
		Initialize()();
	}
	
	checkLoad();
}

$(document).ready(preLoad);