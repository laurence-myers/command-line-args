'use strict';
const TestRunner = require('test-runner');
import commandLineArgs = require('../lib/command-line-args');
import a = require('assert');

const definitions = [
    {
        name: 'file',
        multiple: true,
        type: function (file : string) {
            return file;
        }
    }
];

const runner = new TestRunner();

runner.test('type-other-multiple: different values', function () {
    a.deepStrictEqual(
        commandLineArgs(definitions, {argv: ['--file', 'one.js']}),
        {file: ['one.js']}
    );
    a.deepStrictEqual(
        commandLineArgs(definitions, {argv: ['--file', 'one.js', 'two.js']}),
        {file: ['one.js', 'two.js']}
    );
    a.deepStrictEqual(
        commandLineArgs(definitions, {argv: ['--file']}),
        {file: []}
    )
});
