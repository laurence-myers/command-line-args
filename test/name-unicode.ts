'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const runner = new TestRunner();

const optionDefinitions = [
    {name: 'один'},
    {name: '两'},
    {name: 'три', alias: 'т'}
];

runner.test('name-unicode: unicode names and aliases are permitted', function () {
    const argv = ['--один', '1', '--两', '2', '-т', '3'];
    const result = commandLineArgs(optionDefinitions, {argv});
    a.strictEqual(result['один'], '1');
    a.strictEqual(result['两'], '2');
    a.strictEqual(result['три'], '3');
});
