addLayer("e", {
    name: "epsilon", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ε", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",

        ["display-text", "This layer is not implemented yet. It's coming, though!"]
    ],
    color: "#4db361",
    requires() {return new Decimal(Number.POSITIVE_INFINITY)},
    resource: "epsilon", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
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
    branches: ['a'],
    hotkeys: [
        {key: "e", description: "E: Do a ε reset.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
})
