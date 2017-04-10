var myApp = angular.module('myApp',['ngCookies']);

myApp.run(function($cookies, $rootScope, $http,$window){
	/*if($cookies.get('token') && $cookies.get('email')){
		$rootScope.token = $cookies.get('token');
		//$window.location.href = '/home.html?user='+user.email;
	}*/
	//If token is set then compare this token with the one on the server.
	//if response is good then let them in
	if($cookies.get('token')){
		var info = {
			token : $cookies.get('token')
		}
		$http.post('/api/checkCookie', info).then(function(response){

			if(response.data.auth == true){
				console.log("match");
				$window.location.href = '/index.html';
			}else if(response.data.auth == false){
				console.log("Not a match");
			}
		});
	}

});

myApp.controller('loginController', ['$scope', '$http', '$window' , '$cookies', '$rootScope', function($scope, $http, $window, $cookies, $rootScope){
	
	$scope.loginUser = function(){

		var user = {
			email : $scope.loginEmail,
			password : $scope.loginPassword,
		}

		$http.post('/api/loginUser', user).then(function(response){
			if( (response.status == 200) ){
				console.log(response.data.token);
				$cookies.put('token', response.data.token);
				$cookies.put('email', user.email);
				$rootScope.token = response.data.token;
				$rootScope.email = response.data.email;
				$window.location.href = '/index.html';
			}
			else{
				alert("Username/Password Incorrect");
			}
		});

	}
}]);