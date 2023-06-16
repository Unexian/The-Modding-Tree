let modInfo = {
	name: "The numerical Tree",
	id: "+*^",
	author: "Nif",
	pointsName: "increments",
	modFiles: ["layers/additive.js", "layers/multiplicative.js", "layers/exponentiative.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Incrementing increments of increments",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Added additive, multiplicative, and exponentiative.<br>
		- Added additive upgrades and exponentiative challenges.<br>
		- Did some rebalancing.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = buyableEffect("+", 11)
	gain = gain.mul(upgradeEffect("+", 11))
	gain = gain.mul(buyableEffect("*", 11))
	gain = gain.pow(buyableEffect("^", 11))

	if (inChallenge("^", 11)) {gain = gain.add(1).log(player["^"].resetTime.add(1).log10().add(2))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone("^", 6)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}