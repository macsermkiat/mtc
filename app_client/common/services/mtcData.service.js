(function () {

angular
	.module('mtcApp')
	.factory('mtcData', mtcData);

mtcData.$inject = ['$http', '$log', 'Restangular'];

function mtcData ($http, $log, Restangular) {

	
	var searchCategoryService = function (text) {
		return Restangular.one('coaches/search/?text=' + text).getList();
		
		// return $http.get('/api/coaches/search/?text=' + text);
	};

	var allCoaches = function() {
		return $http.get('/api/allcoaches')

	};

	var allCats = function() {
		return Restangular.all('allCats').getList();
		// return $http.get('/api/allcats')
	};

	var requestCoach = function (data) {
		return $http.post('/api/request', data)
	};

	
	var coachById = function (coachid) {
		return Restangular.one('coaches').customGET(coachid);
		// return $http.get('/api/coaches/' + coachid);
	};

	var userById = function (userid) {
		return Restangular.one('user').customGET(userid);
		// return $http.get('/api/user/' + userid);
	};

	function createCoach(data) {
		return $http.post('/api/coaches', data)
		.then(function(response) {
			return response.data;
		})
		.catch(function(e) {
			console.log(e);
		})
	};

	function deleteCoach(coachid){
		return $http.delete('/api/coaches/' + coachid);
	};



	var addNewsLetter = function (news) {
		return $http.post('/api/newsletter', news)
		.then(function(response) {
			return response.news;
		})
		.catch(function(e) {
			console.log(e);
		})
	};

	var sendFirstLetter = function(mail) {
		return $http.post('/api/sendNews', mail)
		.then(function(response) {
			return response.mail;
		})
		.catch(function(e) {
			console.log(e);
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
		sendFirstLetter: sendFirstLetter,
		searchCategoryService: searchCategoryService,
		requestCoach: requestCoach	
	};
	

}

})();




    