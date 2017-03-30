myApp = angular.module('myApp',['ngRoute']);

var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';

myApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider,$locationProvider) {
	$routeProvider

	.when("/login", {
		templateUrl : "views/login.html",
		controller: 'loginController'
	})
	
	.when("/signup",{
		templateUrl : "views/signup.html",
		controller : 'signUpController'
	})
	
	.otherwise({
		redirectTo: '/'});

	$locationProvider.html5Mode({enabled : true, requireBase: false});
}]);

