/**
 * To run: node csvWriter.js --d [cache/attendees | cache/reprocess] [--f filename]
 * Arguments: --d [Directory]: Directory to read files from
              --f [Filename]: Name of CSV to output. If not defined, defaults to
                              name of output/directory in d arg
              --debug [Debug]: Defaults to true. Setting to false makes external HTTP requests
 */


const cheerio = require('cheerio');
const utils = require('./utils');

var argv = require('minimist')(process.argv.slice(2)),
  fs = require('fs'),
  path = require('path'),
  debug = (argv.debug == 'false') ? false : true,
  filename = (typeof argv.f !== 'undefined' && argv.f) ?
    argv.f.replace(/\//g) : argv.d.replace(/\//g) + '.csv';

//print the txt files in the current directory
utils.getFilesFromDir(argv.d, [".html"]).map(function(file) {

  fs.readFile(argv.d + file, {encoding: 'utf-8'}, function(err, html) {
      if (!err) {

        const $ = cheerio.load(html);

        var csv = '',
          name = $('p.metadataTitle span').first().text().trim(),
          companyTitle = [];

        companyTitle = $('span.ellipsis.subtitle').html().split('<br>');

        csv += '"' + name + '",';
        csv += '"' + companyTitle[0] + '",';
        csv += '"' + companyTitle[1] + '"';
        csv +=  "\n";

        console.log(file, csv);

        if (debug == false) {
          console.log('Writing: ' + filename, csv);
          fs.appendFile(filename, csv);
        }
      } else {
          console.log(err);
      }
  });
});
console.log('attendees-reprocess.csv');
