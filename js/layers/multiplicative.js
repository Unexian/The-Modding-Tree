addLayer("*", {
    name: "Multiplicative", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "\u00D7", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resets: new Decimal(0),
        autoM: false,
        autoA: false
    }},
    onPrestige(gain) {
        player[this.layer].resets = player[this.layer].resets.add(1)
    },
    doReset(resettingLayer) {
        if (tmp[resettingLayer].row == tmp[this.layer].row) return
        layerDataReset(this.layer, ["milestones"])
        if (hasMilestone("^", 1)) {addBuyables(this.layer, 11, 2)}
    },
    effect() {
        return player[this.layer].points.div(10).add(1)
    },
    effectDescription() {
        return "boosting additive point gain by " + this.effect().toString() + "x"
    },
    color: "#a933e0",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "multiplicative points", // Name of prestige currency
    baseResource: "increments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "m", description: "m: Reset for multiplicative points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate() {
        if (hasMilestone("^", 4) && player[this.layer].autoM && tmp[this.layer].buyables[11].canAfford()) {
            tmp[this.layer].buyables[11].buy()
        }
        if (hasMilestone("^", 5) && player[this.layer].autoA && tmp[this.layer].buyables[12].canAfford()) {
            tmp[this.layer].buyables[12].buy()
        }
    },
    milestones: {
        1: {
            requirementDescription: "5 multiplicative resets",
            effectDescription: "Start resets with 1 additive boost",
            done() {return player[this.layer].resets.gte(5)}
        },
        2: {
            requirementDescription: "10 multiplicative resets",
            effectDescription: "Unlock additive power generation",
            done() {return player[this.layer].resets.gte(10)}
        },
        3: {
            requirementDescription: "25 multiplicative boosts",
            effectDescription: "Auto-buy additive boosts",
            done() {return getBuyableAmount(this.layer, 11).gte(25)},
            toggles: ["+", "auto"]
        },
        4: {
            requirementDescription: "100 multiplicative boosts",
            effectDescription: "Unlock a new layer",
            done() {return getBuyableAmount(this.layer, 11).gte(100)}
        },
    },
    buyables: {
        11: {
            title: "Multiplicative boost",
            display() {
                return "Increase base point gain multiplier by one per purchase<br><br>Times bought: "
                    + getBuyableAmount(this.layer, 11).toString()
                    + "<br>Cost: "
                    + this.cost().toString()
                    + " multiplicative points<br>Effect: "
                    + this.effectDisplay()
            },
            cost(x = getBuyableAmount(this.layer, 11)) {
                return Decimal.pow(2, x).round()
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, 11)))
            },
            buy() {
                addBuyables(this.layer, 11, 1)
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, 11).sub(1)))
            },
            effect() {
                return getBuyableAmount(this.layer, 11).add(1).mul(hasChallenge("^", 11) ? 3 : 1)
            },
            effectDisplay() {
                return this.effect().toString() + "x points per second"
            }
        },
        12: {
            title: "Additive increments",
            display() {
                return "Generate additive power passively<br><br>Times bought: "
                    + getBuyableAmount(this.layer, 12).toString()
                    + "<br>Cost: "
                    + this.cost().toString()
                    + " multiplicative points<br>Effect: "
                    + this.effectDisplay()
            },
            cost(x = getBuyableAmount(this.layer, 12)) {
                return Decimal.pow(3, x).mul(3).round()
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, 12)))
            },
            buy() {
                addBuyables(this.layer, 12, 1)
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, 12).sub(1)))
            },
            effect() {
                return getBuyableAmount(this.layer, 12).mul(5).mul(hasChallenge("^", 11) ? 3 : 1)
            },
            effectDisplay() {
                return this.effect().toString() + "% of additive reset per second"
            },
            unlocked() {return hasMilestone(this.layer, 2)}
        },
    },
    layerShown(){return hasMilestone("+", 2)}
})
