addLayer("d", {
    name: "delta", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "δ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
            if (hasUpgrade(this.layer, 11)) return "You have " + format(player[this.layer].power) + " delta power, equating to a " + format(player[this.layer].power.div(10).add(1).mul(2)) + "x multiplier to beta generator effect."
            return "You have " + format(player[this.layer].power) + " delta power, equating to a " + format(player[this.layer].power.div(10).add(1)) + "x multiplier to beta generator effect."
        }],
        "blank",
        ["row", [
            "buyables",
            "upgrades"
        ]]
    ],
    color: "#74a659",
    requires() {
        if (hasUpgrade(this.layer, 12)) return new Decimal("5e4")
        return new Decimal("1e5")
    }, // Can be a function that takes requirement increases into account
    resource: "delta", // Name of prestige currency
    baseResource: "beta power", // Name of resource prestige is based on
    baseAmount() {return player.b.power}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ['b'],
    hotkeys: [
        {key: "d", description: "D: Do a δ reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Delta upgrade 1",
            description: "Multiply delta power base by 2.",
            cost: new Decimal(15)
        },
        12: {
            title: "Delta upgrade 2",
            description: "Multiply T1 delta generator base by 3.",
            cost: new Decimal(40)
        },
        21: {
            title: "Delta upgrade 3",
            description: "Multiply delta cost base by .5",
            cost: new Decimal(75)
        },
        22: {
            title: "Delta upgrade 4",
            description: "Multiply T2 delta generator base by 5.",
            cost: new Decimal(150)
        },
        31: {
            title: "Delta upgrade 5",
            description: "Multiply T3 delta generator base by 10.",
            cost: new Decimal(300)
        },
        32: {
            title: "Delta upgrade 6",
            description: "Multiply T4 delta generator base by 25.",
            cost: new Decimal(750)
        },
    },
    buyables: {
        11: {
            title: "T1 delta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(4).pow(x.div(4).floor()).floor().mul(2) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T1 delta generators generating " + format(this.effect()) + " delta power every second.<br>Your next T1 delta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " delta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id])
                if (hasUpgrade(this.layer, 12)) { effect = effect.mul(3) }
                return effect
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
            title: "T2 delta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(7).pow(x.div(2).floor()).mul(7) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T2 delta generators generating " + format(this.effect()) + " T1 delta generators every second.<br>Your next T2 delta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " delta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(10)
                if (hasUpgrade(this.layer, 22)) { effect = effect.mul(5) }
                return effect
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
            title: "T3 delta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(15).pow(x).mul(30) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T3 delta generators generating " + format(this.effect()) + " T2 delta generators every second.<br>Your next T3 delta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " delta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(100)
                if (hasUpgrade(this.layer, 31)) { effect = effect.mul(10) }
                return effect
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
            title: "T4 delta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(30).pow(x).mul(75) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " T4 delta generators generating " + format(this.effect()) + " T3 delta generators every second.<br>Your next T4 delta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " delta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(1000)
                if (hasUpgrade(this.layer, 32)) { effect = effect.mul(25) }
                return effect
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
