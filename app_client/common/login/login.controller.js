(function() {

  

  angular
    .module('mtcApp')
    .controller('loginController', loginController);

    loginController.$inject = ['authService', '$translate', '$rootScope', '$scope', '$state', '$timeout', '$uibModal'];

    function loginController(authService, $translate, $rootScope, $scope, $state, $timeout, $uibModal) {
      this.$onInit = function() {
      var lgin = this;
      lgin.authService = authService;

      // i18n
     
      lgin.changeLanguage = function(langKey) {
            $translate.use(langKey);
      };
      
      // Set the user profile when the page is refreshed
      lgin.getSubscription = $rootScope.isSubscribed;
      lgin.serviceSubscription = $rootScope.authService.userSubscription;
      lgin.isAuthenticated = $rootScope.isAuthenticated;
      lgin.localStorageSubscription = localStorage.getItem('subscription');
      
      $timeout(function() {


        lgin.getSubscription = $rootScope.isSubscribed;
      },1000);

      $rootScope.$on('userProfileSet', function(event, profile) {
        lgin.isAuthenticated = $rootScope.isAuthenticated;
        lgin.profile = profile;
        // lgin.profile.picture = $sce.trustAsResourceUrl(profile.picture);
      });

      $rootScope.$on('subscriptionSet', function(event, subscription) {
        $timeout(function() {
        lgin.getSubscription = $rootScope.isSubscribed;
      },1000);
      });

      var accessData = localStorage.getItem('profile');
      if(accessData) {
       lgin.profile = angular.fromJson(accessData);
      };
      // Put the authService on $scope to access
      // the login method in the view
    //   var vm = this;
    //   vm.lock = lock;
      var lock = new Auth0Lock("2m8hbwYC8UdyjITdKGDptrRvF6BXweY7" ,"royyak.auth0.com");
      
      // Listening for the authenticated event
      lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getProfile() and save it to localStorage
       
       lock.getProfile(authResult.idToken, function(error, result) {
          
          if (error) {
            console.log(error);
            return;
          }
          if (result) {
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('profile', JSON.stringify(profile));
          };
          return;

        })
       

       
       
       
      });

        // Display the user's profile

      lgin.addCoach = function() {
        var sub =  localStorage.getItem('subscription');
        if (sub == 'false') {
          alert($filter('translate')('PROFILE.ALERT'));
          $state.go('subscription');
        } else if(sub == 'true') {
          $state.go('addCoach');
        }
      };

      lgin.student = function() {
        localStorage.setItem('role', 'student');
        authService.login();
      }

      lgin.teacher = function() {
        localStorage.setItem('role', 'teacher');
        $state.go('become');
      }

      lgin.becomeCoach = function() {
        if ($rootScope.isAuthenticated === false) {
          authService.login();
        } else if ( $rootScope.isAuthenticated === true) {
          $state.go('profile.bio');
        }
      };

      lgin.popupHelp = function () {
          var uibModalInstance = $uibModal.open({
            templateUrl: '/home/helpModal.view.html'
          });
          uibModalInstance.result.then(function (data) {
            // vm.data.location.reviews.push(data);
            console.log("Help");
          })
      };


  }
};

})();