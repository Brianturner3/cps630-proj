/*myApp.controller('loginController', function($scope,$html){
	
	$scope.loginUser = function(){
		console.log("logging user in");
		$http.post('/api/loginUser'.then(function(response){
			console.log(response);
		}));
	}
	/*http.post('/api/putUsers',$scope.user).then(function(res){
		console.log(res);
		refresh();
	});

});*/

/*login controller*/
angular.module('myApp')
	.controller('loginController',function($scope,$http,$window){

	$scope.loginUser = function(){

		var user = {
			email : $scope.loginEmail,
			password : $scope.loginPassword,
		}
		var refresh = function(){
			$scope.name = "";
			$scope.email = "";
			$scope.password = "";
			confirm_password = "";
		}
		console.log("logging user in");
		$http.post('/api/loginUser', user).then(function(response){
			console.log(response);
			$window.location.href = '/home.html'
		});
	}

});