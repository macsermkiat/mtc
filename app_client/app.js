var app = angular.module('mtcApp', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'duScroll']);

function config ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl',
		controllerAs :'vm'
	})
	.state('search' , {
		url: '/coaches/search/?text',
		params: {text:null},
		templateUrl: 'common/search/search.template.html',
		controller: 'searchCtrl',
		controllerAs : 'vm'		
	})
	.state('coachDetail', {
		url: '/coaches/:coachid',
		templateUrl: 'common/coachDetail/coachDetail.view.html',
		controller: 'coachDetailCtrl',
		controllerAs : 'vm'
	})
	.state('addCoach', {
		url: '/addCoach',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'addCoachCtrl',
		controllerAs: 'vm'
	})
	
	
	$urlRouterProvider.otherwise('home');
};



app.config(['$stateProvider', '$urlRouterProvider', config]);

// app.run(function($rootscope) {
// 	$rootScope.$on("$stateChangeError", console.log.bind(console));
// });