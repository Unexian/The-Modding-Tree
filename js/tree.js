var layoutInfo = {
    startTab: "a",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}

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