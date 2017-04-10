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
				$window.location.href = '/login.html';
			}
		});
	}else{
		$window.location.href = "/login.html";
	}
});



app.controller('universitySearch', ['$scope', '$http','$cookies','$injector','$window',function($scope, $http, $cookies, $injector,$window){
	var key = "Zw3luZF61RH5Nv1Up0LZNLLFK7bSJv1af3FJzLIu";
	var searchedUni;
	var selectedSchool = getURLParameter('name');
	//Retrieve University
	$scope.getUni = function(){
		var uniDiv = document.getElementById("university");
		var filterProgram = document.getElementById("dropDownPrograms").value;
		if(document.getElementById("university")&&document.getElementById("uni").value){			
			uniDiv.style.display = "block";
		}

		searchedUni = document.getElementById("uni").value;

		var checkUniNode = document.getElementById("university");
		while(checkUniNode.firstChild) {
			checkUniNode.removeChild(checkUniNode.firstChild);
		}
		updateUni(searchedUni,filterProgram);


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
				var pText = document.createTextNode("Rating: " +(sum/response.data[0]["usersArray"].length).toFixed(1) + "\/5");
				p.appendChild(pText);
				d.appendChild(p);
			}
		});
	}


	function updateUni(u,p){
		if(p == "any"){
			var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+u+"&_sort=2014.student.size:desc&_fields=school.name,school.city,school.state,2014.student.size,school.school_url,2014.admissions.admission_rate.overall,2014.completion.completion_rate_4yr_150nt_pooled&api_key="+key;
		}else{
			var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+u+"&_sort=2014.student.size:desc&_fields=school.name,school.city,school.state,2014.student.size,school.school_url,2014.admissions.admission_rate.overall,2014.completion.completion_rate_4yr_150nt_pooled&2014.academics.program.degree."+p+"__range=1..&api_key="+key;
		}
		sendRequest(url,p);
	}
/*
	function enter(e){
		e = e || $window.event;
		if(e.keyCode == 13){
			document.getElementById("btn").click();
			console.log("pressed");
			return false;
		}
		return true;
	}
	*/

	function sendRequest(url,p){
		var keysToPrograms = {"agriculture": "Agriculture, Agriculture Operations, And Related Sciences", "resources": "Natural Resources And Conservation", "architecture":"Architecture And Related Services", "ethnic_cultural_gender": "Area, Ethnic, Cultural, Gender, And Group Studies", "communication": "Communication, Journalism, And Related Programs","communications_technology": "Communications Technologies/Technicians And Support Services","computer":"Computer And Information Sciences And Support Services","personal_culinary": "Personal And Culinary Services","education":"Education","engineering":"Engineering","engineering_technology": "Engineering Technologies And Engineering-Related Fields","language":"Foreign Languages, Literatures, And Linguistics","family_consumer_science":"Family And Consumer Sciences/Human Sciences","legal":"Legal Professions And Studies","english":"English Language And Literature/Letters","humanities":"Liberal Arts And Sciences, General Studies And Humanities","library":"Library Science","biological":"Biological And Biomedical Sciences","mathematics":"Mathematics And Statistics","military":"Military Technologies And Applied Sciences","multidiscipline":"Multi/Interdisciplinary Studies","parks_recreation_fitness":"Parks, Recreation, Leisure, And Fitness Studies","philosophy_religious":"Philosophy And Religious Studies","theology_religious_vocation":"Theology And Religious Vocations","physical_science":"Physical Sciences","science_technology":"Science Technologies/Technicians","psychology":"Psychology","security_law_enforcement":"Homeland Security, Law Enforcement, Firefighting And Related Protective Services","public_administration_social_service":"Public Administration And Social Service Professions","social_science":"Social Sciences","construction":"Construction Trades","mechanic_repair_technology":"Mechanic And Repair Technologies/Technicians","precision_production":"Precision Production","transportation":"Transportation And Materials Moving","visual_performing":"Visual And Performing Arts","health":"Health Professions And Related Programs","business_marketing":"Business, Management, Marketing, And Related Support Services","history":"History"};
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var data = JSON.parse(xmlhttp.responseText);
				console.log(data);
				if(data.results.length>0){
					var header = document.createElement("h5");
					if(p == "any"){
						var h5 = document.createTextNode("List of all schools with keyword \""+ searchedUni +"\"");
					}else{
						var h5 = document.createTextNode("List of all schools with keyword \""+ searchedUni +"\" who offers "+keysToPrograms[p]);
					}
					header.appendChild(h5);

					var element = document.getElementById("university");
					element.appendChild(header);

					for (var i = 0; i<data.results.length; i++){
						//Wrap around the content div
						var wrapDiv = document.createElement("div");
						wrapDiv.className = "eachSchoolWrapper";
						wrapDiv.id = "eachSchoolWrapperID"

						var div = document.createElement("div");
						div.className = "eachSchool";
						div.id = "eachSchool";


						if(data.results[i]['2014.student.size'] != null){
							var pSchoolLocation = document.createElement("p");
							pSchoolLocation.className = "info";
							var pSchoolCityText =document.createTextNode(data.results[i]['school.city']+", ");
							pSchoolLocation.appendChild(pSchoolCityText);
							var pSchoolStateText =document.createTextNode(data.results[i]['school.state']);
							pSchoolLocation.appendChild(pSchoolStateText);
							div.appendChild(pSchoolLocation);

							getRating(data.results[i]['school.name'],div);

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
					if(p == "any"){
					var h1 = document.createTextNode("No such schools with keyword \"" + searchedUni + "\"");
					}else{
					var h1 = document.createTextNode("No such schools with keyword \"" + searchedUni + "\"who offers "+keysToPrograms[p]);
					}
					header.appendChild(h1);

					var element = document.getElementById("university");
					element.appendChild(header);
				}
			}
		};

		xmlhttp.open ("GET", url, true);
		xmlhttp.send();
	}

	function numberWithCommas(size) {
		return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}
}]);