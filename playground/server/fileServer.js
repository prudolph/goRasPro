var express = require('express');
var hbs = require('hbs');
var fs = require('fs');

var mime = require('mime');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

var dir ="./videos" ;
app.set('views', './views');
app.set('view engine', 'hbs');
require('./libs/handlebars');

app.get('/', function (req, res) {
  res.render('list', { files : getFileList()});
})

app.get('/dl/:file', function (req, res) {
  var file = dir+"/"+req.params.file;
  console.log("Get file ",file);

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  var filestream = fs.createReadStream(file);
  filestream.pipe(res);

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function getFileList(){
  fileList = [];

     var files = fs.readdirSync(dir);
     for(var i in files){
         if (!files.hasOwnProperty(i)) continue;
         var name = files[i].toString();
          fileList.push(name);

     }
     return fileList;


}
