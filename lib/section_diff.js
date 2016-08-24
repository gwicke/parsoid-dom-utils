'use strict';
var assert = require('assert');

/**
 * Simple utility for full-document editing with the section API introduced in
 * https://phabricator.wikimedia.org/T94890.
 */

/**
 * Compute section changes from an array of original IDs & an array of
 * modified nodes.
 *
 * @param {Array<string>} oldIds, the array of original section ids.
 * @param {Array<object>} newNodes, objects with
 *   - {string} id: The id of the node. Absent for new and copy/pasted
 *   (including moved) content.
 *   - {boolean} modified, indicating whether this node's content was
 *   modified.
 *   - {string} value, the outerHTML of this section. Should exclude ID
 *   attributes for copy/pasted (duplicated) content, but can include the ids
 *   for moved content.
 * @return {object} Object with changes to the document, ready to be sent to
 * the REST section to wikitext transform API.
 */
function sectionDiff(oldIds, newNodes) {
    var changes = {};
    var oldIdx = 0;
    var prevNode = {id: 'mw0', value: ''};
    for (var n = 0; n < newNodes.length; n++) {
        // New content
        while (n < newNodes.length && !newNodes[n].id) {
            prevNode.value += newNodes[n].value;
            changes[prevNode.id] = prevNode.value;
            n++;
        }

        // Modified sections
        var newNode = newNodes[n];
        if (newNode.modified) { changes[newNode.id] = newNode.value; }

        // Deletions
        while (oldIds[oldIdx] !== newNode.id && oldIdx < oldIds.length) {
            changes[oldIds[oldIdx]] = '';
            oldIdx++;
        }
        oldIdx++;
        prevNode = newNode;
    }
    for (;oldIdx < oldIds.length; oldIdx++) { changes[oldIds[oldIdx]] = ''; }
    return changes;
}

module.exports = sectionDiff;
