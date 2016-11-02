(function () {
angular
	.module('mtcApp')
	.component('landing', {
			restrict: 'EA',
			templateUrl: '/home/landing.template.html',
			controller: 'loginController',
			controllerAs: 'lgin'
			
		});

})();