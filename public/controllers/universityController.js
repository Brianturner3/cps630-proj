var app = angular.module('app',['ngCookies']);
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

/*
Controller that controls the information that is immeidately loaded onto the page
*/
app.controller('loadSchool',function($scope,$http,$injector,$cookies,saveSchoolName){
	//Loads initial University information
	$scope.load = function(){
		var keysToPrograms = {"agriculture": "Agriculture, Agriculture Operations, And Related Sciences", "resources": "Natural Resources And Conservation", "architecture":"Architecture And Related Services", "ethnic_cultural_gender": "Area, Ethnic, Cultural, Gender, And Group Studies", "communication": "Communication, Journalism, And Related Programs","communications_technology": "Communications Technologies/Technicians And Support Services","computer":"Computer And Information Sciences And Support Services","personal_culinary": "Personal And Culinary Services","education":"Education","engineering":"Engineering","engineering_technology": "Engineering Technologies And Engineering-Related Fields","language":"Foreign Languages, Literatures, And Linguistics","family_consumer_science":"Family And Consumer Sciences/Human Sciences","legal":"Legal Professions And Studies","english":"English Language And Literature/Letters","humanities":"Liberal Arts And Sciences, General Studies And Humanities","library":"Library Science","biological":"Biological And Biomedical Sciences","mathematics":"Mathematics And Statistics","military":"Military Technologies And Applied Sciences","multidiscipline":"Multi/Interdisciplinary Studies","parks_recreation_fitness":"Parks, Recreation, Leisure, And Fitness Studies","philosophy_religious":"Philosophy And Religious Studies","theology_religious_vocation":"Theology And Religious Vocations","physical_science":"Physical Sciences","science_technology":"Science Technologies/Technicians","psychology":"Psychology","security_law_enforcement":"Homeland Security, Law Enforcement, Firefighting And Related Protective Services","public_administration_social_service":"Public Administration And Social Service Professions","social_science":"Social Sciences","construction":"Construction Trades","mechanic_repair_technology":"Mechanic And Repair Technologies/Technicians","precision_production":"Precision Production","transportation":"Transportation And Materials Moving","visual_performing":"Visual And Performing Arts","health":"Health Professions And Related Programs","business_marketing":"Business, Management, Marketing, And Related Support Services","history":"History"};
		
		/*
		Initializer function
		Once called, chain of functions is called and page is loaded
		*/		
		var init = function(){
			apiCall();
		}
		init();

		function apiCall(){
			//var x = selectedSchool.replace("","%26");
			//console.log(selectedSchool);
			var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+selectedSchool+"&api_key="+key;
			saveSchoolName.setSchoolName(selectedSchool);
			selectedSchoolInfo(url);
		}

		function showPosition(latlon,div,la,lo) {
			var element = document.getElementById("indiUni");
			var divImg = document.createElement("div");
			divImg.className = "seven columns";
			divImg.id = "map";
			var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
			+latlon+"&zoom=17&size=500x400&sensor=false&markers=color:red|"+latlon+"&key=AIzaSyDC8E_5S_spLkhzLo2U_1LA57pPtR_SPn4";
			var imgMap = document.createElement("img");
			imgMap.setAttribute("src",img_url);
			divImg.appendChild(imgMap);
			div.appendChild(divImg);
			element.appendChild(div);
		}

		function selectedSchoolInfo(url){
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
					var data = JSON.parse(xmlhttp.responseText);

					var element = document.getElementById("indiUni");
					var divRowHeader = document.createElement("div");
					divRowHeader.className = "row";
					var header = document.createElement("h1");
					header.className = "six columns";
					var headerText = document.createTextNode(selectedSchool);
					header.appendChild(headerText);
					var hr = document.createElement("HR");
					divRowHeader.appendChild(header);
					

					element.appendChild(divRowHeader);
					element.appendChild(hr);

					for (var i = 0; i<data.results.length; i++){
						
						if(data.results[i]['school']['name'] == selectedSchool){
							var divRowAboutSchool = document.createElement("div");
							divRowAboutSchool.className = "row";
							var divSchool = document.createElement("div");
							divSchool.className= "five columns";
							var headerAbout = document.createElement("h3");
							var headerAboutText = document.createTextNode("About:");
							headerAbout.appendChild(headerAboutText);
							divSchool.appendChild(headerAbout);

							var pSchoolLocation = document.createElement("p");
							pSchoolLocation.className = "info";
							var pSchoolCityText =document.createTextNode(data.results[i]['school']['city']+", ");
							pSchoolLocation.appendChild(pSchoolCityText);

							var pSchoolStateText =document.createTextNode(data.results[i]['school']['state']);
							pSchoolLocation.appendChild(pSchoolStateText);
							divSchool.appendChild(pSchoolLocation);

							
							var pSchoolUrlText = document.createTextNode("Website: ");
							divSchool.appendChild(pSchoolUrlText);
							var aSchoolUrl = document.createElement("a");
							aSchoolUrl.className = "info";
							var aSchoolUrlText = document.createTextNode(data.results[i]['school']['school_url']);
							aSchoolUrl.setAttribute('href', "http://"+data.results[i]['school']['school_url']);
							aSchoolUrl.appendChild(aSchoolUrlText);
							divSchool.appendChild(aSchoolUrl);

							if(data.results[i]['school']['main_campus']==1){
								var pSchoolMCampus = document.createElement("p");
								pSchoolMCampus.className = "info"
								var pSchoolMCampusText = document.createTextNode("Main Campus: Yes");
								pSchoolMCampus.appendChild(pSchoolMCampusText);
								divSchool.appendChild(pSchoolMCampus);
							}else if(data.results[i]['school']['main_campus']!=1){
								var pSchoolMCampus = document.createElement("p");
								pSchoolMCampus.className = "info";
								var pSchoolMCampusText = document.createTextNode("Main Campus: No");
								pSchoolMCampus.appendChild(pSchoolMCampusText);
								divSchool.appendChild(pSchoolMCampus);
							}

							if(data.results[i]['school']['branches']>1){
								var pSchoolBCampus = document.createElement("p");
								pSchoolBCampus.className = "info";
								var pSchoolBCampusText = document.createTextNode("Branches: "+data.results[i]['school']['branches']);
								pSchoolBCampus.appendChild(pSchoolBCampusText);
								divSchool.appendChild(pSchoolBCampus);
							}

							if(data.results[i]['school']['degrees_awarded']['highest'] == 0){
								var pSchoolDegreeAwarded = document.createElement("p");
								pSchoolDegreeAwarded.className = "info";
								var pSchoolDegreeAwardedText = document.createTextNode("Highest Degree Awarded: Non-degree-granting");
								pSchoolDegreeAwarded.appendChild(pSchoolDegreeAwardedText);
								divSchool.appendChild(pSchoolDegreeAwarded);
							}else if(data.results[i]['school']['degrees_awarded']['highest'] == 1){
								var pSchoolDegreeAwarded = document.createElement("p");
								pSchoolDegreeAwarded.className = "info";
								var pSchoolDegreeAwardedText = document.createTextNode("Highest Degree Awarded: Certificate degree");
								pSchoolDegreeAwarded.appendChild(pSchoolDegreeAwardedText);
								divSchool.appendChild(pSchoolDegreeAwarded);
							}else if(data.results[i]['school']['degrees_awarded']['highest'] == 2){
								var pSchoolDegreeAwarded = document.createElement("p");
								pSchoolDegreeAwarded.className = "info";
								var pSchoolDegreeAwardedText = document.createTextNode("Highest Degree Awarded: Associate degree");
								pSchoolDegreeAwarded.appendChild(pSchoolDegreeAwardedText);
								divSchool.appendChild(pSchoolDegreeAwarded);
							}else if(data.results[i]['school']['degrees_awarded']['highest'] == 3){
								var pSchoolDegreeAwarded = document.createElement("p");
								pSchoolDegreeAwarded.className = "info";
								var pSchoolDegreeAwardedText = document.createTextNode("Highest Degree Awarded: Bachelor's degree");
								pSchoolDegreeAwarded.appendChild(pSchoolDegreeAwardedText);
								divSchool.appendChild(pSchoolDegreeAwarded);
							}else if(data.results[i]['school']['degrees_awarded']['highest'] == 4){
								var pSchoolDegreeAwarded = document.createElement("p");
								pSchoolDegreeAwarded.className = "info";
								var pSchoolDegreeAwardedText = document.createTextNode("Highest Degree Awarded: Graduate degree");
								pSchoolDegreeAwarded.appendChild(pSchoolDegreeAwardedText);
								divSchool.appendChild(pSchoolDegreeAwarded);
							}

							if(data.results[i]['school']['ownership'] == 1){
								var pSchoolOwnership = document.createElement("p");
								pSchoolOwnership.className = "info";
								var pSchoolOwnershipText = document.createTextNode("Ownership: Public");
								pSchoolOwnership.appendChild(pSchoolOwnershipText);
								divSchool.appendChild(pSchoolOwnership);
							}else if(data.results[i]['school']['ownership'] == 2){
								var pSchoolOwnership = document.createElement("p");
								pSchoolOwnership.className = "info";
								var pSchoolOwnershipText = document.createTextNode("Ownership: Private Non-profit");
								pSchoolOwnership.appendChild(pSchoolOwnershipText);
								divSchool.appendChild(pSchoolOwnership);
							}else if(data.results[i]['school']['ownership'] == 3){
								var pSchoolOwnership = document.createElement("p");
								pSchoolOwnership.className = "info";
								var pSchoolOwnershipText = document.createTextNode("Ownership: Private For-profit");
								pSchoolOwnership.appendChild(pSchoolOwnershipText);
								divSchool.appendChild(pSchoolOwnership);
							}

							divRowAboutSchool.appendChild(divSchool);
							element.appendChild(divRowAboutSchool);
							var selectedSchoolLatLon = data.results[i]['location']['lat'] + "," + data.results[i]['location']['lon'];
							showPosition(selectedSchoolLatLon,divRowAboutSchool,data.results[i]['location']['lat'],data.results[i]['location']['lon']);

							//DIV  
							var divRowStudentBodyAdGrad = document.createElement("div");
							divRowStudentBodyAdGrad.className = ("row");


							//SCHOOL STUDENT BODY
							var divStudentBody = document.createElement("div");
							divStudentBody.className = "four columns";
							var headerStudentBody = document.createElement("h3");
							var headerStudentBodyText = document.createTextNode("Students:");
							headerStudentBody.appendChild(headerStudentBodyText);
							divStudentBody.appendChild(headerStudentBody);

							var pSchoolSize = document.createElement("p");
							pSchoolSize.className = "info";
							var pSchoolSizeText =document.createTextNode(numberWithCommas(data.results[i]['2014']['student']['size']) + " undergraduate students");
							pSchoolSize.appendChild(pSchoolSizeText);
							divStudentBody.appendChild(pSchoolSize);

							var pSchoolFullTimeS = document.createElement("p");
							pSchoolFullTimeS.className = "info";
							var pSchoolFullTimeSText =document.createTextNode("Full Time Students: " + Math.floor(100 - (data.results[i]['2014']['student']['part_time_share']*100)) + "%");
							pSchoolFullTimeS.appendChild(pSchoolFullTimeSText);
							divStudentBody.appendChild(pSchoolFullTimeS);

							var pSchoolPartTimeS = document.createElement("p");
							pSchoolPartTimeS.className = "info";
							var pSchoolPartTimeSText =document.createTextNode("Part Time Students: " + Math.floor(data.results[i]['2014']['student']['part_time_share']*100) + "%");
							pSchoolPartTimeS.appendChild(pSchoolPartTimeSText);
							divStudentBody.appendChild(pSchoolPartTimeS);


							divRowStudentBodyAdGrad.appendChild(divStudentBody);



							//SCHOOL ADMISSION
							var divAdmissions = document.createElement("div");
							divAdmissions.className = "four columns";
							var headerAd = document.createElement("h3");
							var headerAdText = document.createTextNode("Admissions:");
							headerAd.appendChild(headerAdText);
							divAdmissions.appendChild(headerAd);

							var pSchoolAdRate = document.createElement("p");
							pSchoolAdRate.className = "info";
							var pSchoolAdRateText =document.createTextNode("Admission Rate: " + Math.floor(data.results[i]['2014']['admissions']['admission_rate']['overall']*100) + " %");
							pSchoolAdRate.appendChild(pSchoolAdRateText);
							divAdmissions.appendChild(pSchoolAdRate);


							var pSchoolSatAvg= document.createElement("p");
							pSchoolSatAvg.className = "info";
							if(data.results[i]['2014']['admissions']['sat_scores']['average']['overall'] != null){
								var pSchoolSatAvgText =document.createTextNode("SAT Overall Average Score: " + numberWithCommas(data.results[i]['2014']['admissions']['sat_scores']['average']['overall']));
							}else{
								var pSchoolSatAvgText =document.createTextNode("SAT Overall Average Score: No Data Available");
							}
							pSchoolSatAvg.appendChild(pSchoolSatAvgText);
							divAdmissions.appendChild(pSchoolSatAvg);

							divRowStudentBodyAdGrad.appendChild(divAdmissions);


							//SCHOOL GRADUATION
							var divGrad = document.createElement("div");
							divGrad.className = "four columns";
							var headerGrad = document.createElement("h3");
							var headerGradText = document.createTextNode("Graduation:");
							headerGrad.appendChild(headerGradText);
							divGrad.appendChild(headerGrad);

							var pSchoolGRate = document.createElement("p");
							pSchoolGRate.className = "info";
							if(data.results[i]['2014']['completion']['completion_rate_4yr_150nt_pooled'] != null){
								var pSchoolGRateText =document.createTextNode("Graduation Rate: " + Math.floor(data.results[i]['2014']['completion']['completion_rate_4yr_150nt_pooled']*100)+"%");
								pSchoolGRate.appendChild(pSchoolGRateText);
							}else if(data.results[i]['2014']['completion']['completion_rate_4yr_150nt_pooled'] == null){
								var pSchoolGRateText =document.createTextNode("Graduation Rate: No Data Available");
								pSchoolGRate.appendChild(pSchoolGRateText);
							}
							divGrad.appendChild(pSchoolGRate);
							divRowStudentBodyAdGrad.appendChild(divGrad);
							element.appendChild(divRowStudentBodyAdGrad);

							//DIV MONEY 
							var divRowCostAidEarn = document.createElement("div");
							divRowCostAidEarn.className = "row";

							//SCHOOL COST
							var divCost = document.createElement("div");
							divCost.className = "four columns";
							var headerCost = document.createElement("h3");
							var headerCostText = document.createTextNode("Cost:");
							headerCost.appendChild(headerCostText);
							divCost.appendChild(headerCost);

							var pSchoolTuition = document.createElement("p");
							pSchoolTuition.className = "info";
							if(data.results[i]['2014']['cost']['tuition']['in_state'] != null){
							var pSchoolTuitionText =document.createTextNode("Tuition Cost for Academic Year: $" + numberWithCommas(data.results[i]['2014']['cost']['tuition']['in_state']));
							}else{
								var pSchoolTuitionText =document.createTextNode("Tuition Cost for Academic Year: No Data Available");
							}
							pSchoolTuition.appendChild(pSchoolTuitionText);
							divCost.appendChild(pSchoolTuition);
							divRowCostAidEarn.appendChild(divCost);

							var pSchoolCYear = document.createElement("p");
							pSchoolCYear.className = "info";
							if(data.results[i]['2014']['cost']['attendance']['academic_year'] != null){
							var pSchoolCYearText =document.createTextNode("Overall Cost for Academic Year: $" + numberWithCommas(data.results[i]['2014']['cost']['attendance']['academic_year']));
							}else{
							var pSchoolCYearText =document.createTextNode("Overall Cost for Academic Year: No Data Available");
							}
							pSchoolCYear.appendChild(pSchoolCYearText);
							divCost.appendChild(pSchoolCYear);
							divRowCostAidEarn.appendChild(divCost);

							var divAid = document.createElement("div");
							divAid.className= "four columns";
							var headerAid = document.createElement("h3");
							var headerAidText = document.createTextNode("Financial Aid and Debt:");
							headerAid.appendChild(headerAidText);
							divAid.appendChild(headerAid);

							var pSchoolAid = document.createElement("p");
							pSchoolAid.className = "info";
							if(data.results[i]['2014']['aid']['loan_principal'] != null){
								var pSchoolAidText =document.createTextNode("Typical Total Debt: $" + numberWithCommas(data.results[i]['2014']['aid']['loan_principal']));
							}else{
								var pSchoolAidText =document.createTextNode("Typical Total Debt: No Data Available");
							}
							pSchoolAid.appendChild(pSchoolAidText);
							divAid.appendChild(pSchoolAid);


							var pSchoolLMonthly = document.createElement("p");
							pSchoolLMonthly.className = "info";
							if(data.results[i]['2014']['aid']['median_debt']['completers']['monthly_payments'] != null){
							var pSchoolLMonthlyText =document.createTextNode("Typical Monthly Loan Payments of Graduates: $" + Math.floor(data.results[i]['2014']['aid']['median_debt']['completers']['monthly_payments']) +" per month");
							}else{
							var pSchoolLMonthlyText =document.createTextNode("Typical Monthly Loan Payments of Graduates: No Data Available");
							}
							pSchoolLMonthly.appendChild(pSchoolLMonthlyText);
							divAid.appendChild(pSchoolLMonthly);
							divRowCostAidEarn.appendChild(divAid);

							

							var divEarnings = document.createElement("div");
							divEarnings.className = "four columns";
							var headerEarnings = document.createElement("h3");
							var headerEarningsText = document.createTextNode("Earnings:");
							headerEarnings.appendChild(headerEarningsText);
							divEarnings.appendChild(headerEarnings);

							var pSchoolEarnings = document.createElement("p");
							pSchoolEarnings.className = "info";
							if(data.results[i]['2012']['earnings']['10_yrs_after_entry']['median'] != null){
							var pSchoolEarningsText =document.createTextNode("Average Earnings After School: $" + numberWithCommas(data.results[i]['2012']['earnings']['10_yrs_after_entry']['median']));
							}else{
							var pSchoolEarningsText =document.createTextNode("Average Earnings After School: No Data Available");
							}
							pSchoolEarnings.appendChild(pSchoolEarningsText);
							divEarnings.appendChild(pSchoolEarnings);
							divRowCostAidEarn.appendChild(divEarnings);
							element.appendChild(divRowCostAidEarn);

							var divAcademics = document.createElement("div");
							var headerA = document.createElement("h3");
							var headerAText = document.createTextNode("List of all area(s) of study:");
							headerA.className="areaHeader";
							headerA.appendChild(headerAText);
							divAcademics.appendChild(headerA);
							var programList = data.results[i]['2014']['academics']['program']['degree'];
							var keys = Object.keys(programList);
							keys.sort();

							for (var n = 0;n < keys.length; n++){
								if(programList[keys[n]]==1){
									var pSchoolProgramDegree= document.createElement("p");
									pSchoolProgramDegree.className = "info";
									var pSchoolProgramDegreeText = document.createTextNode(keysToPrograms[keys[n]]);
									pSchoolProgramDegree.appendChild(pSchoolProgramDegreeText);
									divAcademics.appendChild(pSchoolProgramDegree);
								}
							}
							element.appendChild(divAcademics);

							//To check if the school is favorited or not
							var userName = $cookies.get("email");
							//Have to pass an object to POST
							var info = {
								email : userName
							}

							var rateButton = document.getElementById("rateButton");
							rateButton.setAttribute("onClick","location.href=\"rateSchool.html?name="+selectedSchool+"\"");
						
							$http.post('/api/getSavedSchools', info).then(function(response){
								if(response.data.length >0){
									var favButton = document.getElementById("favButton");
									for(var i = 0; i < response.data.length; i++){
										if(selectedSchool == response.data[i]){
											favButton.textContent = "Unfavorite";
											favButton.setAttribute("ng-click","removeSchoolFromFavorites()");
											var el = angular.element(favButton);
											$scope = el.scope();
											$injector = el.injector();
											$injector.invoke(function($compile){
												$compile(el)($scope)
											})
										}
									}
								}
							});


						}
					}
				}
			};
			xmlhttp.open ("GET", url, true);
			xmlhttp.send();
		}
	}
});
/*
Controller for storing the favorited school and storing it in the server
*/
app.controller('favoriteController',function($scope,$http,$window,$cookies,saveSchoolName){
	
	$scope.addSchoolToFavorites = function(){
		var school = saveSchoolName.getSchoolName();
		var userName = $cookies.get("email");
		var info = {
			email : userName,
			school : school
		}
		$http.post('/api/saveSchool', info).then(function(response){
			$window.location.reload();
		});
	}

	$scope.removeSchoolFromFavorites = function(){
		$window.location.reload();
		var school = saveSchoolName.getSchoolName();
		var userName = $cookies.get("email");
		var info = {
			email : userName,
			school : school
		}
		$http.post('/api/removeSchool', info).then(function(response){
		});
	}
});

