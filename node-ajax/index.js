// https://expressjs.com/en/guide/routing.html

// REQUIRES
const express = require("express");
const app = express();
//const app = require("express")();
app.use(express.json());
const fs = require("fs");


// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));


app.get("/", function (req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");

    // just send the text stream
    res.send(doc);
});

app.get("/markers", function (req, res) {

    let doc = fs.readFileSync("./app/data/google-map-markers.js", "utf8");
    res.setHeader("Content-Type", "application/json");
    // just send the text stream
    res.send(doc);
});

/*
 * This one accepts a query string
 */
app.get("/weekdays", function(req, res) {

    let formatOfResponse = req.query["format"];
    //let formatOfResponse = req.query.format;
    //console.log(req.query);

    // e.g.,: http://localhost:8000/weekdays?format=html
    // e.g.,: http://localhost:8000/weekdays?format=json
    if (formatOfResponse == "html") {
        // MIME type
        res.setHeader("Content-Type", "text/html");
        res.send(fs.readFileSync("./app/data/weekdays.html", "utf8"));

    } else if (formatOfResponse == "json") {
        // MIME type
        res.setHeader("Content-Type", "application/json");
        res.send(fs.readFileSync("./app/data/weekdays.js", "utf8"));

    } else {
        // just send JSON message
        res.send({ status: "fail", msg: "Wrong format!" });
    }
});

app.get("/date", function (req, res) {

    res.setHeader("Content-Type", "text/text");
    // just send the text stream
    res.send({"date": new Date()});
});


// for page not found (i.e., 404)
app.use(function (req, res, next) {
    // this could be a separate file too - but you'd have to make sure that you have the path
    // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});
