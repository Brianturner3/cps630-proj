var key = "Zw3luZF61RH5Nv1Up0LZNLLFK7bSJv1af3FJzLIu";
var searchedUni;
var selectedSchool = getURLParameter('name');

function getUni(){
	var uniDiv = document.getElementById("university");

	if(document.getElementById("university")&&document.getElementById("uni").value){			
	uniDiv.style.display = "block";
	}

	searchedUni = document.getElementById("uni").value;
	
	var checkUniNode = document.getElementById("university");
		while(checkUniNode.firstChild) {
			checkUniNode.removeChild(checkUniNode.firstChild);
		}
	updateUni(searchedUni);
}

function updateUni(u){
	var url = "https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name="+u+"&_sort=2014.student.size:desc&_fields=school.name,school.city,school.state,2014.student.size&api_key="+key;
	sendRequest(url);
}

function sendRequest(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var data = JSON.parse(xmlhttp.responseText);
			console.log(data);
			if(data.results.length>0){
			var header = document.createElement("h1");
			var h1 = document.createTextNode("List Of All Universities with keyword \""+ searchedUni +"\"");
			header.appendChild(h1);
			
			var element = document.getElementById("university");
			element.appendChild(header);
			
			for (var i = 0; i<data.results.length; i++){
				var div = document.createElement("div");

				if(data.results[i]['2014.student.size'] != null){
				var a = document.createElement("a");
				a.className = "info";
				var pSchoolName = document.createTextNode(data.results[i]['school.name']);
				a.setAttribute('href', "university.html?name="+data.results[i]['school.name']);
				a.appendChild(pSchoolName);
				div.appendChild(a);

				var pSchoolLocation = document.createElement("p");
				pSchoolLocation.className = "info";
				var pSchoolCityText =document.createTextNode(data.results[i]['school.city']+", ");
				pSchoolLocation.appendChild(pSchoolCityText);

				var pSchoolStateText =document.createTextNode(data.results[i]['school.state']);
				pSchoolLocation.appendChild(pSchoolStateText);
				div.appendChild(pSchoolLocation);

				var pSchoolSize = document.createElement("p");
				pSchoolSize.className = "info";
				var pSchoolSizeText =document.createTextNode(numberWithCommas(data.results[i]['2014.student.size']) + " undergraduate students");
				pSchoolSize.appendChild(pSchoolSizeText);
				div.appendChild(pSchoolSize);
				
				element.appendChild(div);
			}
			}
		}else{
		var header = document.createElement("h3");
			var h1 = document.createTextNode("No such school with keyword \"" + searchedUni + "\"");
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
