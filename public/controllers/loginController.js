var myApp = angular.module("myApp",[]);
myApp.controller('loginController', function($scope,$html){
	
	$scope.loginUser = function(){
		console.log("logging user in");
		$http.post('/api/loginUser'.then(function(response){
			console.log(response);
		}));
	}
	/*http.post('/api/putUsers',$scope.user).then(function(res){
		console.log(res);
		refresh();
	});*/

});
