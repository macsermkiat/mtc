(function () {

angular
	.module('mtcApp')
	.controller('userDetailController', userDetailController);

userDetailController.$inject = ['$stateParams', '$http', 'mtcData'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function userDetailController($stateParams, $http, mtcData) {
	var user = this;
	var userid = $stateParams.userid;
	user.teacher = "";
	function userBio() {
		mtcData.userById(userid)
			.then(function(data) {
				if (data) {
					user.data = {coach : data};
					user.teacher = user.data.coach.data[0];
				} else {
					console.log("Something wrong")
				}

			}
			, function (e) {
				console.log(e);
			});
	};
	userBio();

	// function displayData() { 
	// 		return userBio(id)
	// 			.then(function(data, err) {
	// 				if (err) {
	// 					console.log (err);
	// 				} else {
	// 				user.data = { coach: data };
	// 				}
	// 			});
	// 			// .error(function (e) {
	// 			// 	user.message = "Sorry, something's gone wrong";
	// 			// })
	// };
	// displayData();


};

})();