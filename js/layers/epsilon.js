addLayer("e", {
    name: "epsilon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ε", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            unlockOrder: new Decimal(0),
        }
    },
    color: "#4db361",
    requires() {return new Decimal("1e25")},
    resource: "epsilon", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ['a'],
    hotkeys: [
        {key: "e", description: "E: Do a ε reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (this.baseAmount().gte(new Decimal("1e20"))) return true
        if (player[this.layer].points.gte(1)) player[this.layer].unlocked = true
        return player[this.layer].unlocked
    },
    challenges: {
        11: {
            name: "Epsilon challenge 1",
            challengeDescription: "Rows 1 and 2 are reset. Row 3 has no effect. Total point gain is raised to the power of 0.75.",
            goalDescription: "Reach 1e25 points",
            rewardDescription: "Total point gain is squared if less than 1/s.",
            canComplete: function() {return player.points.gte(new Decimal("1e25"))},
            onEnter() {
                doReset(this.layer)
                player[this.layer].points = new Decimal(0)
            },
            unlocked() { return player[this.layer].unlocked }
        }
    }
})
