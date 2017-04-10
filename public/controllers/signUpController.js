var app = angular.module('myApp',[])
app.controller('signUpController', function($scope,$http,$window){

	$scope.registerUser = function(){

		var validateEmail = function(email){
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
		var refresh = function(){
			$scope.name = "";
			$scope.email = "";
			$scope.password = "";
			$scope.confirmPassword = "";
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
				alert("YOU ARE REGISTERED, SEARCH AWAY!");
				refresh();
			});
		}
	}
});