var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank0", {
    position: 0,
    row: 2,
    layerShown: "ghost",
})
addNode("blank1", {
    position: 1,
    row: 2,
    layerShown: "ghost",
})
addNode("blank2", {
    position: 5,
    row: 2,
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})