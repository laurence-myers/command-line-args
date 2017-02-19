'use strict';
const TestRunner = require('test-runner');
import a = require('assert');
import {Output} from '../lib/output';
import {OptionDefinition} from "../lib/definition";

const runner = new TestRunner();

runner.test('output.set(name): initial value', function () {
    let definitions : OptionDefinition<any>[] = [
        {name: 'one', type: Number}
    ];
    let output = new Output(definitions);
    a.strictEqual(output.get('one'), undefined);
    output.set('--one');
    a.strictEqual(output.get('one'), null);

    definitions = [
        {name: 'one', type: Boolean}
    ];
    output = new Output(definitions);
    a.strictEqual(output.get('one'), undefined);
    output.set('--one');
    a.strictEqual(output.get('one'), true);
});

runner.test('output.set(name, value)', function () {
    const definitions = [
        {name: 'one', type: Number, defaultValue: 1}
    ];
    const output = new Output(definitions);
    a.strictEqual(output.get('one'), 1);
    output.set('--one', '2');
    a.strictEqual(output.get('one'), 2);
});

runner.test('output.set(name, value): multiple', function () {
    const definitions = [
        {name: 'one', type: Number, multiple: true, defaultValue: [1]}
    ];
    const output = new Output(definitions);
    a.deepStrictEqual(output.get('one'), [1]);
    output.set('--one', '2');
    a.deepStrictEqual(output.get('one'), [2]);
});
