//const jsdom = require("jsdom");
//const { JSDOM } = jsdom;

const cheerio = require('cheerio')

var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'list-short.html');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, html){
    if (!err) {

        const $ = cheerio.load(html);

        $('li.has-thumb.span6 a.button').each(function() {
          console.log($(this).attr('href'));
        });

        //$.html();



        /*response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();*/
    } else {
        console.log(err);
    }
});
