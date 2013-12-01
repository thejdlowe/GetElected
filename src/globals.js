var version = "0.0.3";
var currNotes = "";
var efforttally = paperworktally = yessirtally = currentGoalIndex = 0;
var scrollerBase = 10;	//An arbitrary number; this is where the (hidden) scroll bar will lock itself on scroll for the Yes Sir section.
var scrollStatus = "";
var fps = 5;
var lastEffort = 0;
var efforttoggle = 1;
var totalEffortClicks = 0;
var totalEffortGained = 0;
var totalPaperworkWiggles = 0;
var totalYessirScrolls = 0;
var totalRestart = 0;
var startDate = 0;
var randSpawnTimer = null;
var autogoal = false;
var interest = 0.27;	//Be sure to tip your costs, and drive home safe!
var missedFrames = 0;	//How many frames are missed due to latency / the window not being in focus
var goals = [];
var powerups = {};			//this is the one that will be saved! THIS ONE! It will contain an id, and the number of how many of each power up the player has.
var powerupsfuncs = {};		//this is what will hold the id of the powerup, the cost(s?), the label, what section it goes to, and the function that will execute every frame during Game.Update().
var eps = pps = yps = 0;
var lastRun = null;