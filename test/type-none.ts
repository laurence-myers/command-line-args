'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const runner = new TestRunner();

const definitions = [
    {name: 'one'},
    {name: 'two'}
];

runner.test('name: no argv values', function () {
    const argv : string[] = [];
    const result = commandLineArgs(definitions, {argv});
    a.deepStrictEqual(result, {});
});

runner.test('name: just names, no values', function () {
    const argv = ['--one', '--two'];
    const result = commandLineArgs(definitions, {argv});
    a.deepStrictEqual(result, {
        one: null,
        two: null
    });
});

runner.test('name: just names, one value, one unpassed value', function () {
    const argv = ['--one', 'one', '--two'];
    const result = commandLineArgs(definitions, {argv});
    a.deepStrictEqual(result, {
        one: 'one',
        two: null
    });
});

runner.test('name: just names, two values', function () {
    const argv = ['--one', 'one', '--two', 'two'];
    const result = commandLineArgs(definitions, {argv});
    a.deepStrictEqual(result, {
        one: 'one',
        two: 'two'
    });
});
