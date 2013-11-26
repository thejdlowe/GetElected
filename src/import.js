var Import = function() {
	try {
		var s = prompt("Please paste your exported data below and click OK", "");
		
		if(s && s !== "" && s.split("{!}").length > 1) {
			var objs = s.split("{!}");
			for(var i = 0;i<objs.length;i++) {
				var obj = objs[i];
				if(obj.split("{;}").length > 1) {
					var key = obj.split("{;}")[0];
					var val = obj.split("{;}")[1];
					if(val === "true" || val === "false") localStorage[key] = Boolean(val);
					else localStorage[key] = Math.round(parseFloat(val));
				}
			}
			Load();
			updatePastGoals();
			updateCurrentGoals();
		}
		else return alert("Invalid save data");
		
	}
	catch(e) {
	}
}