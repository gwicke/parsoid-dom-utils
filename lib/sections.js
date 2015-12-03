'use strict';

var domino = require('domino');

/**
 * Get a node or parentNode that's a direct child of body.
 *
 * @param {Node} node
 * @return {Node} child of body, possibly a parent of forNode.
 */
function getWrapper(forNode) {
	var node = forNode;
	while (node && node.parentNode && node.parentNode.nodeName !== 'BODY') {
		node = node.parentNode;
	}
	return node;
}


/**
 * Wrap headings into sections elements, resulting in a sequence of sections
 * wrapping all children of body.
 *
 * @param {Document} doc
 * @return {Document} doc
 */
function wrapSections(doc) {
	var headings = doc.body.querySelectorAll('h1, h2, h3, h4, h5, h6');

	// Build up a list of top-level section delimiter nodes.
	var level;
	var delimiters = [];
	var lastWrapper;
	headings.forEach(function(hNode) {
		if (!level || hNode.nodeName <= level) {
			level = hNode.nodeName;
			var wrapper = getWrapper(hNode);
			if (wrapper !== lastWrapper) {
				lastWrapper = wrapper;
				delimiters.push({
					node: hNode,
					wrapper: wrapper,
				});
			}
		}
		// Don't wrap nested headings of a lower level for now.
	});

	// Now walk the children of body, and wrap each section into a <section>
	// element.
	var currentDelim = delimiters.shift();
	var wrapperNode = doc.createElement('section');
	var node = doc.body.firstChild;
	while (node) {
		var nextNode = node.nextSibling;
		if (currentDelim && node === currentDelim.wrapper
				&& wrapperNode.childNodes.length) {
			// Wrap up one section.
			doc.body.insertBefore(wrapperNode, node);
			wrapperNode = doc.createElement('section');
			currentDelim = delimiters.shift();
		}

		wrapperNode.appendChild(node);

		if (!nextNode) {
			doc.body.appendChild(wrapperNode);
		}

		node = nextNode;
	}
	return doc;
}



module.exports = {
	wrap: wrapSections,
};
