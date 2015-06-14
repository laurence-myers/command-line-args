var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one", alias: "1" },
    { name: "two", alias: "2" },
    { name: "three", alias: "3" },
    { name: "four", alias: "4" }
];

test("one of each", function(t){
    var argv = [ "--one", "-2", "--three" ];
    var result = parse(optionDefinitions, argv);
    t.strictEqual(result.one, true);
    t.strictEqual(result.two, true);
    t.strictEqual(result.three, true);
    t.strictEqual(result.four, undefined);
    t.end();
});
