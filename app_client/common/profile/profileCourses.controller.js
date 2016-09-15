(function () {

angular
	.module('mtcApp')
	.controller('profileCoursesController', profileCoursesController);

profileCoursesController.$inject = ['$state', '$http'];

//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};


function profileCoursesController($state, $http) {
	var accessData;
	var getAccessData = function () {	
		if (!localStorage.getItem('profile')) {
			alert("Please Log in");
			$state.go('home')
		} else {
			accessData = localStorage.getItem('profile');
			return accessData;
		}	
	};
	getAccessData();
	var profileData = angular.fromJson(accessData);
	var id = profileData.identities[0].user_id;
	var user = this;
	
	// 

	function userCourses(id) {
			return $http.get('/api/users/course', {params: {id: id}} )
				.then(function(response) {
					console.log(response.data);
					return response.data;
				});
	};

	function displayData() { 
			return userCourses(id)
				.then(function(data, err) {
					if (err) {
						console.log (err);
					} else {
					user.data = { coach: data };
					}
				});
				// .error(function (e) {
				// 	user.message = "Sorry, something's gone wrong";
				// })
	};
	displayData();

	};

})();

