addLayer("^", {
    name: "Exponentiative", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "a<sup>b</sup>", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resets: new Decimal(0),
        resetTime: 0
    }},
    onPrestige(gain) {
        player[this.layer].resets = player[this.layer].resets.add(1)
        player[this.layer].milestones = [2]
    },
    doReset(resettingLayer) {
        if (tmp[resettingLayer].row == tmp[this.layer].row) return
        layerDataReset(this.layer, ["milestones"])
    },
    color: "#a37c17",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "exponentiative points", // Name of prestige currency
    baseResource: "increments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    base: 1000000,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "e", description: "e: Reset for exponentiative points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        1: {
            requirementDescription: "2 exponentiative resets",
            effectDescription: "Start resets with 2 multiplicative boosts",
            done() {return player[this.layer].resets.gte(2)}
        },
        2: {
            requirementDescription: "5 exponentiative resets",
            effectDescription: "Unlock multiplicative power generation",
            done() {return player[this.layer].resets.gte(5)}
        },
        3: {
            requirementDescription: "10 exponentiative resets",
            effectDescription: "Buy max exponentiative points",
            done() {return player[this.layer].resets.gte(10)}
        },
        4: {
            requirementDescription: "10 exponentiative boosts",
            effectDescription: "Auto-buy multiplicative boosts",
            done() {return getBuyableAmount(this.layer, 11).gte(10)},
            toggles: ["*", "autoM"]
        },
        5: {
            requirementDescription: "25 exponentiative boosts",
            effectDescription: "Auto-buy additive increments",
            done() {return getBuyableAmount(this.layer, 11).gte(25)},
            toggles: ["*", "autoA"]
        },
        6: {
            requirementDescription: "75 exponentiative boosts",
            effectDescription: "Unlock an exponentiative challenge",
            done() {return getBuyableAmount(this.layer, 11).gte(75)}
        },
        7: {
            requirementDescription: "200 exponentiative boosts",
            effectDescription: "You win, for now...",
            done() {return getBuyableAmount(this.layer, 11).gte(200)}
        },
    },
    buyables: {
        11: {
            title: "Exponentiative boost",
            display() {
                return "Increase base point gain multiplier by one per purchase<br><br>Times bought: "
                    + getBuyableAmount("+", 11).toString()
                    + "<br>Cost: "
                    + this.cost().toString()
                    + " exponentiative points<br>Effect: "
                    + this.effectDisplay()
            },
            cost(x = getBuyableAmount(this.layer, 11)) {
                return Decimal.tetrate(2, x).round()
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
                return this.layer + this.effect().toString() + " points per second"
            }
        },
        12: {
            title: "Multiplicative increments",
            display() {
                return "Generate multiplicative power passively<br><br>Times bought: "
                    + getBuyableAmount(this.layer, 12).toString()
                    + "<br>Cost: "
                    + this.cost().toString()
                    + " exponentiative points<br>Effect: "
                    + this.effectDisplay()
            },
            cost(x = getBuyableAmount(this.layer, 12)) {
                return Decimal.tetrate(3, x).pow(27).round()
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, 12)))
            },
            buy() {
                addBuyables(this.layer, 12, 1)
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, 12).sub(1)))
            },
            effect() {
                return getBuyableAmount(this.layer, 12).pow(1.5).mul(hasChallenge("^", 11) ? 3 : 1)
            },
            effectDisplay() {
                return this.effect().toString() + "% of multiplicative reset per second"
            },
            unlocked() {return hasMilestone(this.layer, 3)}
        },
    },
    challenges: {
        11: {
            name: "De-exponentiate",
            challengeDescription: "Log increment gain based on time in challenge",
            goalDescription: "1e6 increments",
            canComplete() {player.points.gte("1e6")},
            rewardDescription: "All buyables are 3x stronger",
            unlocked() {return hasMilestone(this.layer, 6)},
            tooltip: "Formula: x=logp<sub>logp(t)+2</sub>(x)"
        },
    },
    layerShown(){return hasMilestone("*", 4)}
})
