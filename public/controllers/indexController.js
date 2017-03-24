var myApp = angular.module("myApp",[]);
var url = 'mongodb://admin:1234@ds135690.mlab.com:35690/researchfund';
myApp.controller('AppCtrl',['$scope', '$http', function($scope,$http){

	$http.get('/api/users').then(function(response){
		console.log("I got my data");
		$scope.researchfund = response.data;
	})



}]);

/*
	var refresh = function(){
		$http.get('/Users').then(function(response) {
			console.log("I got the data i requested");
			$scope.Users = response.data;
		});
	};
	refresh();

	$scope.addContact = function(){
		console.log($scope.user);
		$http.post('/Users', $scope.user).then(function(response){
			console.log(response);
			refresh();
		})
	};

	$scope.remove = function(id){
		console.log(id);
		$http.delete('/Users'+id).then(function(response){
			refresh();
		});
	}

	$scope.edit = function(id){
		console.log(id);
		$http.get('/Users/'+id).then(function(response){
			$scope.user = response.data;
		});
	}

	$scope.update = function(){
		console.log($scope.user._id);
		$http.put('/Users/' + $scope.user._id, $scope.user).then(function(response){
			refresh();
		});
	};

	$scope.deselect = function(){
		$scope.user = "";
	}
 */