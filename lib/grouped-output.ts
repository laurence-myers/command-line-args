'use strict';
const t = require('typical');
const arrayify = require('array-back');
import {Output} from './output';
import {OptionDefinition} from "./definition";

export interface ParsedOptions {
    [key : string] : any;
    _all? : {[key : string] : any};
    _none? : {[key : string] : any};
    _unknown? : {[key : string] : any};
}

export class GroupedOutput extends Output {
    toObject() {
        const grouped : ParsedOptions = {
            _all: this.output
        };
        if (this.unknown.length) {
            grouped._unknown = this.unknown;
        }

        this.definitions.whereGrouped().forEach((def : OptionDefinition<any>) => {
            arrayify(def.group).forEach((groupName : string) => {
                grouped[groupName] = grouped[groupName] || {};
                if (t.isDefined(this.output[def.name])) {
                    grouped[groupName][def.name] = this.output[def.name];
                }
            })
        });

        this.definitions.whereNotGrouped().forEach((def : OptionDefinition<any>) => {
            if (t.isDefined(this.output[def.name])) {
                if (!grouped._none) {
                    grouped._none = {};
                }
                grouped._none[def.name] = this.output[def.name];
            }
        });
        return grouped;
    }
}
