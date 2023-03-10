let modInfo = {
	name: "The omega tree",
	id: "omega",
	author: "Nif",
	pointsName: "points",
	modFiles: ["layers/alpha.js", "layers/beta.js", "layers/gamma.js", "layers/delta.js", "layers/epsilon.js", "layers/zeta.js", "layers_2/aleph.js","tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "The second row",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2</h3><br>
		- Added layers δ and ζ.<br>- Added placeholders for ε and א.<br>- Fixed some jank with some upgrades.
	<h3>v0.1</h3><br>
		- Added layers α, β, and γ.<br>`

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

	let gain = player.a.power.div(5)
	if (hasUpgrade('a', 11)) gain = gain.mul(1.1)
	gain = gain.mul(player.b.power.div(5).add(1))
	if (hasUpgrade('b', 11)) gain = gain.mul(1.5)
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
	return (getBuyableAmount('g', 22) >= 1) || (getBuyableAmount('b', 22) >= 1)
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