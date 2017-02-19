'use strict';
const TestRunner = require('test-runner');
import a = require('assert');
import option = require('../lib/option');

const runner = new TestRunner();

runner.test('option', function () {
    a.strictEqual(option.isOption('--yeah'), true);
    a.strictEqual(option.isOption('в--yeah'), false);
});
