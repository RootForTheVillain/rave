var argv = require('minimist')(process.argv.slice(2));
if (argv.external == true)
console.dir(argv.external);
