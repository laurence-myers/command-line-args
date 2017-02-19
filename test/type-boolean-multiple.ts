'use strict'
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const runner = new TestRunner();

const definitions = [
    {name: 'array', type: Boolean, multiple: true}
];

runner.test('type-boolean-multiple: 1', function () {
    const argv = ['--array', '--array', '--array'];
    const result = commandLineArgs(definitions, {argv});
    a.deepStrictEqual(result, {
        array: [true, true, true]
    });
});
