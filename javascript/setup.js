var mongoose = require('mongoose');
var express = require('express');
var app = express();
var db = mongoose.connection;

/**
 * [description]
 * @param  {[type]} ){		console.log("We're Connected");});var Schema [description]
 * @return {[type]}                         [description]
 */
mongoose.connect('mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj');
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function(){
	//We're connected
	console.log("We're Connected");
});


/**
 * [Schema description]
 * @type {[type]}
 */
//Define a Schema
var userSchema = mongoose.Schema({
	name: String
})
//To use our Schema we convert it into a Model
var User = mongoose.model('User', userSchema);

