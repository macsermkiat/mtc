(function () {

angular
	.module('mtcApp')
	.controller('userDetailController', userDetailController);

userDetailController.$inject = ['$stateParams', 'mtcData', '$log'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function userDetailController($stateParams, mtcData, $log) {
	this.$onInit = function() {
	var user = this;
	user.userid = $stateParams.userid;
	user.teacher = "";
	function userBio() {
		mtcData.userById(user.userid)
			.then(function(data) {
					user.data = {coach : data};
					user.teacher = user.data.coach[0];
			})
			.catch(function (e) {
				console.log(e);
			});
	};
	function activate() {
		userBio();
		$log.info('View user by ID');
	};
	activate();
	}
};

})();