var flags = {
	list: {},
	resetAll: function() {
		for(var i in this.list) {
			this.list[i] = 0;
		}
	},
	flag:	function(id, val) {
		if(val && val !== "") {
			this.list[id] = val;
		}
		return this.list[id] || 0;
	}
}