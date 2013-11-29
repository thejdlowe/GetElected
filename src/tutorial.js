var Tutorial = function() {
	try {
		if(!localStorage.save) {
			alert("Success");
			var overlay = $("<div>");
			overlay.css({"position": "absolute", "display": "none", "width": "100%", "height": "100%", "top": "0", "left": "0", "background": "rgba(0,0,0,0.3)", "z-index": "99998"});
			$("body").append(overlay);
			//randomCreate("firstone");	//Yep. First one's free.
			var actualTutorial = $("#tutorial").clone();
			overlay.append(actualTutorial);
			//actualTutorial.attr("id", "tutorial");
			overlay.fadeIn(300);
		}
	}
	catch(e) {
	}
}