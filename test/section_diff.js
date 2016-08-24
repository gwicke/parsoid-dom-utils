'use strict';

const assert = require('assert');
const sectionDiff = require('../').sectionDiff;

const origIds = ['a','b','c','d','e','f'];

// Basic tests
module.exports = {
    'Section diff': {
        'No change': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'a'},
                        {id:'b'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'},
                        {id:'f'}
            ]), {});
        },
        'Single deleted section': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'b'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'},
                        {id:'f'}
            ]), {a:''});
        },
        'Single deleted section, middle': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'a'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'},
                        {id:'f'}
            ]), {'b':''});
        },
        'Delete everything': () => {
            assert.deepEqual(sectionDiff(origIds, []), {a:'',b:'',c:'',d:'',e:'',f:''});
        },
        'Replace first section': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {html:'foo'},
                        {id:'b'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'},
                        {id:'f'}
            ]), {mw0:'foo',a:''});
        },
        'Edit + section replacement': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'a'},
                        {id:'b', html: 'bar'},
                        {id:'d', html: 'deee'},
                        {id:'e'},
                        {id:'f'}
            ]), {b:'bar',c:'',d:'deee'});
        },
        'Delete last section': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'a'},
                        {id:'b'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'}
            ]), {f:''});
        },
        'Prepend & delete last section': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {html: 'foo'},
                        {id:'a'},
                        {id:'b'},
                        {id:'c'},
                        {id:'d'},
                        {id:'e'}
            ]), {'mw0':'foo',f: ''});
        },
        'Reorder sections 1': () => {
            assert.deepEqual(sectionDiff(origIds, [
                        {id:'a'},
                        {id: 'b', html:'b'},
                        {html: 'foo'},
                        {id:'e'}
            ]), {'b':'bfoo', c:'', d:'', f:''});
        }
    }
};
