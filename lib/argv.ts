'use strict';
import {Definitions} from "./definitions";
const arrayify = require('array-back');
const option = require('./option');

/**
 * Handles parsing different argv notations
 *
 * @module argv
 * @private
 */

export class Argv extends Array {
    load(argv? : string | string[]) {
        let argsToParse;
        if (argv) {
            argsToParse = arrayify(argv)
        } else {
            /* if no argv supplied, assume we are parsing process.argv */
            argsToParse = process.argv.slice(0);
            argsToParse.splice(0, 2);
        }
        argsToParse.forEach((arg : string) => this.push(arg));
    }

    clear() {
        this.length = 0
    }

    /**
     * expand --option=value style args. The value is clearly marked to indicate it is definitely a value (which would otherwise be unclear if the value is `--value`, which would be parsed as an option). The special marker is removed in parsing phase.
     */
    expandOptionEqualsNotation() {
        const optEquals = option.optEquals;
        if (this.some(optEquals.test.bind(optEquals))) {
            const expandedArgs : string[] = [];
            this.forEach(arg => {
                const matches = arg.match(optEquals.re);
                if (matches) {
                    expandedArgs.push(matches[1], option.VALUE_MARKER + matches[2]);
                } else {
                    expandedArgs.push(arg);
                }
            });
            this.clear();
            this.load(expandedArgs);
        }
    }

    /**
     * expand getopt-style combined options
     */
    expandGetoptNotation() {
        const findReplace = require('find-replace');
        const combinedArg = option.combined;
        const hasGetopt = this.some(combinedArg.test.bind(combinedArg));
        if (hasGetopt) {
            findReplace(this, combinedArg.re, (arg : string) => {
                arg = arg.slice(1);
                return arg.split('').map(letter => '-' + letter);
            });
        }
    }

    /**
     * Inspect the user-supplied options for validation issues.
     * @throws `UNKNOWN_OPTION`
     */
    validate(definitions : Definitions, options? : ParseOptions) {
        options = options || {};
        let invalidOption;

        if (!options.partial) {
            this
                .filter(arg => option.isOption(arg))
                .some((arg : string) => {
                    if (definitions.get(arg) === undefined) {
                        invalidOption = arg;
                        return true;
                    } else {
                        return false;
                    }
                });
            if (invalidOption) {
                halt(
                    'UNKNOWN_OPTION',
                    'Unknown option: ' + invalidOption
                )
            }
        }
    }
}

function halt(name : string, message : string) {
    const err = new Error(message);
    err.name = name;
    throw err;
}
