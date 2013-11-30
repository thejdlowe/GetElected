var log = function(str) {
	var newLog = $("<div>");
	newLog.addClass("log").html(str);
	$("body").append(newLog);
	newLog.css({"position": "absolute", "bottom": "0px", "left": "50%", "z-index": "999000", "opacity": "0", "margin": "0 0 0 -" + (newLog.width() / 2) + "px"});
	//"margin": "-" + (myAlert.height() / 2) + "px 0 0 -" +(myAlert.width() / 2) + "px"
	$(".log").each(function() {
		$(this).animate({bottom: "+=" + $(this).height()}, 500);
	});
	newLog.animate(
		{opacity: 1},
		{duration: 1000, queue: false, complete: function() {
			var obj = this;
			setTimeout(function() {
				$(obj).animate(
					{bottom: "+=" + $(obj).height(), opacity: 0},
					{duration: 1000, complete: function() {
							$(this).remove();
						}
					}
				);
			}, 5000);
		}
	});
}