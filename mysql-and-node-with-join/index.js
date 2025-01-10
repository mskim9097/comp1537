const express = require("express");
const app = express();
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

// the usual way
app.get("/table-async", function (req, res) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        // 127.0.0.1
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    });
    let myResults = null;
    connection.connect();
    // this could be from the req.body.user
    let usr = "a-aron";
    let pwd = "a123";
    connection.execute(
        "SELECT * FROM user WHERE user.user_name = ? AND user.password = ?",
        [usr, pwd],
        function (error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
            console.log("results:", results);
            //console.log("Results from DB", results, "and the # of records returned", results.length);
            // hmm, what's this?
            myResults = results;
            if (error) {
                // in production, you'd really want to send an email to admin
                // or in the very least, log it. But for now, just console
                console.log(error);
            }
            // let's get the data but output it as an HTML table
            let table = "<table><tr><th>ID</th><th>Name</th><th>Email</th></tr>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr><td>" + results[i].ID + "</td><td>" + results[i].user_name + "</td><td>"
                    + results[i].first_name + "</td></tr>";
            }
            // don't forget the '+'
            table += "</table>";
            res.send(table);
            connection.end();
        }
    );
    /* null? Yes, but why?
       Hint: remember week 9, slide 2:
       - Knock, knock
       - An async function
       - Who's there?
     */
    console.log(myResults, "why is this null?");
});

app.get("/table-join", function (req, res) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    });
    let myResults = null;
    connection.connect();
    // this could be from the req.body.user
    let usr = "a-aron";
    connection.execute(
        "SELECT address.street, address.postal_code, user.first_name FROM address INNER JOIN user ON address.user_id = user.ID AND user.user_name = ?",
        [usr],
        function (error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
            console.log("results:", results);
            if (error) {
                // in production, you'd really want to send an email to admin
                // or in the very least, log it. But for now, just console
                console.log(error);
            }
            // let's get the data but output it as an HTML table
            let table = "<table><tr><th>Street</th><th>Postal Code</th>";
            for (let i = 0; i < results.length; i++) {
                table += "<tr>"
                for (const property in results[i]) {
                    table += "<td>" + results[i][property] + "</td>";
                }
                table += "</tr>";
            }
            // don't forget the '+'
            table += "</table>";
            res.send(table);
            connection.end();
        }
    );

});

/*
 * This one accepts a query string
 */
app.get("/table-sync", function (req, res) {

    connectToMySQL(res);

});

async function connectToMySQL(res) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "test",
        multipleStatements: true
    });
    connection.connect();
    // this could be from the req.body.user
    let usr = "a-aron";
    let pwd = "a123";
    const [rows, fields] = await connection.execute("SELECT * FROM user WHERE user.user_name = ? AND user.password = ?", [usr, pwd]);
    let table = "<table><tr><th>ID</th><th>Name</th><th>Email</th></tr>";
    for (let i = 0; i < rows.length; i++) {
        table += "<tr><td>" + rows[i].ID + "</td><td>" + rows[i].first_name + "</td><td>"
            + rows[i].last_name + "</td></tr>";
    }

    console.log("rows", rows);
    // don't forget the '+'
    table += "</table>";
    await connection.end();
    res.send(table);

}

// RUN SERVER
let port = 8000;
app.listen(port, function() {
    console.log("Listening on port " + port + "!");
});
