var Import = function() {
	try {
		var s = prompt("Please paste your exported data below and click OK", "");
		
		if(s && s !== "") {
			if(s.split("{!}").length > 1) {
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
			}
			else {
				var str = LZString.decompressFromBase64(s);
				var obj = JSON.parse(str);
				if(obj["efforttally"]) {
					Save(str);
				}
				else {
					throw "Invalid save data";
					return;
				}
			}
			Load();
			updatePastGoals();
			updateCurrentGoals();
		}
		else throw "Invalid save data";
		
		
		/* && s.split("{!}").length > 1) {
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
		else return alert("Invalid save data");*/
		
	}
	catch (e) {
		if (typeof e === "string") {
				alert(e);
		}
		else {
				alert("Invalid save data");
		}
	}
}