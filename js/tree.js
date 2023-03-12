var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank0", {
    layerShown: "ghost",
})


addLayer("tree-tab", {
    tabFormat: [
        ["tree", [
            ['a'],
            ['b', 'g'],
            ['d', 'e', 'z']
        ]]
    ],
    previousTab: "",
    leftTab: true,
})