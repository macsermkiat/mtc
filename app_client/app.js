(function() {

var app = angular.module('mtcApp', 	['ui.router',
									 'youtube-embed',
									 'ngFileUpload',
									 'ngImgCrop',
									 'w11k.angular-seo-header',
									 // 'uiCropper',
									 'auth0.lock',
									 'angularSpinners',
									 'pascalprecht.translate',
									 // 'ngMeta',
									 // 'auth0',
									 'angular-jwt',
									 'ngSanitize', 
									 'ngMessages', 
									 'ui.bootstrap', 
									 'duScroll']);


function config (lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $translateProvider) {

	lockProvider.init({
      domain: 'royyak.auth0.com',
      clientID: '2m8hbwYC8UdyjITdKGDptrRvF6BXweY7',
      options: {
      	auth: {
      		params: {
      			callbackURL: 'http://www.matchthecoach.com',
      			response: 'token',
      			state: location.href
      		}
      	},
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
		data: {
                head: {
                    title: 'สถานที่รวมครูและโค้ชทุกสาขาให้คุณเลือกเอง: Match The Coach',
                    keywords: ["ติวเตอร์", "ครูสอนพิเศษ", 'Private tutor', 'Teacher'],
                    description: "หาเจอง่ายครูสอนพิเศษ ติวสอบ ครูดนตรี กีฬา ภาษาอังกฤษ หรือสำหรับโพสงานฟรี : Matching tutor, teacher or post a teaching job for free",
                    canonical: 'https://www.matchthecoach.com',
                }
            }
		// parent: 'mtc'
	})
	.state('become', {
		url: '/become-a-coach',
		templateUrl: 'home/become.view.html',
		controller: 'loginController',
		controllerAs :'lgin'
		// parent: 'mtc'
	})
	.state('profile', {
		// abstract: true,
		url: '/profile',
		templateUrl: 'common/profile/profile.template.html',
		controller: 'profileController',
		controllerAs: 'user'
		// parent: 'mtc'
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
		controller: 'profileController',
		controllerAs: 'user'
	})
	.state('profile.edit', {
		url: '/edit',
		templateUrl: 'common/profile/profile.edit.template.html',
		controller: 'profileEditController'
	})
	.state('pricing', {
		url: '/pricing',
		templateUrl: 'home/pricing.html',
		data: {
                head: {
                    title: 'ราคาการแมทช์ : Pricing',
                    description: "คำถามที่พบบ่อยในเรื่องราคาการแมทช์ FAQ of Pricing",
                    canonical: 'https://www.matchthecoach.com/#!/pricing',
                }
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
		data: {
                head: {
                    title: 'Finding teacher / ค้นหาครู',
                    titleExtend: function (titleStr, toParams) {
		                  return titleStr+toParams.text;
		              },
                    canonical: 'https://www.matchthecoach.com/#!/coaches/search/?text=',
                    canonicalExtend: function (canonicalStr, toParams) {
		                  return canonicalStr+toParams.text;
		              }
                }
            }
		// parent: 'mtc'	
	})
	.state('coachDetail', {
		url: '/coaches/:coachid',
		templateUrl: 'common/coachDetail/coachDetail.view.html',
		controller: 'coachDetailCtrl',
		controllerAs : 'vm'
		// parent: 'mtc'
	})
	.state('userDetail', {
		url: '/user/:userid',
		templateUrl: 'common/coachDetail/userDetail.view.html',
		controller: 'userDetailController',
		controllerAs : 'user'
		// parent: 'mtc'
	})
	
	.state('coachEdit', {
		url: '/coachEdit/:coachid',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'coachEditCtrl',
		controllerAs : 'vm'
		// parent: 'mtc'
	})
	.state('addCoach', {		
		url: '/addCoach',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'addCoachCtrl',
		controllerAs: 'vm',
		redirectTo: 'addPic'
		// parent: 'mtc'
	})
	.state('subscription', {		
		url: '/subscription',
		templateUrl: 'common/subscription/subscription.template.html',
		controller: 'subscriptionCtrl',
		controllerAs: 'vm'
		// parent: 'mtc'
	})
	
	
	
	$urlRouterProvider.otherwise('/');

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




app.config(['lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$translateProvider', config]);



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


})();