/**
 * To run: node reprocess.js --f cache/list.html --d cache/attendees/
 * Arguments: --d [Directory]: Directory to write cached files to (e.g., empties/)
              --f [Filename]: List file to process (e.g., cache/list.html, cache/list-short.html)
              --debug [Debug]: Defaults to true. Setting to false makes external HTTP requests
 */

const cheerio = require('cheerio'),
  cookie = "udid=930063b010ca7179fb693a97da78107e; lang=en; langlogged=1; cookieconsent_status=dismiss; tc_mobile_site=5i7dvv8clfb89nnm79hpve5fq6; sessionid=aec1775c5fb9b63436fb5d663bce4a13; mp__mixpanel=%7B%22distinct_id%22%3A%20%22165ded101ed52-076208d073b09b-34647908-1aeaa0-165ded101ee506%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a1ea0d8bb1e4ac1e3332bf5e3f998d56_mixpanel=%7B%22distinct_id%22%3A%20%22165ded13a0060c-0ee54d8be482eb-34647908-1aeaa0-165ded13a01aca%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Ftheaisummiteventapp7645.webapp-eu.eventscloud.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22theaisummiteventapp7645.webapp-eu.eventscloud.com%22%7D";

var fs = require('fs'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2)),
  request = require('request'),
  errors = 0,
  debug = (argv.debug == 'false') ? false : true;

//print the txt files in the current directory
getFilesFromDir(argv.d, [".html"]).map(function(file) {

  var id = file.split('.').shift();
  var url = 'https://theaisummiteventapp7645.webapp-eu.eventscloud.com/attendees/view/'
    + id;

  request(url, {headers: {Cookie: cookie}})
    .on('error', function(err) {errors++; console.log('ERROR:' + err)})
    .pipe(fs.createWriteStream('reprocess/' + id + '.html'));

  console.log(file);
});
console.log('Reproceessed with ' + errors + ' errors.');

// Return a list of files of the specified fileTypes in the provided dir,
// with the file path relative to the given dir
// dir: path of the directory you want to search the files for
// fileTypes: array of file types you are search files, ex: ['.txt', '.jpg']
function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn;
}
