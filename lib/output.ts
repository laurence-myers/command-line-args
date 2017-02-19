'use strict';
import {Definitions} from "./definitions";
import {ParsedOptions} from "./grouped-output";
import option = require('./option');
import {OptionDefinition} from "./definition";
const t = require('typical');
const arrayify = require('array-back');

export class Output {
    options : ParseOptions;
    output : ParsedOptions;
    hasDefaultArrayValue : { [key : string] : boolean };
    unknown : string[];
    definitions : Definitions;

    constructor(defs : OptionDefinition<any>[], options? : ParseOptions) {
        this.options = options || {};
        this.output = {};
        this.hasDefaultArrayValue = {};
        this.unknown = [];
        this.definitions = new Definitions();
        this.definitions.load(defs);
        this._assignDefaultValues();
    }

    _assignDefaultValues() {
        this.definitions.forEach(def => {
            if (t.isDefined(def.defaultValue)) {
                this.output[def.name] = def.multiple ? arrayify(def.defaultValue) : def.defaultValue;
                if (def.multiple) {
                    this.hasDefaultArrayValue[def.name] = true;
                }
            }
        })
    }

    /**
     * Return `true` when an option value was set and is not a multiple. Return `false` if option was a multiple or if a value was not yet set.
     */
    set(value : string) : boolean;
    set(optionArg : string | undefined, value : string) : boolean;
    set(optionArg? : string, value? : string) : boolean {
        /* if the value marker is present at the beginning, strip it */
        const reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER);
        if (value !== undefined) {
            value = reBeginsWithValueMarker.test(value)
                ? value.replace(reBeginsWithValueMarker, '')
                : value;
        }
        /* lookup the definition.. if no optionArg (--option) was supplied, use the defaultOption */
        let def;
        if (optionArg !== undefined) {
            def = this.definitions.get(optionArg);
        } else {
            def = this.definitions.getDefault();
            if (def) {
                /* if it's not a `multiple` and the defaultOption has already been set, move on */
                if (!def.multiple && t.isDefined(this.output[def.name])) {
                    if (value !== undefined) {
                        this.unknown.push(value);
                    }
                    return true;
                }
            }
        }

        /* if there's no definition or defaultOption, do nothing and continue */
        if (!def) {
            if (optionArg !== undefined && this.unknown.indexOf(optionArg) === -1) {
                this.unknown.push(optionArg);
            }
            if (value !== undefined) {
                this.unknown.push(value);
            }
            return true;
        }

        const name = def.name;

        /* if not already initialised, set a `multiple` value to a new array.  */
        if (def.multiple && !t.isDefined(this.output[name])) {
            this.output[name] = [];
        }

        /* for boolean types, set value to `true`. For all other types run value through setter function. */
        let outputValue : string | boolean | undefined;
        if (def.isBoolean()) {
            outputValue = true;
        } else if (t.isDefined(value)) {
            outputValue = def.type ? def.type(value) : value;
        } else {
            outputValue = value;
        }

        if (t.isDefined(outputValue)) {
            if (Array.isArray(this.output[name])) {
                if (this.hasDefaultArrayValue[name]) {
                    this.output[name] = [outputValue];
                    delete this.hasDefaultArrayValue[name];
                } else {
                    this.output[name].push(outputValue);
                }
                return false
            } else {
                this.output[name] = outputValue;
                return true;
            }
        } else {
            if (!Array.isArray(this.output[name])) {
                this.output[name] = null;
            }
            return false;
        }
    }

    get(name : string) {
        return this.output[name];
    }

    toObject() {
        let output;
        if (this.options.partial && this.unknown.length) {
            output = Object.assign({}, this.output);
            output._unknown = this.unknown;
        } else {
            output = this.output;
        }
        return output
    }
}
