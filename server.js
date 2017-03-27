var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';
var db = mongojs('mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj',['users']);
test = require('assert');
// Connection url
var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
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

	db.users.find(function(err, docs){
		if(err){  
			throw err.message;
		}else{
			console.log(docs);
			res.json(docs);
		}
	})
});

app.post('/api/registerUser', function(req,res){
  console.log("Recieved Registration");
  console.log(req.body.name);
  var email = req.body.email;
  var password = req.body.password;

  db.users.find({'email' : email},function(err,docs){
    if(err){
      throw err.message;
    }else if(docs.length == 1){
      console.log("User already exists");
    }else if(docs.length == 0){
      console.log("User does not exist");
      insertIntoDb(req.body)
    }
  });

  var insertIntoDb = function(request){
    db.users.insert(request, function(err,docs){
      res.json(docs);
      console.log("inserted into db");
    })
  }
});

app.post('/api/loginUser', function(req,res){
  var email = req.body.email;
  var password = req.body.password;

  console.log(email + " " + password);

  db.users.find({'email' : email, 'password' : password},function(err,docs){
    if(err){
      throw err.message;
    }else if(docs.length == 1){
      console.log("Logging in");
    }else{
      console.log("Can't find you");
    }
  })
});
  //db.close();
  //console.log("connected");
  app.listen(3000);
  console.log("Server is running on port 3000");
