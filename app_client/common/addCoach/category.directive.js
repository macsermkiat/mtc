(function () {
angular
	.module('mtcApp')
	.component('category', {
			restrict: 'EA',
			templateUrl: '/addCoach/category.template.html',
			controller: 'categoryController',
			controllerAs: 'vm',
			bindings: {
					formData.category: '<'
			}
			
		});

})();