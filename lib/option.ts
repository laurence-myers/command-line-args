'use strict';

/**
 * A module for testing for and extracting names from options (e.g. `--one`, `-o`)
 *
 * @module option
 * @private
 */

class Arg {
    re : RegExp;

    constructor(re : RegExp) {
        this.re = re;
    }

    name(arg : string) {
        const match = arg.match(this.re);
        return match ? match[1] : undefined;
    }

    test(arg : string) {
        return this.re.test(arg);
    }
}

const short = new Arg(/^-([^\d-])$/);
const long = new Arg(/^--(\S+)/);

const option = {
    short,
    long,
    combined: new Arg(/^-([^\d-]{2,})$/),
    isOption (arg : string) {
        return short.test(arg) || long.test(arg)
    },
    optEquals: new Arg(/^(--\S+?)=(.*)/),
    VALUE_MARKER: '552f3a31-14cd-4ced-bd67-656a659e9efb' // must be unique
};

export = option;
