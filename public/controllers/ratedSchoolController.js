var app = angular.module('myApp',['ngCookies']);


app.run(function($cookies, $rootScope, $http, $window){

	if($cookies.get('token')){
		var info = {
			token : $cookies.get('token')
		}
		$http.post('/api/checkCookie', info).then(function(response){

			if(response.data.auth == true){
				console.log("match");
			}else if(response.data.auth == false){
				console.log("Not a match");
				$window.location.href = '/index.html';
			}
		});
	}else{
		$window.location.href = "/index.html";
	}
});


app.controller('ratedSchool',['$scope', '$http', '$cookies','$window',function($scope, $http, $cookies, $window){
	
	$scope.submitRating = function(){



		var school = {
			name : getURLParameter("name"),
			user : {
				email : $cookies.get('email'),
				rating : $scope.rating,
				comment : $scope.comment 
			}
		}
		console.log(school);

		$http.post('/api/saveRating', school).then(function(response){
			console.log(response.data);

		});

		$window.location.href = "/university.html?name="+getURLParameter("name");
	}

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}

}])