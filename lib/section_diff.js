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
 *   - {string} html, the outerHTML of this section. Should exclude ID
 *   attributes for copy/pasted (duplicated) content, but can include the ids
 *   for moved content.
 * @return {object} Object with changes to the document, ready to be sent to
 * the REST section to wikitext transform API.
 */
function sectionDiff(oldIds, newNodes) {
    var changes = {};
    var oldIdx = 0;
    var prevNode = {id: 'mw0', html: ''};
    for (var n = 0; n < newNodes.length; n++) {
        // New content
        while (n < newNodes.length && !newNodes[n].id) {
            prevNode.html += newNodes[n].html;
            changes[prevNode.id] = prevNode.html;
            n++;
        }

        // Modified sections
        var newNode = newNodes[n];
        if (newNode.html !== undefined) { changes[newNode.id] = newNode.html; }

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
