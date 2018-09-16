const cheerio = require('cheerio');

var request = require('request');

const cookie = "udid=930063b010ca7179fb693a97da78107e; lang=en; langlogged=1; cookieconsent_status=dismiss; tc_mobile_site=5i7dvv8clfb89nnm79hpve5fq6; sessionid=aec1775c5fb9b63436fb5d663bce4a13; mp__mixpanel=%7B%22distinct_id%22%3A%20%22165ded101ed52-076208d073b09b-34647908-1aeaa0-165ded101ee506%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a1ea0d8bb1e4ac1e3332bf5e3f998d56_mixpanel=%7B%22distinct_id%22%3A%20%22165ded13a0060c-0ee54d8be482eb-34647908-1aeaa0-165ded13a01aca%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Ftheaisummiteventapp7645.webapp-eu.eventscloud.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22theaisummiteventapp7645.webapp-eu.eventscloud.com%22%7D";

var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'list-short.html');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, html) {
    if (!err) {

        const $ = cheerio.load(html);

        $('li.has-thumb.span6 a.button').each(function() {
          var href = $(this).attr('href'),
            filename = href.split('/').pop();

            request(href, {headers: {Cookie: cookie}})
              .pipe(fs.createWriteStream('attendees/' + filename + '.html'));
        });
        /*response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();*/
    } else {
        console.log(err);
    }
});
