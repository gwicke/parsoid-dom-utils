'use strict';

const assert = require('assert');
const sectionDiff = require('../').sectionDiff;

const origIds = ['a','b','c','d','e','f'];

// Basic tests
module.exports = {
    'Section diff': {
        'No change': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'a',value:'a'},{id:'b',value:'b'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e',value:'e'},{id:'f',value:'f'}]), {});
        },
        'Single deleted section': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'b',value:'b'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e',value:'e'},{id:'f',value:'f'}]), {a:''});
        },
        'Single deleted section, middle': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'a',value:'a'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e',value:'e'},{id:'f',value:'f'}]), {'b':''});
        },
        'Delete everything': () => {
            assert.deepEqual(sectionDiff(origIds, []), {a:'',b:'',c:'',d:'',e:'',f:''});
        },
        'Replace first section': () => {
            assert.deepEqual(sectionDiff(origIds, [{value:'foo'},{id:'b',value:'b'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e',value:'e'},{id:'f',value:'f'}]), {mw0:'foo',a:''});
        },
        'Edit + section replacement': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'a',value:'a'},{id:'b', modified: true, value: 'bar'},{id:'d', modified: true, value: 'deee'},{id:'e',value:'e'},{id:'f',value:'f'}]), {b:'bar',c:'',d:'deee'});
        },
        'Delete last section': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'a',value:'a'},{id:'b',value:'b'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e',value:'e'}]), {f:''});
        },
        'Prepend & delete last section': () => {
            assert.deepEqual(sectionDiff(origIds,
                        [{value: 'foo'},{id:'a',value:'a'},{id:'b',value:'b'},{id:'c',value:'c'},{id:'d',value:'d'},{id:'e'}]),
                        {'mw0':'foo',f: ''});
        },
        'Reorder sections 1': () => {
            assert.deepEqual(sectionDiff(origIds, [{id:'a', value:'aa'}, {id: 'b',
                value:'b'}, {value: 'foo'}, {id:'e', value: 'e'}]), {'b':'bfoo',c:
                '', d:'', f:''});
        }
    }
};
