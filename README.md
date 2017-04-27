# parsoid-dom-utils [![Build Status](https://travis-ci.org/gwicke/parsoid-dom-utils.svg?branch=master)](https://travis-ci.org/gwicke/parsoid-dom-utils)

A collection of utilities for working with HTML DOM emitted by Parsoid

## Section wrapping

Wraps logical sections defined by headings into &lt;section> tags. Different
heading levels produce nested sections. In the final document, the children of
the `body` element are a sequence of `section`s.

```javascript
const domino = require('domino');
const domUtils = require('parsoid-dom-utils');

const testHTML = '<h1>Heading 1</h1><p>Paragraph</p>'
    + '<h2>Heading 2</h2><p>More content</p>'
    + '<h1>Another heading 1</h1><p>More paragraph content</p>';
const doc = domino.createDocument(testHTML);
const wrappedDocHTML = domUtils.sections.wrap(doc).outerHTML;

// <html><head></head><body>
// <section><h1>Heading 1</h1><p>Paragraph</p>
// <section><h2>Heading 2</h2><p>More content</p></section></section>
// <section><h1>Another heading 1</h1><p>More paragraph content</p></section>
// </body></html>
```
