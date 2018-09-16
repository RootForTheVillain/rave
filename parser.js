const cheerio = require('cheerio');

var fs = require('fs');
var path = require('path');

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

//print the txt files in the current directory
//getFilesFromDir("attendees/", [".html"]).map(console.log);
getFilesFromDir("attendees/", [".html"]).map(function(file) {

  fs.readFile('attendees/' + file, {encoding: 'utf-8'}, function(err, html) {
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

        console.log(csv);

        /*fs.appendFile('attendees.csv', csv, function() {
          //console.log(file, csv);
        });*/
      } else {
          console.log(err);
      }
  });
});
