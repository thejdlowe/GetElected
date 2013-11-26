var log = function(str) {
	var newLog = $("<div>");
	newLog.addClass("log").html(str);
	$("body").append(newLog);
	newLog.css({"position": "absolute", "bottom": "0px", "left": "50%", "z-index": "999000", "opacity": "0"});
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