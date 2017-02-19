const glob = require('glob');
const path = require('path');

const files = glob.sync("build/test/*.js");
files.forEach((file) => require(path.resolve(process.cwd(), file)));