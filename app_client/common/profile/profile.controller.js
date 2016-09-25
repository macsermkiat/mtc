(function () {

angular
	.module('mtcApp')
	.controller('profileController', profileController);

profileController.$inject = ['$scope', '$state', '$http', 'userService'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};

function profileController($scope, $state, $http) {
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
	// 
	function userBio(id) {
			return $http.get('/api/users/bio', {params: {id: id}} )
				.then(function(response) {
					console.log(response.data);
					return response.data;
				});
		};
		
	function displayData() { 
		Promise.resolve (userBio(id))
			.then(function(bio) {
				return bio;
			}).then(function(bio) {
				$scope.result = bio[0];
				
				$scope.idcheck = $scope.result.idcard;
				$scope.criminalcheck = $scope.result.criminal;

			});
			// .error(function (e) {
			// 	user.message = "Sorry, something's gone wrong";
			// })
	};
	displayData();
	


	}

})();