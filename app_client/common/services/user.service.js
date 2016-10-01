(function () {

angular
	.module('mtcApp')
	.factory('userService', userService);

userService.$inject = ['$http', '$log', '$window'];

function userService ($http, $log, $window) {
	// var accessData = $window.localStorage;
	// var profile = accessData.profile;
	// var id = profile.identities[0].user_id;
	var getToken = function () {
		return $window.localStorage['id_token'];
	};

	function registerUser(data) {
		return $http.post('/api/users/create', data)
		.then(function(response) {
			return response.data;
		});
	};


	function updateUser(data) {
		return $http.put('/api/users/update', data)
		.then(function(response) {
			return response.data;
		});
	};

	function updateCoach(data) {
		return $http.put('/api/coachEdit/update', data)
		.then(function(response) {
			return response.data;
		});
	};
	// function getCourses(data) {
	// 	return $http.get('/api/users/course', data, {params: {id:id}} )
	// 	.then(function(response) {
	// 		return response.data;
	// 	});
	// };


	return {
		getToken: getToken,
		registerUser: registerUser,
		updateUser: updateUser,
		updateCoach: updateCoach
	};
};

})();