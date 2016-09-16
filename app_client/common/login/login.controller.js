(function() {

  

  angular
    .module('mtcApp')
    .controller('loginController', loginController);

    loginController.$inject = ['authService', '$rootScope', '$window', '$state', '$timeout'];

    function loginController(authService, $rootScope, $window, $state, $timeout) {

      var lgin = this;

      lgin.authService = authService;
      lgin.isAuthenticated = $rootScope.isAuthenticated;

      var accessData = localStorage.getItem('profile');
      lgin.profile = angular.fromJson(accessData);
      // Put the authService on $scope to access
      // the login method in the view
    //   var vm = this;
    //   vm.lock = lock;
      var lock = new Auth0Lock("2m8hbwYC8UdyjITdKGDptrRvF6BXweY7" ,"royyak.auth0.com");
      
      // Listening for the authenticated event
      lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getProfile() and save it to localStorage
       
       lock.getProfile(authResult.idToken, function(error, result) {
          console.log(authResult.idToken);
          if (error) {
            console.log(error);
            return;
          }
          if (result) {
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('profile', JSON.stringify(profile));
          };
          return;
      
    //       var id_token = localStorage.getItem('id_token');
    //       if (id_token) {
    // // the user is logged in, we show the nickname
            
    //         // lgin.profile = JSON.parse(localStorage.getItem('profile'));
    //         // document.getElementById('profile').textContent = profile.nickname;
    //       } else {
    //         // the user is not logged in, we show a button to log in (asumming
    //         //  it was hidden)
    //         document.getElementById('loginBtn').style = "visibilty: visible";
    //       }
        });

       
       
       
      });

      // document.getElementById('btn-login').addEventListener('click', function() {
      //   lock.show();
      // });
    //   vm.isLoggedIn = function() {
      //   var token = localStorage.getItem('idToken');
      //     if (token) {
      //       showLoggedIn();
      //     } else {
      //       return false;
      //     }
      // };

        // Display the user's profile
      lgin.addCoach = function(val) {
        if (val = true) {
          $state.go ('addCoach');
        } else {
          
          return false;
        }
      };


      function showLoggedIn() {
          var profile = JSON.parse(localStorage.getItem('profile'));
          
          document.getElementById('nick').textContent = profile.nickname;
      };
        
    //   vm.onLogin = function() {
    //     activate();
    //   };

    //   vm.activate = function() {
    //       lock.show();
    //   };
      
    // }
  };


})();