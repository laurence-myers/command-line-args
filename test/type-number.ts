'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const optionDefinitions = [
    {name: 'one', type: Number}
];

const runner = new TestRunner();

runner.test('type-number: different values', function () {
    a.deepStrictEqual(
        commandLineArgs(optionDefinitions, {argv: ['--one', '1']}),
        {one: 1}
    );
    a.deepStrictEqual(
        commandLineArgs(optionDefinitions, {argv: ['--one']}),
        {one: null}
    );
    a.deepStrictEqual(
        commandLineArgs(optionDefinitions, {argv: ['--one', '-1']}),
        {one: -1}
    );
    const result = commandLineArgs(optionDefinitions, {argv: ['--one', 'asdf']});
    a.ok(isNaN(result['one']));
});
