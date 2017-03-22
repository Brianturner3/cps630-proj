var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db = mongojs('mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj',['users']);
test = require('assert');
// Connection url
var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';
app.use(express.static(__dirname + '/public'));
// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  // Get an additional db
  if(err){
  	console.log("Error" + err.message);
  	db.close();
  }else{
  	console.log("connected");
  }
});

app.get('/api/users',function(req,res){
	console.log("I recieved a GET request");

	db.Users.find(function(err, docs){
		if(err){
			throw err.message;
		}else{
			console.log(docs);
			res.json(docs);
		}
	})
});
  //db.close();
  //console.log("connected");
  app.listen(3000);
  console.log("Server is running on port 3000");
