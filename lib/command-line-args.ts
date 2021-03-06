'use strict';
import {OptionDefinition} from "./definition";
import {Definitions} from "./definitions";
import option = require('./option');
import {Argv} from './argv';
import {Output} from './output';
import {GroupedOutput} from './grouped-output';

/**
 * @module command-line-args
 */
export = commandLineArgs;

/**
 * Returns an object containing all options set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * By default, an exception is thrown if the user sets an unknown option (one without a valid [definition](#exp_module_definition--OptionDefinition)). To enable __partial parsing__, invoke `commandLineArgs` with the `partial` option - all unknown arguments will be returned in the `_unknown` property.
 *
 *
 * @param {module:definition[]} - An array of [OptionDefinition](#exp_module_definition--OptionDefinition) objects
 * @param [options] {object} - Options.
 * @param [options.argv] {string[]} - An array of strings, which if passed will be parsed instead  of `process.argv`.
 * @param [options.partial] {boolean} - If `true`, an array of unknown arguments is returned in the `_unknown` property of the output.
 * @returns {object}
 * @throws `UNKNOWN_OPTION` if `options.partial` is false and the user set an undefined option
 * @throws `NAME_MISSING` if an option definition is missing the required `name` property
 * @throws `INVALID_TYPE` if an option definition has a `type` value that's not a function
 * @throws `INVALID_ALIAS` if an alias is numeric, a hyphen or a length other than 1
 * @throws `DUPLICATE_NAME` if an option definition name was used more than once
 * @throws `DUPLICATE_ALIAS` if an option definition alias was used more than once
 * @throws `DUPLICATE_DEFAULT_OPTION` if more than one option definition has `defaultOption: true`
 * @alias module:command-line-args
 */
function commandLineArgs(optionDefinitions: OptionDefinition<any> | OptionDefinition<any>[], options?: ParseOptions) {
    options = options || {};

    const definitions = new Definitions();
    definitions.load(optionDefinitions);
    const argv = new Argv();
    argv.load(options.argv);
    argv.expandOptionEqualsNotation();
    argv.expandGetoptNotation();
    argv.validate(definitions, options);

    const output = definitions.isGrouped() ? new GroupedOutput(definitions, options) : new Output(definitions, options);
    let optionName : string | undefined;

    /* walk argv building the output */
    argv.forEach((arg : string) => {
        if (option.isOption(arg)) {
            optionName = output.set(arg) ? undefined : arg;
        } else {
            optionName = output.set(optionName, arg) ? undefined : optionName;
        }
    });

    return output.toObject()
}
