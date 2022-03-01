var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Sends home page
app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '/index.html'));
});

// Returns the complete favs.json file
app.get('/show', function (req, res) {
	// Gets file and converts into a JSON to return
	fs.readFile(__dirname + "/" + "favs.json", 'utf8', function (err, data) {
		data = JSON.parse(data);
		res.json(data);
		console.log('Sent favs.json');
	});
});

// Create a new tweet
app.post('/create', function (req, res) {
	// Extracts necessary data and create object to add to JSON
	var tweetText = req.body.text;
	var tweetID = req.body.id;
	var tweet = {"text": tweetText,
		"id": Number(tweetID),
		"created_at": "unknown",
		"user": {
			"name": "unnamed",
			"id": 0
		}
	};
	
	// Get JSON object from favs.json and insert new tweet
	// reference: https://www.geeksforgeeks.org/how-to-add-data-in-json-file-using-node-js/
	var data = fs.readFileSync(__dirname + "/" + "favs.json");
	var myObject = JSON.parse(data);
	myObject.push(tweet);
	
	// Saves updated JSON to file
	var newData = JSON.stringify(myObject);
	fs.writeFile(__dirname + "/" + "favs.json", newData, err => {
		if (err) throw err;
		console.log('Updated favs.json');
	});
	
	// Indicate process completed sucessfully
	res.send('Created a tweet');
	console.log('Created tweet');
});

// Update a username
app.put('/update', function(req, res) {
	// Extract necessary data
	var oldName = req.body.oldname;
	var newName = req.body.newname;
	
	// Get JSON object from favs.json
	// reference: https://www.geeksforgeeks.org/how-to-add-data-in-json-file-using-node-js/
	var data = fs.readFileSync(__dirname + "/" + "favs.json");
	var myObject = JSON.parse(data);
	
	// Update name in every tweet
	myObject.forEach(function (product, index) {
		if (product.user.name == oldName)
		{
			product.user.name = newName;
		}
	});
	
	// Saves updated JSON to file
	var newData = JSON.stringify(myObject);
	fs.writeFile(__dirname + "/" + "favs.json", newData, err => {
		if (err) throw err;
		console.log('Updated favs.json');
	});
	
	// Indicate process completed sucessfully
	res.send('Updated name');
	console.log('Updated a username');
});

// Delete a post
app.delete('/delete/:id', function(req, res) {
	// Extract necessary data
	var id = req.params.id;
	var data = fs.readFileSync(__dirname + "/" + "favs.json");
	var myObject = JSON.parse(data);
	
	// Remove indicated tweet (including copies)
	// reference: https://www.youtube.com/watch?v=G0BzzuXS8gI&ab_channel=LearnCodingTutorials
	var found = false;
	
	myObject.forEach(function (product, index) {
		if (!found && product.id === Number(id)) {
			myObject.splice(index,1);
		}
	});
	
	// Save updated JSON object to file
	// reference: https://www.geeksforgeeks.org/how-to-add-data-in-json-file-using-node-js/
	var newData = JSON.stringify(myObject);
	fs.writeFile(__dirname + "/" + "favs.json", newData, err => {
		if (err) throw err;
		console.log('Updated favs.json');
	});
	
	// Indicate process completed successfully
	res.send('Successfully delete tweet');
	console.log('Deleted a tweet');
});


var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Assignment_1 app listening at http://%s:%s", host, port)
});