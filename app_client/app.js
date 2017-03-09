(function() {

var app = angular.module('mtcApp', 	['ui.router',
									 'angular.filter',
									 'youtube-embed',
									 'ngFileUpload',
									 'restangular',
									 // 'oc.lazyLoad',
									 // 'ngImgCrop',
									 // 'updateMeta',
									 'w11k.angular-seo-header',
									 'angularUtils.directives.dirPagination',
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


function config (RestangularProvider, $sceDelegateProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $translateProvider) {
	RestangularProvider.setBaseUrl('/api');
	RestangularProvider.configuration.getIdFromElem = function(elem) {
  // if route is customers ==> returns customerID
  	return elem[_.initial(elem.route).join('') + "ID"];
	}
	// RestangularProvider.setFullResponse(true);
	
	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://www.matchthecoach.com/**'
    ]);

	lockProvider.init({
      domain: 'royyak.auth0.com',
      clientID: '2m8hbwYC8UdyjITdKGDptrRvF6BXweY7',
      options: {
      	auth: {
      		params: {
      			// callbackURL: 'http://localhost:8080',
      			callbackURL: 'https://www.matchthecoach.com',
      			scope: 'openid email'
      			// state: location.href
      		},
      	redirect: true,
      	redirectUrl: window.location.href,
      	responseType: 'token',
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
		// views: {
		//     "lazyLoadView": {
	    //   	controller: 'homeCtrl',
				// controllerAs :'vm',
		//       // controller: 'AppCtrl', // This view will use AppCtrl loaded below in the resolve
		//       templateUrl: 'home/home.view.html'
		//     }
		// },
		// resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
		//     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
		//       // you can lazy load files for an existing module
		//              return $ocLazyLoad.load(['css/main.css','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css']);
		//     }]
        // },
		metadata : {
			 title: 'รับหาครูสอนพิเศษ tutor รับสอนพิเศษติวอังกฤษ ภาษาจีน ติวคณิตศาสตร์ เรียนดนตรี อบรมพนักงาน: MatchTheCoach',
			 description: 'จัดหาครูสอนพิเศษ เฉพาะครูติวเตอร์ที่ดีสุด เรียนกวดวิชาที่บ้าน ติวคณิตศาสตร์ ภาษาอังกฤษเรียนตัวต่อตัว ภาษาจีน เรียนดนตรี หาครูสอนพิเศษให้ลูก อบรมพนักงานองค์กร : Private teacher or tutor for your kids. Employees training.'
		},
		data: {
                head: {
                	canonical: "https://www.matchthecoach.com"
                }
            }
		// parent: 'mtc'
	})
	.state('become', {
		url: '/become-a-coach',
		templateUrl: 'home/become.view.html',
		controller: 'loginController',
		controllerAs :'lgin',
		metadata : {
			 title: 'สมัครเป็นครู เป็นติวเตอร์ เป็นโค้ช ครูสอนพิเศษ ติวเตอร์ลงประกาศฟรี: Tutor and teacher can post jobs for free.',
			 description: "สมัครเป็นครูสอนพิเศษหรือติวเตอร์ ไม่ว่าจะเป็นภาษาอังกฤษ ภาษาจีน คนิตศาสตร์ ดนตรี รวมถึงวิชาอื่นๆ ลงประกาศได้ฟรี Tutor and teacher can post jobs for free."
		},
		data: {
                head: {
                	canonical: "https://www.matchthecoach.com/#!/become.view.html"
                }
            }
		// parent: 'mtc'
	})
	.state('profile', {
		// abstract: true,
		url: '/profile',
		templateUrl: 'common/profile/profile.template.html',
		controller: 'profileController',
		controllerAs: 'user',
		metadata : {
			title: 'User Profile'
		}
		// parent: 'mtc'
		// template: '<ui-view>'
	})
	.state('profile.courses', {
		url: '/courses',
		templateUrl: 'common/profile/profile.courses.template.html',
		controller: 'profileCoursesController',
		controllerAs: 'user',
		metadata : {
			title: 'รายละเอียดคอร์สอน'
		}
	})
	.state('profile.bio', {
		url: '/bio',
		templateUrl: 'common/profile/profile.bio.template.html',
		controller: 'profileController',
		controllerAs: 'user',
		metadata : {
			title: 'รายละเอียดโค้ช'
		}
	})
	.state('profile.edit', {
		url: '/edit',
		templateUrl: 'common/profile/profile.edit.template.html',
		controller: 'profileEditController',
		metadata : {
			title: 'แก้ไขโปร์ไฟล์'
		}
	})
	.state('pricing', {
		url: '/pricing',
		templateUrl: 'home/pricing.html',
		metadata: {
			title: 'ราคาการแมทช์ : Pricing',
			description: "คำถามที่พบบ่อยในเรื่องราคาการแมทช์ FAQ of Pricing",
		},
		data: {
                head: {                     	
                    canonical: 'https://www.matchthecoach.com/#!/pricing'
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
		metadata : {
			title: 'หาครูพบ',
			description: 'หาครูตามรายวิชา'
		},
		data: {
                head: {
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
		controllerAs : 'vm',
		metadata : {
			title: 'รายละเอียดของวิชา',
			description: 'รายละเอียดของวิชา'
		},
		data: {
                head: {
                    canonical: 'https://www.matchthecoach.com/#!/coaches/',
                    canonicalExtend: function (canonicalStr, toParams) {
		                  return canonicalStr+toParams.coachid;
		              }
                }
            }
		// parent: 'mtc'
	})
	.state('userDetail', {
		url: '/user/:userid',
		templateUrl: 'common/coachDetail/userDetail.view.html',
		controller: 'userDetailController',
		controllerAs : 'user',
		metadata : {
			title: 'รายละเอียดโค้ช'
		}
		// parent: 'mtc'
	})
	.state('coachEdit', {
		url: '/coachEdit/:coachid',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'coachEditCtrl',
		controllerAs : 'vm',
		metadata : {
			title: 'แก้ไขรายละดอียดวิชา'
		}
		// parent: 'mtc'
	})
	.state('addCoach', {		
		url: '/addCoach',
		templateUrl: 'common/addCoach/addCoach.view.html',
		controller: 'addCoachCtrl',
		controllerAs: 'vm',
		redirectTo: 'addPic',
		metadata : {
			title: 'เพิ่มคิร์สสอน'
		}
		// parent: 'mtc'
	})
	.state('subscription', {		
		url: '/subscription',
		templateUrl: 'common/subscription/subscription.template.html',
		controller: 'subscriptionCtrl',
		controllerAs: 'vm',
		metadata : {
			title: 'สมัครเป็นโค้ช',
			description: 'Apply for a coach / teacher / tutor for free.' 
		}
		// parent: 'mtc'
	})
	.state('team', {		
		url: '/team',
		templateUrl: 'home/team.view.html',
		metadata : {
			title: 'บริษัท รอยหยัก จำกัด',
			description: 'Our Team'
		},
		data: {
                head: {                                        
                    canonical: 'https://www.matchthecoach.com/#!/team'
                }
            }
	})
	// .state('twit', {		
	// 	url: '/twit',
	// 	templateUrl: 'common/twit/twit.template.html',
	// 	controller: 'twitCtrl',
	// 	controllerAs: 'vm'
	// parent: 'mtc'
	// })

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
app.config(['RestangularProvider','$sceDelegateProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$translateProvider', config]);

app.run(function($rootScope, metadataService, $state, authService, authManager, lock) {
		// Route change handler, sets the route's defined metadata
	$rootScope.$on('$stateChangeSuccess', function (event, newRoute) {
	   metadataService.loadMetadata(newRoute.metadata);
    });


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

      $state.originalHrefFunction = $state.href;
	    $state.href = function href(stateOrName, params, options) {
	        var result = $state.originalHrefFunction(stateOrName, params, options);
	        if (result && result.slice(0, 1) === '/') {
	            return '#!' + result;
	        } else {
	            return result;
	        }
	    }


      

  });

app.run(function($window, $rootScope, $location, $anchorScroll) {
	$window.ga('create', 'UA-85637595-1', 'auto');
	$rootScope.$on('$locationChangeStart', function (event) {
	    $window.ga('send', 'pageview', $location.path());
	});
 
	$rootScope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 0;
	   // $rootScope.$state = $state;
	});
});



})();