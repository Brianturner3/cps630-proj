var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';
var db = mongojs('mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj',['users']);
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Connection url
var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(session({
  secret : "cps630proj",
  saveUninitialized : true,
  resave : true,
  cookie : {
    maxAge : 30000000 //5 minutes
   }
}));

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
 * Check the cookie to see if it is still valid 
 */
 app.post('/api/checkCookie', function(req,res){
  var clientC = req.body.token;
  var serverC = req.cookies["connect.sid"];
  
  console.log("Client " + clientC);
  console.log("Server " + serverC);
  if(clientC == serverC){
    console.log("match");
    res.json({auth : true})
  }else{
    console.log("No match, sign-in again");
    res.json({auth : false})
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
  console.log(db.users);
  db.users.find({'email' : email, 'password' : password},function(err,docs){
    if(err){
      throw err.message;
    }else if(docs.length == 1){
      var mytoken = req.cookies["connect.sid"];
      //console.log(req.session.cookies.maxAge);
      console.log("Cookies " + req.cookies);
      res.json({token : mytoken});
      console.log("Logging in");
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
 * 'api/saveSchool' saves the school found in the http.body and saves it into t
 * he favorite list for the current user.
 */
 app.post('/api/removeSchool', function(req,res){
  console.log("Recieved Rmove School Request");
  var userEmail = req.body.email;
  var school = req.body.school;
  //Get the favorite schools for a user 
  db.users.find( {"email" : userEmail},function(err,docs){
    db.users.update({"email": userEmail}, {$pull : {favoriteSchools : {$in : [school]}}},function(){
      console.log("update successful");
    });
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

app.post('/api/saveRating', function(req,res){
  var mySchool = req.body.name;
  var myUser = req.body.user;
  console.log(mySchool);
  console.log(myUser);
  db.ratedschools.find({ratedschools: mySchool},function(err,docs){
    if(docs.length == 0){
        db.ratedschools.insert({ratedschools: mySchool, usersArray:[myUser]},function(){
          console.log("update successful on insert");
        })
    }else{
        db.ratedschools.update({ratedschools: mySchool},{$push : {usersArray : myUser}}, function(){
          console.log("update successful");

        })
      //Add to exisitng
    }
  });
  /*for(var i = 0; i < db.ratedSchools[0].length;i++){
    if(db.ratedSchools[i]["school.name"] == mySchool){
       console.log(db.ratedSchools[i]["school.name"]);
      console.log("match");
    }else{
      console.log(db.ratedSchools[i]["school.name"]);
      console.log("no match");
    }
  }*/
});

app.post('/api/loadComments',function(req,res){
  
  var mySchool = req.body.school;

  db.ratedschools.find({ratedschools:mySchool},function(err,docs){
    res.json(docs);
  })
})

var port = process.env.port || 5000;
app.listen(port,function(){
  console.log("Connected at " + port);
});
