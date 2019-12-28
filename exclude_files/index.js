const express = require('express');
var morgan = require('morgan')
const app = express();
const port = 3000;
const fs = require('fs');

var access = fs.createWriteStream('./var/log/node/api.access.log');
process.stdout.write = process.stderr.write = access.write.bind(access);

app.use(morgan('combined'))
app.get('/', (req, res) => res.send('Hello World'));

app.listen(port, () => console.log(`Started App on port ${port}`));