(function () {
angular
	.module('mtcApp')
	.component('searchbox',{
		restrict: 'E',
		templateUrl: '/common/searchbox/searchbox.template.html',
		bindings: {
			text: '<'
		},
		controller: 'SearchBoxController',
		controllerAs: 'vm'

		// binding: {
		// 	coach: '='
		// }
	});
	
})();