(function () {

angular
	.module('mtcApp')
	.factory('mtcData', mtcData);

mtcData.$inject = ['$http', '$log'];

function mtcData ($http, $log) {

	
	var searchCategoryService = function (text) {
		// var searchCategory;
		// searchCategory = {};
		// searchCategory.arrSearchResults = [];
		return $http.get('/api/coaches/search/?text=' + text);
	};

	var allCoaches = function() {
		return $http.get('/api/allcoaches')
		// .then(allCoachesComplete)
		// .catch(allCoachesFailed);

		// function allCoachesComplete(response) {
		// 	return response.data;
		// }
		// function allCoachesFailed(error) {
		// 	$log.error('XHR Failed for allCoaches.' + error.data)
		// }
	};

	var allCats = function() {
		return $http.get('/api/allcats')
	};

	var requestCoach = function (data) {
		return $http.post('/api/request', data)
	};

	
	var coachById = function (coachid) {
		return $http.get('/api/coaches/' + coachid);
	};

	var userById = function (userid) {
		return $http.get('/api/user/' + userid);
	};

	function createCoach(data) {
		return $http.post('/api/coaches', data)
		.then(function(response) {
			return response.data;
		})
		// .then(createCoachComplete)
		// .catch(createCoachFailed);

		// function createCoachComplete(response) {
		// 	return response.data;
		// }
		// function createCoachFailed(error) {
		// 	$log.error('XHR Failed for allCoaches.' + error.data)
		// }

	};

	function deleteCoach(coachid){
		return $http.delete('/api/coaches/' + coachid);
	};



	var addNewsLetter = function (news) {
		return $http.post('/api/newsletter', news)
		.then(function(response) {
			return response.news;
		})
	};

	return {
		allCoaches: allCoaches,
		allCats: allCats,
		coachById: coachById,
		userById: userById,
		createCoach: createCoach,
		deleteCoach: deleteCoach,
		addNewsLetter: addNewsLetter,
		searchCategoryService: searchCategoryService,
		requestCoach: requestCoach
		
	};
	

}

})();




    