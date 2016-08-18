angular
	.module('mtcApp')
	.service('mtcData', mtcData);

mtcData.$inject = ['$http'];
function mtcData ($http) {
	var coachById = function (coachid) {
		return $http.get('api/coaches/' + coachid);	
	};

	var allCoaches = function (coach) {
		return $http.get('api/coaches')
	};

	var coachesParent = function(coach) {
		return $http.get('api/coachesParent')
	};

	return {
		coachById : coachById,
		allCoaches : allCoaches,
		coachesParent : coachesParent
	};

}






    