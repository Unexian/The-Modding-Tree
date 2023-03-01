addLayer("alpha", {
    name: "Alpha", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "α", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            power: new Decimal(0),
            extraBuyables: {
                11: new Decimal(0),
                12: new Decimal(0),
                21: new Decimal(0)
            }
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["display-text", function () {
            if (hasUpgrade(this.layer, 11)) return "You have " + format(player[this.layer].power) + " alpha power, equating to " + format(player[this.layer].power.div(5).mul(1.2)) + " points gained per second."
            return "You have " + format(player[this.layer].power) + " alpha power, equating to " + format(player[this.layer].power.div(5)) + " points gained per second."
        }],
        "blank",
        ["row", ["buyables", "upgrades"]]
    ],
    color: "#808080",
    requires() {
        if (hasUpgrade(this.layer, 12)) return new Decimal(4)
        return new Decimal(5)
    }, // Can be a function that takes requirement increases into account
    resource: "alpha", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Do an α reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Basic boost",
            description: "Multiply alpha power base by 1.2.",
            cost: new Decimal(10)
        },
        12: {
            title: "Primary boost",
            description: "Multiply T1 alpha generator base by 1.2.",
            cost: new Decimal(25)
        },
        21: {
            title: "Alphatic increase",
            description: "Decrease alpha cost base by 1.",
            cost: new Decimal(50)
        },
        22: {
            title: "Secondary boost",
            description: "Multiply T2 alpha generator base by 1.2.",
            cost: new Decimal(100)
        },
        31: {
            title: "Tertiary boost",
            description: "Multiply T3 alpha generator base by 1.2.",
            cost: new Decimal(250)
        },
        32: {
            title: "Quaternary boost",
            description: "Multiply T4 alpha generator base by 1.2.",
            cost: new Decimal(500)
        },
    },
    buyables: {
        11: {
            title: "T1 alpha generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(3).pow(x.div(5).floor()).floor() },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T1 alpha generators generating " + format(this.effect()) + " points every second.<br>Your next T1 alpha generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " alpha." },
            effect() {
                if (hasUpgrade(this.layer, 12)) { return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).mul(1.2) }
                return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id])
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        12: {
            title: "T2 alpha generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(5).pow(x.div(3).floor()).mul(5) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T2 alpha generators generating " + format(this.effect()) + " T1 alpha generators every second.<br>Your next T2 alpha generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " alpha." },
            effect() {
                if (hasUpgrade(this.layer, 22)) return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).mul(1.2).div(10)
                return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(10)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            branches: [11]
        },
        21: {
            title: "T3 alpha generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(10).pow(x).mul(15) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T3 alpha generators generating " + format(this.effect()) + " T2 alpha generators every second.<br>Your next T3 alpha generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " alpha." },
            effect() {
                if (hasUpgrade(this.layer, 31)) return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).mul(1.2).div(100)
                return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(100)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            branches: [12]
        },
        22: {
            title: "T4 alpha generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(25).pow(x).mul(50) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " T4 alpha generators generating " + format(this.effect()) + " T3 alpha generators every second.<br>Your next T4 alpha generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " alpha." },
            effect() {
                if (hasUpgrade(this.layer, 32)) return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).mul(1.2).div(1000)
                return getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(1000)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            branches: [21]
        },
    },
    update(delta) {
        player[this.layer].power = player[this.layer].power.add(buyableEffect(this.layer, 11).mul(delta))
        player[this.layer].extraBuyables[11] = player[this.layer].extraBuyables[11].add(buyableEffect(this.layer, 12).mul(delta))
        player[this.layer].extraBuyables[12] = player[this.layer].extraBuyables[12].add(buyableEffect(this.layer, 21).mul(delta))
        player[this.layer].extraBuyables[21] = player[this.layer].extraBuyables[21].add(buyableEffect(this.layer, 22).mul(delta))
    }
})
