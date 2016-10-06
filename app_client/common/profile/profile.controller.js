(function () {

angular
	.module('mtcApp')
	.controller('profileController', profileController);

profileController.$inject = ['$stateParams', '$state', '$http', 'userService', 'mtcData'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};

function profileController($stateParams, $state, $http, userService, mtcData) {
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
	user.profile = profileData;
	user.result ="";
	// 
	// function userBio(id) {
	// 		return $http.get('/api/users/bio', {params: {id: id}} )
	// 			.then(function(response) {
	// 				console.log("this is" + response.data);
	// 				return response.data;
	// 			});
	// 	};
		
	// function displayData() { 
	// 	Promise.resolve (userBio(id))
	// 		.then(function(bio) {
	// 			return bio;
	// 			console.log(bio);
	// 		}).then(function(bio) {
	// 			$scope.result = bio[0];
	// 			console.log($scope.result);
	// 		});
	// 		// .error(function (e) {
	// 		// 	user.message = "Sorry, something's gone wrong";
	// 		// })
	// };
	// displayData();

	function userBio() {
		mtcData.userById(id)
			.then(function(data) {
				if (data) {
					user.data = { coach: data};
					user.result = user.data.coach.data[0];
				} else {
					console.log("Something wrong")
				}

			}
			, function (e) {
				console.log(e);
			});
	};
	userBio();
	


	}

})();