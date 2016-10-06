(function () {

angular
	.module('mtcApp')
	.controller('profileCoursesController', profileCoursesController);

profileCoursesController.$inject = ['$state', '$http', 'mtcData'];

//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};


function profileCoursesController($state, $http, mtcData) {
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
	};
	displayData();

	user.deleteCourse = function(coachid, course) {
		if (confirm("Are you sure to delete " + course + "?") == true) {	
			mtcData.deleteCoach(coachid)
			.then(function(success) {
				console.log("Delete");
				$state.go('profile');
			}, function(error) {
				console.log("error: " + error);
			})
		} else {
			return false;
		};
	};


	};

})();

