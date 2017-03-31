myApp = angular.module('myApp',['ngRoute']);

var url = 'mongodb://turner:cupcake@ds129010.mlab.com:29010/cps630proj';

<<<<<<< HEAD
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){
	$routeProvider.when("/login", {
=======
myApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider,$locationProvider) {
	$routeProvider

	.when("/login", {
>>>>>>> ed158c9172aa4b015e4d02df74b65205c35f2c50
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

<<<<<<< HEAD
myApp.controller('loginController',function($scope,$http,$window){

	$scope.loginUser = function(){

		var user = {
			email : $scope.loginEmail,
			password : $scope.loginPassword,
		}
		var refresh = function(){
			$scope.name = "";
			$scope.email = "";
			$scope.password = "";
			$scope.confirm_password = "";
		}
		console.log("logging user in");
		$http.post('/api/loginUser', user).then(function(response){
			console.log(response);
			$window.location.href = '/home.html?user='+user.email;
		});
	}

});

myApp.controller('signUpController', function($scope,$http){

	$scope.registerUser = function(){

		var validateEmail = function(email){
   			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(email);
		}
		var refresh = function(){
			$scope.name = "";
			$scope.email = "";
			$scope.password = "";
			confirm_password = "";
		}	
		var user = {
			name : $scope.name,
			email : $scope.email,
			password : $scope.password,
			confirm_password : $scope.confirmPassword,
			favoriteSchools : []
		}
		if(!validateEmail(user.email)){
			alert("Email incorrect");
		}
		else if(user.password != user.confirm_password){
			alert("passwords do not match!");
		}else{
			console.log(user);
			$http.post('/api/registerUser', user).then(function(response){
				console.log(response);
				refresh();
			});
		}
	}
});


=======
>>>>>>> ed158c9172aa4b015e4d02df74b65205c35f2c50
