addLayer("+", {
    name: "Additive", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "+", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        auto: false
    }},
    doReset(resettingLayer) {
        if (tmp[resettingLayer].row == tmp[this.layer].row) return
        layerDataReset(this.layer, ["milestones", "auto"])
        if (hasMilestone("*", 1)) {addBuyables(this.layer, 11, 1)}
    },
    color: "#4BDC13",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "additive points", // Name of prestige currency
    baseResource: "increments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult.mul(tmp["*"].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        return buyableEffect("*", 12).div(100)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "a: Reset for additive points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate() {
        if (hasMilestone("*", 3) && player[this.layer].auto) {
            buyBuyable('+', 11)
        }
    },
    milestones: {
        1: {
            requirementDescription: "5 additive boosts",
            effectDescription: "Unlock some upgrades",
            done() {return getBuyableAmount(this.layer, 11).gte(5)}
        },
        2: {
            requirementDescription: "35 additive boosts",
            effectDescription: "Unlock a new layer",
            done() {return getBuyableAmount(this.layer, 11).gte(35)}
        },
    },
    buyables: {
        11: {
            title: "Additive boost",
            display() {
                return "Increases base point gain by one per purchase<br><br>Times bought: "
                    + getBuyableAmount(this.layer, 11).toString()
                    + "<br>Cost: "
                    + this.cost().toString()
                    + " additive points<br>Effect: "
                    + this.effectDisplay()
            },
            cost(x = getBuyableAmount(this.layer, 11)) {
                if (hasUpgrade(this.layer, 12)) {
                    return x.div(3).mul(2).floor().add(1)
                } else {
                    return x.add(1)
                }
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, 11).sub(1)))
                addBuyables(this.layer, 11, 1)
            },
            effect() {
                return getBuyableAmount(this.layer, 11).mul(upgradeEffect("+", 11)).mul(hasChallenge("^", 11) ? 3 : 1)
            },
            effectDisplay() {
                return this.effect().toString() + " points per second"
            }
        }
    },
    upgrades: {
        11: {
            title: "Increase the increase",
            description: "Boost additive boosts 2x",
            cost: 3,
            unlocked() { return hasMilestone(this.layer, 1) },
            effect() { return hasUpgrade(this.layer, this.id) ? 2 : 1 }
        },
        12: {
            title: "Descaling",
            description: "Multiply additive boost costs by 2/3, rounded down",
            cost: 10,
            unlocked() { return hasUpgrade(this.layer, 11) }
        },
        13: {
            title: "Self-boosting",
            description: "Increments boost themselves",
            cost: 20,
            unlocked() { return hasUpgrade(this.layer, 12) },
            effect() { return hasUpgrade(this.layer, this.id) ? player.points.add(1).log(1000).add(1) : 1 },
            tooltip: "Formula: x=x(logp<sub>1000</sub>(x)+1)"
        },
    },
    layerShown(){return true}
})
