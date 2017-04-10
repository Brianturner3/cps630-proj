var app = angular.module('app',['ngCookies']);
app.run(function($cookies, $rootScope, $http,$window){
	//If token is set then compare this token with the one on the server.
	//If the server cookies matches with the client then proceed to page.
	//If there is no cookie set then go directly to the login page
	if($cookies.get('token')){
		var info = {
			token : $cookies.get('token')
		}
		$http.post('/api/checkCookie', info).then(function(response){
			console.log("before");
			if(response.data.auth == true){
				console.log("match");
			}else{
				console.log("")
				$window.location.href = '/index.html';
			}
			console.log("after");
		});
	}else{
		$window.location.href = '/index.html';
	}

});
app.controller('loadFav',function($scope,$http,$cookies,$window){
	$scope.load = function(){
		var userName = $cookies.get("email");
		console.log(userName);
		//Have to pass an object to POST
		var info = {
			email : userName
		}
		$http.post('/api/getSavedSchools', info).then(function(response){
			var element = document.getElementById("favSchools");
			console.log(response.data);
			if(response.data.length >0){
				for(var i = 0; i<response.data.length; i++){
					var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+response.data[i]+"&_fields=school.name,school.city,school.state,2014.student.size,school.school_url,2014.admissions.admission_rate.overall,2014.completion.completion_rate_4yr_150nt_pooled&api_key="+key;
					sendRequest(url,response.data[i]);
				}//for loop at i ends
			}else{
					var div = document.createElement("div");
					var p = document.createElement("p");
					p.className = "info";
					var pText = document.createTextNode("No favorite schools :(");
					p.appendChild(pText);
					div.appendChild(p);
					element.appendChild(div);
				}
			});
	}
	function sendRequest(url,sName){
		var key = "Zw3luZF61RH5Nv1Up0LZNLLFK7bSJv1af3FJzLIu";
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var data = JSON.parse(xmlhttp.responseText);
				console.log(data);
				if(data.results.length>0){
					var element = document.getElementById("favSchools");
					

					for (var i = 0; i<data.results.length; i++){

						//Wrap around the content div
						var wrapDiv = document.createElement("div");
						wrapDiv.className = "eachSchoolWrapper";
						wrapDiv.id = "eachSchoolWrapperID"

						var div = document.createElement("div");
						div.className = "eachSchool";
						div.id = "eachSchool";
					

						if(data.results[i]['school.name']==sName){
							getRating(data.results[i]['school.name'],div);
							

							var pSchoolLocation = document.createElement("p");
							pSchoolLocation.className = "info";
							var pSchoolCityText =document.createTextNode(data.results[i]['school.city']+", ");
							pSchoolLocation.appendChild(pSchoolCityText);

							var pSchoolStateText =document.createTextNode(data.results[i]['school.state']);
							pSchoolLocation.appendChild(pSchoolStateText);
							div.appendChild(pSchoolLocation);
							var a = document.createElement("a");
							a.className = "infoSchoolName";
							var pSchoolName = document.createTextNode(data.results[i]['school.name']);
							a.setAttribute('href', "university.html?name="+data.results[i]['school.name']);
							a.appendChild(pSchoolName);
							div.appendChild(a);


							var pSchoolSize = document.createElement("p");
							pSchoolSize.className = "info";
							var pSchoolSizeText =document.createTextNode(numberWithCommas(data.results[i]['2014.student.size']) + " undergraduate students");
							pSchoolSize.appendChild(pSchoolSizeText);
							div.appendChild(pSchoolSize);	

							var pSchoolUrlText = document.createTextNode("Website: ");
							div.appendChild(pSchoolUrlText);
							var aSchoolUrl = document.createElement("a");
							aSchoolUrl.className = "info";
							var aSchoolUrlText = document.createTextNode(data.results[i]['school.school_url']);
							aSchoolUrl.setAttribute('href', "http://"+data.results[i]['school.school_url']);
							aSchoolUrl.appendChild(aSchoolUrlText);
							div.appendChild(aSchoolUrl);

							wrapDiv.appendChild(div);
							element.appendChild(wrapDiv);
						}
					}
				}else{
					var header = document.createElement("h3");
					var h1 = document.createTextNode("No such schools with keyword \"" + searchedUni + "\"");
					header.appendChild(h1);

					var element = document.getElementById("university");
					element.appendChild(header);
				}
			}
		};

		xmlhttp.open ("GET", url, true);
		xmlhttp.send();
	}
	function getRating(sName,d){
		var schoolobj = {
		school : sName
		}
		
		$http.post('/api/loadComments',schoolobj).then(function(response){
			if(response.data.length >0){
			console.log(response);
			var sum = 0;
			for(var i = 0; i < response.data[0]["usersArray"].length; i++){
				sum = sum + parseInt(response.data[0]["usersArray"][i].rating);
			}
			var p = document.createElement("p");
			p.className = "info";
			var pText = document.createTextNode("Rating: " +(sum/response.data[0]["usersArray"].length).toFixed(1) + "\/5");
			p.appendChild(pText);
			d.appendChild(p);
		}
		});
	}
});

