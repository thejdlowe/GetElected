var Export = function() {
	try {
		var s = localStorage.save || "";
		
		/*for(var i in localStorage) {
			s += i + "{;}" + localStorage[i] + "{!}";
		}*/
		
		prompt("Please copy and paste the below text", s);
	}
	catch(e) {
	}
}