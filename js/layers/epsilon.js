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
    requires() {return new Decimal("1e75")},
    resource: "epsilon", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        if (!this.baseAmount().gte(1)) return new Decimal(0)
        return this.baseAmount().log(this.requires()).floor()
    },
    getNextAt(canMax = true) {
        if (canMax) {
            return new Decimal(this.requires()).pow(this.getResetGain().add(1))
        } else {
            return this.requires()
        }
    },
    canReset() { return this.getResetGain().gte(1) },
    prestigeNotify() {
        return this.getResetGain().gte(player[this.layer].points.div(10)) && this.getResetGain().gte(1)
    },
    prestigeButtonText() {
        if (this.getResetGain().gte(100) || player[this.layer].points.gte(1000)) {
            return "Reset for +" + this.getResetGain() + " " + this.name
        } else {
            return "Reset for +" + this.getResetGain() + " " + this.name + "<br><br>Next at " + format(this.getNextAt()) + " " + this.baseResource
        }
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ['a'],
    hotkeys: [
        {key: "e", description: "E: Do a ε reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if (this.baseAmount().gte(new Decimal("1e70"))) return true
        if (player[this.layer].points.gte(1)) player[this.layer].unlocked = true
        return player[this.layer].unlocked
    },
    milestones: {
        0: {
            requirementDescription: "1 epsilon",
            effectDescription: "Epsilon resets don't reset beta or gamma milestones",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "2 epsilon",
            effectDescription: "Epsilon resets don't reset alpha",
            done() { return player[this.layer].points.gte(2) }
        },
        2: {
            requirementDescription: "5 epsilon",
            effectDescription: "Epsilon resets don't reset beta or gamma generators",
            done() { return player[this.layer].points.gte(5) }
        },
        3: {
            requirementDescription: "10 epsilon",
            effectDescription: "Epsilon resets don't reset beta or gamma upgrades",
            done() { return player[this.layer].points.gte(10) }
        },
        4: {
            requirementDescription: "50 epsilon",
            effectDescription: "Epsilon resets don't reset beta or gamma extra buyables",
            done() { return player[this.layer].points.gte(50) }
        },
    },
    buyables: {
        11: {
            title: "Epsilon buyable 1",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(1.5).pow(x).round()
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 1, equating to a " + format(this.effect()) + "x bonus to alpha power and generators. Your next epsilon buyable 1 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(2).mul(buyableEffect('e', 32))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        21: {
            title: "Epsilon buyable 2",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(2).pow(x).mul(2)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 2, equating to a " + format(this.effect()) + "x bonus to beta power and generators. Your next epsilon buyable 2 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(3).mul(buyableEffect('e', 32))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        22: {
            title: "Epsilon buyable 3",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(2).pow(x).mul(2)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 3, equating to a " + format(this.effect()) + "x bonus to gamma power and generators. Your next epsilon buyable 3 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(3).mul(buyableEffect('e', 32))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        31: {
            title: "Epsilon buyable 4",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(3.5).pow(x).round().mul(4)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 4, equating to a " + format(this.effect()) + "x bonus to delta power and generators. Your next epsilon buyable 4 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(5).mul(buyableEffect('e', 32))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        32: {
            title: "Epsilon buyable 5",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(5).pow(x).mul(5)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 5, equating to a " + format(this.effect()) + "x bonus to all other epsilon buyables. Your next epsilon buyable 5 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(10)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
        33: {
            title: "Epsilon buyable 6",
            cost(x) {
                if (x === undefined) x = getBuyableAmount(this.layer, this.id);
                return new Decimal(3.5).pow(x).round().mul(4)
            },
            display() {
                return "You have " + getBuyableAmount(this.layer, this.id) + " epsilon buyable 6, equating to a " + format(this.effect()) + "x bonus to zeta power and generators. Your next epsilon buyable 6 will cost " + format(this.cost()) + " epsilon."
            },
            effect() {
                return getBuyableAmount(this.layer, this.id).add(1).pow(5).mul(buyableEffect('e', 32))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                addBuyables(this.layer, this.id, 1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
    }
})
