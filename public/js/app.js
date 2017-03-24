myApp = angular.module('myApp',['ngRoute']);
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){
	$routeProvider.when('/loginn', { templateURL : 'login.html'});
	$routeProvider.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode({enabled : true, requireBase: false});
}]);


