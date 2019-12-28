var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var formidable = require('formidable');
const path = require('path');

app.use(express.static(`${__dirname}/html`));

app.get('/uploadform', function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<div>');
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form></div>');
    return res.end();
  }); 
  app.post("/fileupload",function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldpath = files.filetoupload.path;
        //var newpath = './audio/audio.mp3';
        //console.log(path.basename(oldpath));
        var newpath = './uploads/' + files.filetoupload.name
        fs.readFile(oldpath, function(err, data){
            if(err) throw err;
            fs.writeFile(newpath, data, function(err){
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<center>File uplaoded and saved</center>');
                res.end();
            });
            fs.unlink(oldpath, function(err){
                if(err) throw err;
            });

        });

    });

});

port = process.env.port||'5001'
server.listen(port, function() {
    console.log("Listening on port: " + port);
    });