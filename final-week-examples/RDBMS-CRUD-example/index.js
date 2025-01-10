"use strict";

const express = require('express');
const app = express();
const fs = require("fs");
const mysql = require('mysql2');

app.use("/img", express.static("./images"));

app.get('/', function (req, res) {


    // Let's build the DB if it doesn't exist
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      multipleStatements: true
    });

    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS test;
        use test;
        CREATE TABLE IF NOT EXISTS customer (
        ID int NOT NULL AUTO_INCREMENT,
        name varchar(30),
        email varchar(30),
        PRIMARY KEY (ID));`;

    connection.connect();
    connection.query(createDBAndTables, function (error, results, fields) {
      if (error) {
          console.log(error);
      }
      console.log(results);

    });
    connection.end();

    let doc = fs.readFileSync('./index.html', "utf8");
    res.send(doc);
});


app.get('/get-customers', function (req, res) {

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test'
    });
    connection.connect();
    connection.query('SELECT * FROM customer', function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({ status: "success", rows: results });

    });
    connection.end();


});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Notice that this is a 'POST'
app.post('/add-customer', function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      console.log("Name", req.body.name);
      console.log("Email", req.body.email);

      let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
      });
      connection.connect();
      // TO PREVENT SQL INJECTION, DO THIS:
      // (FROM https://www.npmjs.com/package/mysql#escaping-query-values)
      connection.query('INSERT INTO customer (name, email) values (?, ?)',
            [req.body.name, req.body.email],
            function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        //console.log('Rows returned are: ', results);
        res.send({ status: "success", msg: "Record added." });

      });
      connection.end();

});

// POST: we are changing stuff on the server!!!
app.post('/delete-all-customers', function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
      });
      connection.connect();
      // NOT WISE TO DO, BUT JUST SHOWING YOU CAN
      connection.query('DELETE FROM customer',
            function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        //console.log('Rows returned are: ', results);
        res.send({ status: "success", msg: "Recorded all deleted." });

      });
      connection.end();

});

// ANOTHER POST: we are changing stuff on the server!!!
app.post('/update-customer', function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
      });
      connection.connect();
console.log("update values", req.body.email, req.body.id)
      connection.query('UPDATE customer SET email = ? WHERE ID = ?',
            [req.body.email, req.body.id],
            function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        //console.log('Rows returned are: ', results);
        res.send({ status: "success", msg: "Recorded updated." });

      });
      connection.end();

});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
  console.log('CRUD app listening on port ' + port + '!');
})
