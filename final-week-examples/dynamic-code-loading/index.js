
const express = require('express');
const app = express();
const fs = require("fs");

app.use("/img", express.static("./images"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('./html/index.html', "utf8");
    res.send(doc);
});


app.get('/dynamically-loaded-script', function (req, res) {

    // we could hide this behind some session handling logic
    // IOW, the user has to be logged in, in order to be able to
    // access this script. For now, it's freely available
    res.setHeader('Content-Type', 'application/json');
    let doc = fs.readFileSync('./hidden/greeting.js', "utf8");
    res.send(doc);

});


app.get('/dynamically-loaded-class', function (req, res) {

    // we could hide this behind some session handling logic
    // IOW, the user has to be logged in, in order to be able to
    // access this script. For now, it's freely available
    res.setHeader('Content-Type', 'application/javascript');
    let doc = fs.readFileSync('./hidden/customer.js', "utf8");
    res.send(doc);

});


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('Listening on port ' + port + '!');
})
