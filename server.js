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
/*
 * Return all entries in the db
 */
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
/*
 * Register the user
 */
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
/*
 * /api/loginUser Takes the email and password found in the request 
 * and attempts to match it with one in the db. If found, send a res.
 * back to the client.
 */
app.post('/api/loginUser', function(req,res){
  var email = req.body.email;
  var password = req.body.password;

  console.log(email + " " + password);

  db.users.find({'email' : email, 'password' : password},function(err,docs){
    if(err){
      throw err.message;
    }else if(docs.length == 1){
      console.log("Logging in");
      res.json(docs);
    }else{
      console.log("Can't find you");
    }
  })
});
/*
 * 'api/saveSchool' saves the school found in the http.body and saves it into t
 * he favorite list for the current user.
 */
app.post('/api/saveSchool', function(req,res){
  console.log("Recieved Save School Request");
  var userEmail = req.body.email;
  var school = req.body.school;
  //Get the favorite schools for a user 
  db.users.find( {"email" : userEmail},function(err,docs){
    var listOfSchools = docs[0].favoriteSchools, i = 0, bContains;
    for(i; i<listOfSchools.length;i++){
      if( (listOfSchools[i].trim().localeCompare(school)) === 0)
        bContains = true;
    }
    if(!bContains){
      db.users.update({ "email" : userEmail},{ $push : {favoriteSchools : school}}, function(){
        console.log("update successful");
        res.json(docs);
      });
    }
  });
});
/*
'api/getSavedSchools' retrieves list of saved schools from db and returns to client.
 */
app.post('/api/getSavedSchools', function(req,res){
  console.log("Recieved request for saved schools");
  var userEmail = req.body.email;
  console.log(userEmail);
  db.users.find({'email' : userEmail}, function(err,docs){
    console.log(docs[0].favoriteSchools);
    res.json(docs[0].favoriteSchools);
  });
});

  app.listen(3000);
  console.log("Server is running on port 3000");