app.controller('userComments', function($scope,$http,$cookies,saveSchoolName){

	$scope.User = {
		email : "",
		rating : "",
		comment : ""
	}

	var schoolobj = {
		school : saveSchoolName.getSchoolName()
	}

	$scope.loadComments = function(){
		
		$http.post('/api/loadComments',schoolobj).then(function(response){
			if(response.data.length >0){
			console.log(response);
			var element = document.getElementById("commentsSection");
			var sum = 0;
			for(var i = 0; i < response.data[0]["usersArray"].length; i++){
				var div = document.createElement("div");

				var pUser = document.createElement("p");
				var pUserText = document.createTextNode("User: "+response.data[0]["usersArray"][i].email);
				pUser.appendChild(pUserText);
				div.appendChild(pUser);

				var pRating = document.createElement("p");
				var pRatingText = document.createTextNode("Rating: "+response.data[0]["usersArray"][i].rating);
				sum = sum + parseInt(response.data[0]["usersArray"][i].rating);
				pRating.appendChild(pRatingText);
				div.appendChild(pRating);

				var pComment = document.createElement("p");
				var pCommentText = document.createTextNode("Comment: "+response.data[0]["usersArray"][i].comment);
				pComment.appendChild(pCommentText);
				div.appendChild(pComment);

				var hr = document.createElement("HR");
				div.appendChild(hr);

				element.appendChild(div);
			}
			var avgElement = document.getElementById("averageRating");
			var div = document.createElement("div");
			div.className = "ratingForEachSchool";
			var avgHeader = document.createElement("h5");
			var avgHeaderText = document.createTextNode("Rating: ");
			avgHeader.appendChild(avgHeaderText);
			div.appendChild(avgHeader);
			var linkAvgBttm = document.createElement("a");
			linkAvgBttm.setAttribute("href","#commentsSection");
			var linkAvgBttmText = document.createTextNode((sum/response.data[0]["usersArray"].length).toFixed(1));
			linkAvgBttm.appendChild(linkAvgBttmText);
			avgHeader.appendChild(linkAvgBttm);
			var outOfText = document.createTextNode("\/5");
			avgHeader.appendChild(outOfText);
			avgElement.appendChild(div);
			console.log("Average: " +(sum/response.data[0]["usersArray"].length).toFixed(1));
		}
		});
	
	}


});

/*
Service the extracts and saves the name of the school
*/
app.service('saveSchoolName',function(){
	var schoolName;
	this.setSchoolName = function(x){
		schoolName = x;
	}
	this.getSchoolName = function(){
		return schoolName;
	}
});


