(function() {

var app = angular.module('mtcApp', 	['ui.router',
									 'youtube-embed',
									 'ngFileUpload',
									 'auth0.lock',

									 // 'auth0',
									 'angular-jwt',
									 'ngSanitize', 
									 'ngMessages', 
									 'ui.bootstrap', 
									 'duScroll']);


function config (lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

	lockProvider.init({
      domain: 'royyak.auth0.com',
      clientID: '2m8hbwYC8UdyjITdKGDptrRvF6BXweY7',
      options: {
    	auth: {
      		redirect: false
    	}
  	  }
  	});

	jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        }
    });

    jwtInterceptorProvider.tokenGetter = function() {
  	  return localStorage.getItem('id_token');
  	}

    



	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl',
		controllerAs :'vm'
	})
	.state('profile', {
		url: '/profile',
		templateUrl: 'common/profile/profile.template.html',
		controller: 'profileController',
		controllerAs: 'user'
	})
	// .state('newsletter', {
	// 	url: '/newsletter',
	// 	params: {name:null, email:null},
	// 	controller: 'homeCtrl',
	// 	controllerAs: 'newsvm'
	// })
	.state('search' , {
		url: '/coaches/search/?text',
		params: {text:null},
		templateUrl: 'common/search/search.view.html',
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
		controllerAs: 'vm',
		redirectTo: 'addPic'
	})
	
	
	
	$urlRouterProvider.otherwise('home');

	// lockProvider.init({
	//     clientID: 2m8hbwYC8UdyjITdKGDptrRvF6BXweY7,
	//     domain: royyak.auth0.com
 //  	});
 	$httpProvider.interceptors.push('jwtInterceptor');
};




app.config(['lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', config]);

// app.run(function(auth) {
//     auth.hookEvents();
//     });
// app.config(function(lockProvider) {
//   lockProvider.init({
//     clientID: 2m8hbwYC8UdyjITdKGDptrRvF6BXweY7,
//     domain: royyak.auth0.com
//   });
// });
// app.config(function($sceDelegateProvider) {
//   $sceDelegateProvider.resourceUrlWhitelist([
//     'self',
//     'https://www.youtube.com/**'
//   ]);
// });


app.run(function($anchorScroll, $window, $rootScope) {
  // hack to scroll to top when navigating to new URLS but not back/forward
//   var wrap = function(method) {
//     var orig = $window.window.history[method];
//     $window.window.history[method] = function() {
//       var retval = orig.apply(this, Array.prototype.slice.call(arguments));
//       $anchorScroll();
//       return retval;
//     };
//   };
//   wrap('pushState');
//   wrap('replaceState');
	$rootScope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 0;
	});
});



// app.run(function($rootscope) {
// 	$rootScope.$on("$stateChangeError", console.log.bind(console));
// });

})();