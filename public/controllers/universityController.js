var app = angular.module('app',[]);
/*
Controller that controls the information that is immeidately loaded onto the page
*/
app.controller('loadSchool',function($scope,saveSchoolName){
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
			var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+selectedSchool+"&api_key="+key;
			saveSchoolName.setSchoolName(selectedSchool);
			selectedSchoolInfo(url);
		}

		function showPosition(latlon) {
			var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
			+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyBu-916DdpKAjTmJNIgngS6HL_kDIKU0aU";
			var element = document.getElementById("indiUni");
			var imgMap = document.createElement("img");
			imgMap.setAttribute("src",img_url);
			element.appendChild(imgMap);
		}

		function selectedSchoolInfo(url){
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
					var data = JSON.parse(xmlhttp.responseText);

					var element = document.getElementById("indiUni");

					var header = document.createElement("h1");
					var headerText = document.createTextNode(selectedSchool);
					header.appendChild(headerText);
					element.appendChild(header);

					for (var i = 0; i<data.results.length; i++){
						var divSchool = document.createElement("div");
						if(data.results[i]['school']['name'] == selectedSchool){
							console.log(data);

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

							var pSchoolSize = document.createElement("p");
							pSchoolSize.className = "info";
							var pSchoolSizeText =document.createTextNode(numberWithCommas(data.results[i]['2014']['student']['size']) + " undergraduate students");
							pSchoolSize.appendChild(pSchoolSizeText);
							divSchool.appendChild(pSchoolSize);

							var aSchoolUrl = document.createElement("a");
							aSchoolUrl.className = "info";
							var aSchoolUrlText = document.createTextNode(data.results[i]['school']['school_url']);
							aSchoolUrl.setAttribute('href', "http://"+data.results[i]['school']['school_url']);
							aSchoolUrl.appendChild(aSchoolUrlText);
							divSchool.appendChild(aSchoolUrl);

							var selectedSchoolLatLon = data.results[i]['location']['lat'] + "," + data.results[i]['location']['lon'];
							showPosition(selectedSchoolLatLon);

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

							var divAcademics = document.createElement("div");
							var headerA = document.createElement("h3");
							var headerAText = document.createTextNode("List of all areas of study:");
							headerA.appendChild(headerAText);
							divAcademics.appendChild(headerA);
							var programList = data.results[i]['2014']['academics']['program']['degree'];
							var keys = Object.keys(programList);
							keys.sort();
							var keyLenght = keys.length;

							for (var n = 0;n < keys.length; n++){
								if(programList[keys[n]]==1){
									var pSchoolProgramDegree= document.createElement("p");
									pSchoolProgramDegree.className = "info";
									var pSchoolProgramDegreeText = document.createTextNode(keysToPrograms[keys[n]]);
									pSchoolProgramDegree.appendChild(pSchoolProgramDegreeText);
									divAcademics.appendChild(pSchoolProgramDegree);
								}
							}

							var divAdmissions = document.createElement("div");
							var headerAd = document.createElement("h3");
							var headerAdText = document.createTextNode("Admissions:");
							headerAd.appendChild(headerAdText);
							divAdmissions.appendChild(headerAd);

							var pSchoolAdRate = document.createElement("p");
							pSchoolAdRate.className = "info";
							var pSchoolAdRateText =document.createTextNode("Admission Rate: " + Math.floor(data.results[i]['2014']['admissions']['admission_rate']['overall']*100) + " %");
							pSchoolAdRate.appendChild(pSchoolAdRateText);
							divAdmissions.appendChild(pSchoolAdRate);

							var divCost = document.createElement("div");
							var headerCost = document.createElement("h3");
							var headerCostText = document.createTextNode("Cost:");
							headerCost.appendChild(headerCostText);
							divCost.appendChild(headerCost);

							var pSchoolAvgAYear = document.createElement("p");
							pSchoolAvgAYear.className = "info";
							var pSchoolAvgAYearText =document.createTextNode("Average Annual Cost: $" + numberWithCommas(data.results[i]['2014']['cost']['avg_net_price']['overall']));
							pSchoolAvgAYear.appendChild(pSchoolAvgAYearText);
							divCost.appendChild(pSchoolAvgAYear);

							var divAid = document.createElement("div");
							var headerAid = document.createElement("h3");
							var headerAidText = document.createTextNode("Financial Aid and Debt:");
							headerAid.appendChild(headerAidText);
							divAid.appendChild(headerAid);

							var pSchoolAid = document.createElement("p");
							pSchoolAid.className = "info";
							var pSchoolAidText =document.createTextNode("Typical Total Debt: $" + numberWithCommas(data.results[i]['2014']['aid']['loan_principal']));
							pSchoolAid.appendChild(pSchoolAidText);
							divAid.appendChild(pSchoolAid);

							var pSchoolLMonthly = document.createElement("p");
							pSchoolLMonthly.className = "info";
							var pSchoolLMonthlyText =document.createTextNode("Typical Monthly Loan Payments of Graduates: $" + Math.floor(data.results[i]['2014']['aid']['median_debt']['completers']['monthly_payments']) +" per month");
							pSchoolLMonthly.appendChild(pSchoolLMonthlyText);
							divAid.appendChild(pSchoolLMonthly);

							var divGrad = document.createElement("div");
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
								var pSchoolGRateText =document.createTextNode("Graduation Rate: Data Not Avialable");
								pSchoolGRate.appendChild(pSchoolGRateText);
							}
							divGrad.appendChild(pSchoolGRate);

							var divEarnings = document.createElement("div");
							var headerEarnings = document.createElement("h3");
							var headerEarningsText = document.createTextNode("Earnings:");
							headerEarnings.appendChild(headerEarningsText);
							divEarnings.appendChild(headerEarnings);

							var pSchoolEarnings = document.createElement("p");
							pSchoolEarnings.className = "info";
							var pSchoolEarningsText =document.createTextNode("Earnings After School: $" + numberWithCommas(data.results[i]['2012']['earnings']['10_yrs_after_entry']['median']));
							pSchoolEarnings.appendChild(pSchoolEarningsText);
							divEarnings.appendChild(pSchoolEarnings);

							element.appendChild(divSchool);
							element.appendChild(divAcademics);
							element.appendChild(divAdmissions);
							element.appendChild(divCost);
							element.appendChild(divAid);
							element.appendChild(divGrad);
							element.appendChild(divEarnings);
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
app.controller('favoriteController',function($scope,$http,saveSchoolName){
	var school = saveSchoolName.getSchoolName();
	console.log(school);
	/*$http.post('/api/saveSchool', school).then(function(response){
		console.log("Recieved Response");
	});*/
	
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

