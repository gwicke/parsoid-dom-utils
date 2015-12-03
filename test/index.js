'use strict';
var domino = require('domino');
var domUtils = require('../index');
var assert = require('assert');

module.exports = {
	sections: {
		simple: function() {
			var doc = domino.createDocument('<body>before1<div></div>\n'
					+ '<h1>1</h1>after1\n'
					+ '<h2>2</h2>after2\n'
					+ '<div><h1>3</h1></div>after3\n'
					+ '<h2>3</h2>after4\n');
			var wrapped = domUtils.sections.wrap(doc).outerHTML;
			assert.equal(wrapped, '<html><head></head><body><section>before1<div></div>\n'
					+ '</section><section><h1>1</h1>after1\n'
					+ '<h2>2</h2>after2\n'
					+ '</section><section><div><h1>3</h1></div>after3\n'
					+ '<h2>3</h2>after4\n'
					+ '</section></body></html>');
		},
		"wrap a single child of body": function() {
			var doc = domino.createDocument('<body><div>before1<div></div>\n'
					+ '<h1>1</h1>after1\n'
					+ '<h2>2</h2>after2\n'
					+ '<div><h1>3</h1></div>after3\n'
					+ '<h2>3</h2>after4\n</div>');
			var wrapped = domUtils.sections.wrap(doc).outerHTML;
			assert.equal(wrapped, '<html><head></head><body><section><div>before1<div></div>\n'
					+ '<h1>1</h1>after1\n'
					+ '<h2>2</h2>after2\n'
					+ '<div><h1>3</h1></div>after3\n'
					+ '<h2>3</h2>after4\n'
					+ '</div></section></body></html>');
		},
		"multiple nested headings": function() {
			var doc = domino.createDocument('<body>before1<div>\n'
					+ '<h2>1</h2>after1\n'
					+ '<h2>2</h2>after2</div>\n'
					+ '<div><h1>3</h1>after3\n'
					+ '<h2>3</h2>after4\n</div>');
			var wrapped = domUtils.sections.wrap(doc).outerHTML;
			assert.equal(wrapped, '<html><head></head><body><section>before1</section>'
					+ '<section><div>\n'
					+ '<h2>1</h2>after1\n'
					+ '<h2>2</h2>after2</div>\n'
					+ '</section><section><div><h1>3</h1>after3\n'
					+ '<h2>3</h2>after4\n'
					+ '</div></section></body></html>');
		},
	},
};
