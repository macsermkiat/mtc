(function () {

angular
	.module('mtcApp')
	.controller('profileCoursesController', profileCoursesController);

profileCoursesController.$inject = ['$state', '$http', 'mtcData', '$filter'];

//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};


function profileCoursesController($state, $http, mtcData, $filter) {
	var accessData;
	var subsciption;
	var getAccessData = function () {	
		if (!localStorage.getItem('profile')) {
			alert("Please Log in");
			$state.go('home')
		} else {
			accessData = localStorage.getItem('profile');
			subscription = localStorage.getItem('subscription');
			return accessData;
		}	
	};
	getAccessData();
	var profileData = angular.fromJson(accessData);
	var id = profileData.identities[0].user_id;
	var user = this;
	user.subscription = subscription;
	var sub = localStorage.getItem('subscription');
	user.subscription = (sub === 'true');
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
				$state.go('profile.bio');
			}, function(error) {
				console.log("error: " + error);
			})
		} else {
			return false;
		};
	};

	user.addCoach = function() {
		var sub =  localStorage.getItem('subscription');
		if (sub == 'false') {
			alert($filter('translate')('PROFILE.ALERT'));
			$state.go('subscription');
		} else if(sub == 'true') {
			$state.go('addCoach');
		}
	};


	};

})();

