var fs = require('fs'),
  path = require('path');

module.exports = {
  // Return a list of files of the specified fileTypes in the provided dir,
  // with the file path relative to the given dir
  // dir: path of the directory you want to search the files for
  // fileTypes: array of file types you are search files, ex: ['.txt', '.jpg']
  getFilesFromDir: function(dir, fileTypes) {
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
  },

  errorHandler: function(msg, type) {
  //errorHandler: function(err, dir, id) {
    switch (type) {
      case 'caching':
        fs.appendFile('output/app-errors.csv', msg);
        break;
      case 'csv':
        fs.appendFile('output/csvWriter-errors.csv', msg);
        break;
    }
    console.log('ERROR: ' + msg + "\n");
  }
};
