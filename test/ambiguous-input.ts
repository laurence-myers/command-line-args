'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const runner = new TestRunner();

runner.test('ambiguous input: value looks like option', function () {
    const optionDefinitions = [
        {name: 'colour', type: String, alias: 'c'}
    ];
    a.deepStrictEqual(commandLineArgs(optionDefinitions, {argv: ['-c', 'red']}), {
        colour: 'red'
    });
    a.throws(function () {
        commandLineArgs(optionDefinitions, {argv: ['--colour', '--red']})
    });
    a.doesNotThrow(function () {
        commandLineArgs(optionDefinitions, {argv: ['--colour=--red']})
    });
    a.deepStrictEqual(commandLineArgs(optionDefinitions, {argv: ['--colour=--red']}), {
        colour: '--red'
    });
});
