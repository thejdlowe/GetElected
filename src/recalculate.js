
var recalculate = function() {
	eps = pps = yps = 0;
	for(var i in powerups) {
		if(powerups[i] > 0) {
			var results = powerupsfuncs[i]["func"](powerups[i]);
			eps += results["effort"];
			pps += results["paperwork"];
			yps += results["yessir"];
		}
	}
	eps *= flags.flag("multiplier");
	pps *= flags.flag("multiplier");
	yps *= flags.flag("multiplier");
}