
function myFunction(x) {
	x.classList.toggle("change");
	document.getElementById("myDropdown").classList.toggle("show");

		// Close the dropdown menu if the user clicks outside of it
		/*
		window.onclick = function(event) {
			if (!event.target.matches('.dropbtn')) {

				var dropdowns = document.getElementsByClassName("dropdown-content");
				var i;
				for (i = 0; i < dropdowns.length; i++) {
					var openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('show')) {
						openDropdown.classList.remove('show');
					}
				}
			}
		}
		*/

		/* Function that makes the dropdown menu transition smoothly in-and-out.*/
		/*
		var menu = document.getElementById('myDropdown');
		document.getElementById("dropDownMenu").addEventListener("click",function(event){
			menu.style.WebkitTransition = 'height 2s';
			menu.style.MozTransition = 'height 2s';
			menu.style.Transition = 'height 2s';
		},false);
		*/
	}