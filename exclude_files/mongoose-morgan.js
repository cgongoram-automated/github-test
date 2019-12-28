// express
var express = require('express');
var app = express();

// mongoose-morgan
var morgan = require('mongoose-morgan');

// connection-data
var port = process.env.port || 8080;

// Logger
app.use(morgan({
    connectionString: 'mongodb://localhost:27017/logs-db'
}));

// run
app.listen(port);
console.log('works... ' + port);

