angular.module('mtcApp', ['ngRoute']);

function config ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl',
		controllerAs: 'vm'
	})
}

angular
	.module('mtcApp')
	.config(['$routeProvider', config]);