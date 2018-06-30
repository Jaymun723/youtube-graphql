// Take the 'info' object and return an array of selected field for a specific query name
exports.getSelections = (info, name) =>
  info.fieldNodes.map((node) => {
    if (node.name.value === name) {
      return node.selectionSet.selections.map((selection) => selection.name.value)
    }
  })[0]

// Take an array like ['hello', 'hello', undefined, 'id'] and return ['hello', 'id']
exports.uniqueArray = (a) => [...new Set(a)].filter((val) => val !== undefined)
