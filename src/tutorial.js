var Tutorial = function() {
	try {
		if(!localStorage.save) {
			var overlay = $("<div>");
			overlay.css({"position": "absolute", "display": "none", "width": "100%", "height": "100%", "top": "0", "left": "0", "background": "rgba(0,0,0,0.3)", "z-index": "99998"});
			$("body").append(overlay);
			var act = $("#tutorial").clone();
			overlay.append(act);
			act.show().css({"position": "absolute", "width": "20%", "bottom": "40px", "right": 0});
			var button = $("<button>");
			button.html("Close Tutorial").click(function() {
				$(overlay).remove();
				randomCreate("firstone");	//Yep. First one's free.
			});
			act.append(button);
			overlay.fadeIn(300);
		}
	}
	catch(e) {
	}
};