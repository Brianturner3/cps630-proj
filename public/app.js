myApp = angular.module('myApp',['ngRoute']);
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){
	$routeProvider.when("/login", {
		templateUrl : "views/login.html",
		controller: 'loginController'
	})
	.when("/signup",{
		templateUrl : "views/signup.html",
		controller : 'signUpController'
	})
	.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({enabled : true, requireBase: false});
}]);

myApp.controller('loginController',function($scope,$http){
	$scope.loginUser = function(){
		console.log("logging user in");
		$http.post('/api/loginUser'.then(function(response){
			console.log(response);
		}));
	}
});

myApp.controller('signUpController', function($scope){
	
});


