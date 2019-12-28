var express = require('express') 
var app = express()
var server = require('http').Server(app);
const port = process.env.PORT || 3000;
const ipWhitelist = require('ip-whitelist');
// mongoose-morgan
var morgan = require('mongoose-morgan');
var fs = require('fs');
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var formidable = require('formidable');
const path = require('path');
var mongoose = require('mongoose'); 
var mongoDBUri = process.env.MONGODB_URI;  
var mongoDBAtlasUri = process.env.MONGODB_ATLAS
;  
var mongoDBUsed = mongoDBAtlasUri
//var mongoDBUri = 'mongodb://localhost:27017/logger'

/* let whitelist = ['::1']; */
// THIS IS THE ARRAY CONTAINING THE IPS WHITELIST
let whitelist = ['::1', '::ffff:127.0.0.1', '::ffff:10.69.244.94'];

var moment = require('moment-timezone');
console.log(getCurrentIndianDateTime());

logMongo('Introduction to Mongoose2');

app.use(morgan({
    connectionString: mongoDBUsed
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
    console.log(JSON.stringify(req));
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
    console.log(req);
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
    var time = moment.tz('America/Mexico_City').format("YYYY-MM-DDTHH:MM:ss");
    return new Date(time);
}

function logMongo (messageTxt) {

    // make a connection
    mongoose.connect(mongoDBUsed, { useNewUrlParser: true, useUnifiedTopology: true });
    // get reference to database
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connection to " + mongoDBUsed + "  -> Successful!");
        // define Schema
        var messageSchema = mongoose.Schema({
        date: Date,
        logMessage: String
        });
    
        // compile schema to model
        var message = mongoose.model('Message', messageSchema, 'logs');
        // a document instance
        var Message1 = new message({ date: new Date(Date.now()).toISOString(), logMessage: messageTxt });
        // save model to database
        Message1.save(function (err, message) {
        if (err) return console.error(err);
        console.log(message.logMessage + " saved to logs collection.");
        });
    
    });
}