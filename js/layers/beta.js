addLayer("b", {
    name: "Beta", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "β", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            power: new Decimal(0),
            unlockOrder: new Decimal(0),
            extraBuyables: {
                11: new Decimal(0),
                12: new Decimal(0),
                21: new Decimal(0)
            }
        }
    },
    increaseUnlockOrder: ['g'],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["display-text", function () {
            if (hasUpgrade(this.layer, 11)) return "You have " + format(player[this.layer].power) + " beta power, equating to " + format(player[this.layer].power.div(5).mul(1.5)) + "x points gained per second."
            return "You have " + format(player[this.layer].power) + " beta power, equating to " + format(player[this.layer].power.div(5).add(1)) + "x points gained per second."
        }],
        "blank",
        "milestones",
        ["row", [
            "buyables",
            "upgrades"
        ]]
    ],
    color: "#8c8173",
    requires() {
        if (hasUpgrade(this.layer, 12)) return new Decimal(5000)
        return new Decimal(10000)
    }, // Can be a function that takes requirement increases into account
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return
        
        let keep = []
        if (resettingLayer == "d" && hasMilestone("d", 0)) {keep.push("milestones")}
        if (resettingLayer == "d" && hasMilestone("d", 2)) {keep.push("buyables")}
        if (resettingLayer == "d" && hasMilestone("d", 3)) {keep.push("upgrades")}
        if (resettingLayer == "d" && hasMilestone("d", 4)) {keep.push("extraBuyables")}
        if (resettingLayer == "e" && hasMilestone("e", 0)) {keep.push("milestones")}
        if (resettingLayer == "e" && hasMilestone("e", 2)) {keep.push("buyables")}
        if (resettingLayer == "e" && hasMilestone("e", 3)) {keep.push("upgrades")}
        if (resettingLayer == "e" && hasMilestone("e", 4)) {keep.push("extraBuyables")}
        if (resettingLayer == "z" && hasMilestone("z", 0)) {keep.push("milestones")}
        if (resettingLayer == "z" && hasMilestone("z", 2)) {keep.push("buyables")}
        if (resettingLayer == "z" && hasMilestone("z", 3)) {keep.push("upgrades")}
        if (resettingLayer == "z" && hasMilestone("z", 4)) {keep.push("extraBuyables")}
        layerDataReset(this.layer, keep)
    },
    resource: "beta", // Name of prestige currency
    baseResource: "alpha power", // Name of resource prestige is based on
    baseAmount() {return player.a.power}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['a'],
    hotkeys: [
        {key: "b", description: "B: Do a β reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (this.baseAmount().gte(8000)) return true
        if (player[this.layer].points.gte(1)) player[this.layer].unlocked = true
        return player[this.layer].unlocked
    },
    milestones: {
        0: {
            requirementDescription: "10 beta",
            effectDescription: "Beta resets don't reset alpha generators",
            done() { return player[this.layer].points.gte(10) }
        },
        1: {
            requirementDescription: "1000 beta",
            effectDescription: "Beta resets don't reset alpha upgrades",
            done() { return player[this.layer].points.gte(1000) }
        },
        2: {
            requirementDescription: "100000 beta",
            effectDescription: "Beta resets don't reset alpha extra buyables",
            done() { return player[this.layer].points.gte(100000) }
        }
    },
    upgrades: {
        11: {
            title: "Beta upgrade 1",
            description: "Multiply beta power base by 1.5.",
            cost: new Decimal(15)
        },
        12: {
            title: "Beta upgrade 2",
            description: "Multiply T1 beta generator base by 1.5.",
            cost: new Decimal(40)
        },
        21: {
            title: "Beta upgrade 3",
            description: "Divide beta cost base by 2",
            cost: new Decimal(75)
        },
        22: {
            title: "Beta upgrade 4",
            description: "Multiply T2 beta generator base by 2.",
            cost: new Decimal(150)
        },
        31: {
            title: "Beta upgrade 5",
            description: "Multiply T3 beta generator base by 5.",
            cost: new Decimal(300)
        },
        32: {
            title: "Beta upgrade 6",
            description: "Multiply T4 beta generator base by 10.",
            cost: new Decimal(750)
        },
    },
    buyables: {
        11: {
            title: "T1 beta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(4).pow(x.div(4).floor()).floor().mul(2) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T1 beta generators generating " + format(this.effect()) + " beta power every second.<br>Your next T1 beta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " beta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id])
                if (hasUpgrade(this.layer, 12)) { effect = effect.mul(1.5) }
                effect = effect.mul(player.d.power.div(10).add(1))
                if (hasUpgrade('d', 11)) { effect = effect.mul(2) }
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
            title: "T2 beta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(7).pow(x.div(2).floor()).mul(7) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T2 beta generators generating " + format(this.effect()) + " T1 beta generators every second.<br>Your next T2 beta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " beta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(10)
                if (hasUpgrade(this.layer, 22)) { effect = effect.mul(2) }
                effect = effect.mul(player.d.power.div(10).add(1))
                if (hasUpgrade('d', 11)) { effect = effect.mul(2) }
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
            title: "T3 beta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(15).pow(x).mul(30) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T3 beta generators generating " + format(this.effect()) + " T2 beta generators every second.<br>Your next T3 beta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " beta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(100)
                if (hasUpgrade(this.layer, 31)) { effect = effect.mul(5) }
                effect = effect.mul(player.d.power.div(10).add(1))
                if (hasUpgrade('d', 11)) { effect = effect.mul(2) }
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
            title: "T4 beta generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(30).pow(x).mul(75) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " T4 beta generators generating " + format(this.effect()) + " T3 beta generators every second.<br>Your next T4 beta generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " beta." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(1000)
                if (hasUpgrade(this.layer, 32)) { effect = effect.mul(10) }
                effect = effect.mul(player.d.power.div(10).add(1))
                if (hasUpgrade('d', 11)) { effect = effect.mul(2) }
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
        player[this.layer].power = player[this.layer].power.add(buyableEffect(this.layer, 11).mul(buyableEffect('e', 21)).mul(delta))
        player[this.layer].extraBuyables[11] = player[this.layer].extraBuyables[11].add(buyableEffect(this.layer, 12).mul(buyableEffect('e', 21)).mul(buyableEffect('e', 31)).mul(delta))
        player[this.layer].extraBuyables[12] = player[this.layer].extraBuyables[12].add(buyableEffect(this.layer, 21).mul(buyableEffect('e', 21)).mul(buyableEffect('e', 31)).mul(delta))
        player[this.layer].extraBuyables[21] = player[this.layer].extraBuyables[21].add(buyableEffect(this.layer, 22).mul(buyableEffect('e', 21)).mul(buyableEffect('e', 31)).mul(delta))
    }
})
