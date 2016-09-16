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


function config (lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

	lockProvider.init({
      domain: 'royyak.auth0.com',
      clientID: '2m8hbwYC8UdyjITdKGDptrRvF6BXweY7',
      options: {
    	auth: {
      		redirect: false
      		// params: {
      		// 	scope:'openid'
      		// }
    	}
  	  }
  	});

	jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        },
        whiteListedDomains: [
        	'localhost', 
        	'ec2-54-251-155-133.ap-southeast-1.compute.amazonaws.com'
        ],
        unauthicatedRedirectPath: '/login'
    });

	// $locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('jwtInterceptor');

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
		// abstract: true,
		url: '/profile',
		templateUrl: 'common/profile/profile.template.html',
		controller: 'profileController',
		controllerAs: 'user'
		// template: '<ui-view>'
	})
	.state('profile.courses', {
		url: '/courses',
		templateUrl: 'common/profile/profile.courses.template.html',
		controller: 'profileCoursesController',
		controllerAs: 'user'
	})
	.state('profile.bio', {
		url: '/bio',
		templateUrl: 'common/profile/profile.bio.template.html',
		controller: 'profileBioController',
		controllerAs: 'user'
	})
	.state('profile.edit', {
		url: '/edit',
		templateUrl: 'common/profile/profile.edit.template.html',
		controller: 'profileEditController',
		controllerAs: 'vm'
	})
	// .state('login', {
	// 	url: '/login',
	// 	controller: 'loginController',
	// 	templateUrl: 'common/login/login.html'
	// })
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
	.state('subscription', {		
		url: '/subscription',
		templateUrl: 'common/subscription/subscription.template.html',
		controller: 'subscriptionCtrl',
		controllerAs: 'vm'
	})
	
	
	
	$urlRouterProvider.otherwise('home');

	// lockProvider.init({
	//     clientID: 2m8hbwYC8UdyjITdKGDptrRvF6BXweY7,
	//     domain: royyak.auth0.com
 //  	});
 	
};




app.config(['lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', config]);

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


// app.run(function($rootScope, $location, authService, $state) {
//     $rootScope.$on( "$stateChangeStart", function(event, next, current) {
//       if ($rootScope.isAuthenticated == false) {
//       	console.log('DENY : Redirecting to Login');
      	
      	
//       	authService.login();
//       	event.preventDefault();
//         // no logged user, redirect to /login
//         // if ( next.templateUrl === "partials/login.html") {
//         } else {
//           console.log('ALLOW');
//           return;
//         }
//     });
//  });

app.run(function($rootScope, authService, authManager) {

      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.authService = authService;
      
      // Register the authentication listener that is
      // set up in auth.service.js
      authService.registerAuthenticationListener();

       // Use the authManager from angular-jwt to check for
      // the user's authentication state when the page is
      // refreshed and maintain authentication
      authManager.checkAuthOnRefresh();

      // Listen for 401 unauthorized requests and redirect
      // the user to the login page
      authManager.redirectWhenUnauthenticated();

  });

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