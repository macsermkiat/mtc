(function () {

angular
	.module('mtcApp')
	.controller('profileController', profileController);

profileController.$inject = ['$http', 'authService'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};

function profileController($http, authService) {
	var vm = this;
	var accessData = localStorage.getItem('profile');
	vm.profile = angular.fromJson(accessData);
};

})();