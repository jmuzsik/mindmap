export function searchTree(element, matchingTitle) {
  if (element.id === matchingTitle) {
    return element;
  } else if (element.nodes.length > 0) {
    let i;
    let result = null;
    for (i = 0; result == null && i < element.nodes.length; i++) {
      result = searchTree(element.nodes[i], matchingTitle);
    }
    return result;
  }
  return null;
}
