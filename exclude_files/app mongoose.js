var express = require('express') 
var app = express()
var server = require('http').Server(app);
const port = 5000;
const ipWhitelist = require('ip-whitelist');
// mongoose-morgan
var morgan = require('mongoose-morgan');
var fs = require('fs');
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var formidable = require('formidable');
const path = require('path');
 
/* let whitelist = ['::1']; */
// THIS IS THE ARRAY CONTAINING THE IPS WHITELIST
let whitelist = ['::1'];

var moment = require('moment-timezone');
console.log(getCurrentIndianDateTime());

var mongoose = require('mongoose');
 
// make a connection
mongoose.connect('mongodb://localhost:27017/logger');
 
// get reference to database
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
    console.log("Connection to mongodb://localhost:27017/logger  -> Successful!");
    
    // define Schema
    var BookSchema = mongoose.Schema({
      date: Date,
      name: String,
      price: Number,
      quantity: Number,
      quality: String
    });
 
    // compile schema to model
    var Book = mongoose.model('Book', BookSchema, 'logs');
     // a document instance
    var book1 = new Book({ date: new Date(Date.now()).toISOString(), name: 'Introduction to Mongoose2', price: 10, quantity: 25, quality: '25' });
    // save model to database
    book1.save(function (err, book) {
      if (err) return console.error(err);
      console.log(book.name + " saved to bookstore collection.");
    });

    // compile schema to model
    var Book = mongoose.model('Book', BookSchema, 'logs');
    // a document instance

    var book1 = new Book({ date: new Date(Date.now()).toISOString(), name: 'Introduction to Mongoose3', price: 10, quantity: 25, quality: '25' });
    // save model to database
    book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
    });
   
});















app.use(morgan({
    connectionString: 'mongodb://localhost:27017/logs-db'
}));

app.use(ipWhitelist(ip => {
    return whitelist.indexOf(ip) !== -1;
}, function (req, res) { // Custom handling of blocked IPs
  res.statusCode = 500;
  res.end('You shall not pass!');
}));


app.post('/api/whitelist/:ip', (req, res) => {
    whitelist.push(req.params.ip);
    res.end('Added IP to whitelist');
});

// ------------------------------------------------------------------------------------

app.get('/api/whitelist', (req, res) => {
    console.log(req.connection.remoteAddress);
    res.json(whitelist);
});

//Set content directories
app.use(express.static(__dirname + '/html'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use("/image", express.static(__dirname + '/image'));
app.use("/uploads", express.static(__dirname + '/uploads'));

app.get('/', function(request, response) {
    htmlDir = './html/'
    response.sendFile(htmlDir + 'index.html');
});


/* app.get('/', (req, res) => {
    console.log(req.connection.remoteAddress);
    res.json(whitelist);
    
});
 */

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

// ------------------------------------------------------------------------------------

app.listen(port, function () {
    console.log(` app listening on port ${port}!`)
})

function getCurrentIndianDateTime(){
    var moment = require('moment-timezone');
    var time = moment.tz('America/Mexico City').format("YYYY-MM-DDTHH:MM:ss");
    return new Date(time);
}