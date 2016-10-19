(function() {

var app = angular.module('mtcApp', 	['ui.router',
									 'youtube-embed',
									 'ngFileUpload',
									 'auth0.lock',
									 'angularSpinners',
									 'pascalprecht.translate',
									 'ngMeta',
									 // 'auth0',
									 'angular-jwt',
									 'ngSanitize', 
									 'ngMessages', 
									 'ui.bootstrap', 
									 'duScroll']);


function config (lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, ngMetaProvider) {

	lockProvider.init({
      domain: 'royyak.auth0.com',
      clientID: '2m8hbwYC8UdyjITdKGDptrRvF6BXweY7',
      options: {
      	theme: {
      		logo: 'image/mtc-tp.png'
      	},
      	 languageDictionary: {
   			 title: "Match The Coach"
  		}

    	// auth: {
     //  		redirect: false
     //  		// params: {
     //  		// 	rootScope:'openid'
     //  		// }
    	// }
  	  }
  	});

	jwtOptionsProvider.config({
        tokenGetter: function() {
          return localStorage.getItem('id_token');
        },
        whiteListedDomains: [
        	'localhost', 
        	'www.matchthecoach.com'
        ],
        unauthicatedRedirectPath: '/login'
    });

	// $locationProvider.html5Mode(true);
	$httpProvider.interceptors.push('jwtInterceptor');

    jwtInterceptorProvider.tokenGetter = function() {
  	  return localStorage.getItem('id_token');
  	}

  	

	$stateProvider
	// .state('mtc', {
	// 	templateUrl: 'home/mtc.view.html',
	// 	abstract: true
	// })

	.state('/', {
		url: '/',
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl',
		controllerAs :'vm',
		meta: {
	        'title': 'Best place to find the teacher / tutor / coach in Thailand',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	.state('become', {
		url: '/become-a-coach',
		templateUrl: 'home/become.view.html',
		controller: 'loginController',
		controllerAs :'lgin',
		meta: {
	        'title': 'Become a coach easily',
	        'description': 'Steps to become a coach'
      	}
		// parent: 'mtc'
	})
	.state('profile', {
		// abstract: true,
		url: '/profile',
		templateUrl: 'common/profile/profile.template.html',
		controller: 'profileController',
		controllerAs: 'user',
		meta: {
	        'title': 'User profile',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
		// template: '<ui-view>'
	})
	.state('profile.courses', {
		url: '/courses',
		templateUrl: 'common/profile/profile.courses.template.html',
		controller: 'profileCoursesController',
		controllerAs: 'user',
		meta: {
	        'title': 'Courses generate by user',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
	})
	.state('profile.bio', {
		url: '/bio',
		templateUrl: 'common/profile/profile.bio.template.html',
		controller: 'profileController',
		controllerAs: 'user',
		meta: {
	        'title': 'User bio',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
	})
	.state('profile.edit', {
		url: '/edit',
		templateUrl: 'common/profile/profile.edit.template.html',
		controller: 'profileEditController',
		meta: {
	        'title': 'Profile edit',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
	})
	.state('pricing', {
		url: '/pricing',
		templateUrl: 'home/pricing.html',
		meta: {
	        'title': 'Pricing',
	        'description': 'Pricing'
      	}
		// controller: 'priceController'
		// parent: 'mtc'
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
		controllerAs : 'vm',
		meta: {
	        'title': 'Searching for courses',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'	
	})
	.state('coachDetail', {
		url: '/coaches/:coachid',
		templateUrl: 'common/coachDetail/coachDetail.view.html',
		controller: 'coachDetailCtrl',
		controllerAs : 'vm',
		meta: {
	        'title': 'Course detail',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	.state('userDetail', {
		url: '/user/:userid',
		templateUrl: 'common/coachDetail/userDetail.view.html',
		controller: 'userDetailController',
		controllerAs : 'user',
		meta: {
	        'title': 'User detail',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	
	.state('coachEdit', {
		url: '/coachEdit/:coachid',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'coachEditCtrl',
		controllerAs : 'vm',
		meta: {
	        'title': 'Coach edit',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	.state('addCoach', {		
		url: '/addCoach',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'addCoachCtrl',
		controllerAs: 'vm',
		redirectTo: 'addPic',
		meta: {
	        'title': 'Add a new course',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	.state('subscription', {		
		url: '/subscription',
		templateUrl: 'common/subscription/subscription.template.html',
		controller: 'subscriptionCtrl',
		controllerAs: 'vm',
		meta: {
	        'title': 'Subscription',
	        'description': 'Find the tutor or coach in various subjects.'
      	}
		// parent: 'mtc'
	})
	
	
	
	$urlRouterProvider.otherwise('home');

	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');


	// i18n
	var fileNameConvention = {
	  prefix: '/translate/local-',
	  suffix: '.json'
	};
	$translateProvider.preferredLanguage('en');
	 var langMap = {
      'en_AU': 'en',
      'en_CA': 'en',
      'en_NZ': 'en',
      'en_PH': 'en',
      'en_UK': 'en',
      'en_US': 'en',
      'th_TH': 'th'
  	};

	  $translateProvider
	    .useStaticFilesLoader(fileNameConvention)
	    .registerAvailableLanguageKeys(['en', 'th'], langMap)
	    .preferredLanguage('th')
	    .fallbackLanguage(['en'])
	    // .useCookieStorage() // Store the user's lang preference
    	.useSanitizeValueStrategy('sanitizeParameters'); // Prevent hacking of interpoloated strings

	};




app.config(['lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$translateProvider', 'ngMetaProvider', config]);



app.run(function($rootScope, $state, authService, authManager, lock) {


 	  lock.interceptHash();
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
 
	$rootScope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 0;
	});
});

app.run(function(ngMeta) {
	ngMeta.init();
});

})();