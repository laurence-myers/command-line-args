'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const runner = new TestRunner();

runner.test('detect process.argv: should automatically remove first two argv items', function () {
    process.argv = ['node', 'filename', '--one', 'eins'];
    a.deepStrictEqual(commandLineArgs({name: 'one'}, {argv: process.argv}), {
        one: 'eins'
    });
});

runner.test('process.argv is left untouched', function () {
    process.argv = ['node', 'filename', '--one', 'eins'];
    a.deepStrictEqual(commandLineArgs({name: 'one'}), {
        one: 'eins'
    });
    a.deepStrictEqual(process.argv, ['node', 'filename', '--one', 'eins']);
});
