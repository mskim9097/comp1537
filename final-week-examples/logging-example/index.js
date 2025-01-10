
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const fs = require("fs");


const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
});

app.use(morgan(':referrer :url :user-agent',
               { stream: accessLogStream }));


app.get('/', function (req, res) {
    let doc = fs.readFileSync('./index.html', "utf8");


    res.set('Server', 'Wazubi Engine');
    res.set('X-Powered-By', 'Wazubi');
    res.send(doc);

});


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port + '.');
});
