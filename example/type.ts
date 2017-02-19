'use strict';
import commandLineArgs = require('../lib/command-line-args');
import fs = require('fs');

/* demonstrates a custom `type` function which returns a class instance */

class FileDetails {
    exists : boolean;

    constructor(public filename : string) {
        this.exists = fs.existsSync(filename);
    }
}

const optionDefinitions = [
    {
        name: 'file',
        multiple: true,
        defaultOption: true,
        type: (filename : string) => new FileDetails(filename)
    },
    {name: 'depth', type: Number}
];

const options = commandLineArgs(optionDefinitions);

console.log(options);

/*
 Example output:

 $ node example/type.js package.json nothing.js
 { file:
 [ FileDetails { filename: 'package.json', exists: true },
 FileDetails { filename: 'nothing.js', exists: false } ] }
 */
