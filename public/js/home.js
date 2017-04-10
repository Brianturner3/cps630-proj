var key = "Zw3luZF61RH5Nv1Up0LZNLLFK7bSJv1af3FJzLIu";
var selectedSchool = getURLParameter('name');


function numberWithCommas(size) {
    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getURLParameter(name) {
  	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}