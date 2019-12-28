/* var express = require('express') 
var app = express()
const port = 5000;
  
// Part1, defining blacklist
var BLACKLIST =['::1'];// Part2, Geting client IP
var getClientIp = function(req) {
  var ipAddress = req.connection.remoteAddress;
  if (!ipAddress) {
    return '';
  }// convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
    console.log(ipAddress);
  }return ipAddress;
};//Part3, Blocking Client IP, if it is in the blacklist
app.use(function(req, res, next) {
  var ipAddress = getClientIp(req);  if(BLACKLIST.indexOf(ipAddress) === -1){
    next();
  } else {
    res.send(ipAddress + ' IP is not in whiteList')
  }
});app.get('/', function (req, res) {
   console.log(req.connection.remoteAddress);
   res.send('Hello World!');
})
1958116
 */

var express = require('express') 
var app = express()
const port = 5000;

const ipWhitelist = require('ip-whitelist');
 
let whitelist = [''];
 
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
app.get('/api/whitelist', (req, res) => {
    console.log(req.connection.remoteAddress);
    res.json(whitelist);
});

app.get('/', (req, res) => {
    console.log(req.connection.remoteAddress);
    res.json(whitelist);
});

app.listen(port, function () {
    console.log(` app listening on port ${port}!`)
})
