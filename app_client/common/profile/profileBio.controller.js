(function () {

angular
	.module('mtcApp')
	.controller('profileBioController', profileBioController);

profileBioController.$inject = ['$stateParams', '$http'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function profileBioController($stateParams, $http) {
	var user = this;
	var accessData = localStorage.getItem('profile');

	var profileData = angular.fromJson(accessData);
	var id = profileData.identities[0].user_id;
	
	user.profile = profileData;

	function userBio(id) {
			return $http.get('/api/users/bio', {params: {id: id}} )
				.then(function(response) {
					return response.data;
				});
	};

	function displayData() { 
			return userBio(id)
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