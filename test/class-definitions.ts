'use strict';
const TestRunner = require('test-runner');
import a = require('assert');
import {Definitions} from '../lib/definitions';

const runner = new TestRunner();

runner.test('.get()', function () {
    const definitions = new Definitions();
    definitions.load([{name: 'one', defaultValue: 'eins'}]);
    a.strictEqual(definitions.get('--one').name, 'one');
});

runner.test('.validate()', function () {
    a.throws(function () {
        const definitions = new Definitions();
        definitions.load([{name: 'one'}, {name: 'one'}]);
    });
});
