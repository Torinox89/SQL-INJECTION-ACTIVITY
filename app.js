//create the server
const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Sqlite DB and populate
// create the mock database that will hold our log-in information.
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});


//create a GET method route to '/' that will send our HTML file to the browser (hint: res.sendFile('index.html')).
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// Express POST route to '/login' that will handle any forms that are submitted via our HTML log-in form.
app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

 //Remember! This SQL syntax is purposefully written badly for the purpose of our project. 
 //SQL queries should never be written this way in practice.
	var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

	console.log("username: " + username);
	console.log("password: " + password);
	console.log('query: ' + query);

//POST request, let's run a sqlite method db.get() in order to verify our log in and handle errors in the //event of invalid log in:
db.get(query, function (err, row) {

    if (err) {
        console.log('ERROR', err);
        res.redirect("/index.html#error");
    } else if (!row) {
        res.redirect("/index.html#unauthorized");
    } else {
        res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
    }
});

});

//call app.listen(), passing in a port of our choosing
app.listen(3000);


