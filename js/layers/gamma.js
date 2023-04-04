addLayer("g", {
    name: "gamma", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "γ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
    increaseUnlockOrder: ['b'],
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["display-text", function () {
            if (hasUpgrade(this.layer, 11)) return "You have " + format(player[this.layer].power) + " gamma power, equating to a " + format(player[this.layer].power.div(5).add(1).mul(1.5)) + "x multiplier to alpha generator effect."
            return "You have " + format(player[this.layer].power) + " gamma power, equating to a " + format(player[this.layer].power.div(5).add(1)) + "x multiplier to alpha generator effect."
        }],
        "blank",
        "milestones",
        ["row", [
            "buyables",
            "upgrades"
        ]]
    ],
    color: "#949966",
    requires() {
        if (hasUpgrade(this.layer, 12)) return new Decimal(500)
        return new Decimal(1000)
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
    resource: "gamma", // Name of prestige currency
    baseResource: "alpha", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
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
        {key: "g", description: "G: Do a γ reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (this.baseAmount().gte(800)) return true
        if (player[this.layer].points.gte(1)) player[this.layer].unlocked = true
        return player[this.layer].unlocked
    },
    milestones: {
        0: {
            requirementDescription: "10 gamma",
            effectDescription: "Gamma resets don't reset alpha generators",
            done() { return player[this.layer].points.gte(10) }
        },
        1: {
            requirementDescription: "1000 gamma",
            effectDescription: "Gamma resets don't reset alpha upgrades",
            done() { return player[this.layer].points.gte(1000) }
        },
        2: {
            requirementDescription: "100000 gamma",
            effectDescription: "Gamma resets don't reset alpha extra buyables",
            done() { return player[this.layer].points.gte(100000) }
        }
    },
    upgrades: {
        11: {
            title: "Gamma upgrade 1",
            description: "Multiply gamma power base by 1.5.",
            cost: new Decimal(15)
        },
        12: {
            title: "Gamma upgrade 2",
            description: "Multiply T1 gamma generator base by 1.5.",
            cost: new Decimal(40)
        },
        21: {
            title: "Gamma upgrade 3",
            description: "Multiply gamma cost base by 3/4",
            cost: new Decimal(75)
        },
        22: {
            title: "Gamma upgrade 4",
            description: "Multiply T2 gamma generator base by 2.",
            cost: new Decimal(150)
        },
        31: {
            title: "Gamma upgrade 5",
            description: "Multiply T3 gamma generator base by 5.",
            cost: new Decimal(300)
        },
        32: {
            title: "Gamma upgrade 6",
            description: "Multiply T4 gamma generator base by 10.",
            cost: new Decimal(750)
        },
    },
    buyables: {
        11: {
            title: "T1 gamma generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(4).pow(x.div(4).floor()).floor().mul(2) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T1 gamma generators generating " + format(this.effect()) + " gamma power every second.<br>Your next T1 gamma generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " gamma." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id])
                if (hasUpgrade(this.layer, 12)) { effect = effect.mul(1.5) }
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
            title: "T2 gamma generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(7).pow(x.div(2).floor()).mul(7) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T2 gamma generators generating " + format(this.effect()) + " T1 gamma generators every second.<br>Your next T2 gamma generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " gamma." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(10)
                if (hasUpgrade(this.layer, 22)) { effect = effect.mul(2) }
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
            title: "T3 gamma generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(15).pow(x).mul(30) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " + " + format(player[this.layer].extraBuyables[this.id]) + " T3 gamma generators generating " + format(this.effect()) + " T2 gamma generators every second.<br>Your next T3 gamma generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " gamma." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(100)
                if (hasUpgrade(this.layer, 31)) { effect = effect.mul(5) }
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
            title: "T4 gamma generator",
            cost(x) { if (x === undefined) x = getBuyableAmount(this.layer, this.id); return new Decimal(30).pow(x).mul(75) },
            display() { return "You have " + getBuyableAmount(this.layer, this.id) + " T4 gamma generators generating " + format(this.effect()) + " T3 gamma generators every second.<br>Your next T4 gamma generator will cost " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " gamma." },
            effect() {
                let effect = getBuyableAmount(this.layer, this.id).add(player[this.layer].extraBuyables[this.id]).div(1000)
                if (hasUpgrade(this.layer, 32)) { effect = effect.mul(10) }
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
        player[this.layer].power = player[this.layer].power.add(buyableEffect(this.layer, 11).mul(buyableEffect('e', 22)).mul(delta))
        player[this.layer].extraBuyables[11] = player[this.layer].extraBuyables[11].add(buyableEffect(this.layer, 12).mul(buyableEffect('e', 22)).mul(delta))
        player[this.layer].extraBuyables[12] = player[this.layer].extraBuyables[12].add(buyableEffect(this.layer, 21).mul(buyableEffect('e', 22)).mul(delta))
        player[this.layer].extraBuyables[21] = player[this.layer].extraBuyables[21].add(buyableEffect(this.layer, 22).mul(buyableEffect('e', 22)).mul(delta))
    }
})
