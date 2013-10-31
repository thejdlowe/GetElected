var paperwork = "According to Chapter One, Sub-Chapter Eight, Paragraph Four, Line Two, upon entering what will be hereby forever known forever in the forever as \"The Monkey Pit\", " +
"items purchased within or within a 3.14 foot proximity of a man what will be hereby forever known forever in the forever as \"Gerald\" cannot, will not, should not, and of not to be " +
"returned to \"The Monkey Pit\" unless the transaction is witnessed by a gregarious goat on a Monday whose date is divisible by the numbers hereby forever known forever in the forever as " +
"\"Five,\" \"Eleven,\" and \"Rambledoosh.\" Any attempts made by the person referred to in Chapter Five, Sub-Chapter Seventy Seven, Paragraph One, Sentence One as \"Steve\" to undo, redo, " +
"anddo, fordo, forgo, fortnight, A Hard Day's Night, The Dark Knight, or anyone else who looks funny will immediately render everything in this chapter moot and will invoke martial law upon " +
"the wetlands of Notre Dame.";

//wrapText care of http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/

/*
function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
		line = testLine;
		}
	}
	context.fillText(line, x, y);
}
*/