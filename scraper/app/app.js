/**
 * To run: node app.js --f cache/list.html --d cache/attendees/
 * Arguments: --d [Directory]: Directory to write cached files to (e.g., attendees/)
              --f [Filename]: List file to process (e.g., cache/list.html, cache/list-short.html)
              --debug [Debug]: Defaults to true. Setting to false makes external HTTP requests
 */


const cheerio = require('cheerio');

var argv = require('minimist')(process.argv.slice(2)),
  request = require('request'),
  errors = 0,
  debug = (argv.debug == 'false') ? false : true,
  list = argv.f;

  console.log('Procesing ' + list + '.');

/** @TODO: Prompt for cookie, if !debug **/
const cookie = "udid=930063b010ca7179fb693a97da78107e; lang=en; langlogged=1; cookieconsent_status=dismiss; tc_mobile_site=5i7dvv8clfb89nnm79hpve5fq6; sessionid=aec1775c5fb9b63436fb5d663bce4a13; mp__mixpanel=%7B%22distinct_id%22%3A%20%22165ded101ed52-076208d073b09b-34647908-1aeaa0-165ded101ee506%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a1ea0d8bb1e4ac1e3332bf5e3f998d56_mixpanel=%7B%22distinct_id%22%3A%20%22165ded13a0060c-0ee54d8be482eb-34647908-1aeaa0-165ded13a01aca%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Ftheaisummiteventapp7645.webapp-eu.eventscloud.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22theaisummiteventapp7645.webapp-eu.eventscloud.com%22%7D";

var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, list);

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, html) {
    if (!err) {

        const $ = cheerio.load(html);

        $('li.has-thumb.span6 a.button').each(function() {
          var href = $(this).attr('href'),
            filename = href.split('/').pop();

            if (debug == false) {
              console.log('Fetching:' + href);
              request(href, {headers: {Cookie: cookie}})
                .on('error', function(err) {errorHandler(err, filename)})
                .pipe(fs.createWriteStream(argv.d + filename + '.html'));
            }

            console.log('Caching: ' + argv.d + filename + '.html');
        });
    } else {
        errorHandler(err);
    }
});
console.log(errors + ' total errors found.');
if (errors > 0) {
  console.log('caching-errors.csv');
}

function errorHandler(err, id) {
  errors++;
  var msg = '[' + errors + ']' + "\n";
  if (id !== 'undefined') {
    msg += argv.d + id + ".html\n";
  }
  msg += err + "\n";
  msg += "----------------------------------------------------------------\n";
  msg += "----------------------------------------------------------------\n";
  fs.appendFile('caching-errors.csv', msg);
  console.log(msg);
}
