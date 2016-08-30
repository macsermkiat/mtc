(function() {

  

  angular
    .module('mtcApp')
    .controller('loginController', loginController);

    loginController.$inject = ['Auth0Lock'];

    function loginController(Auth0Lock) {

      // Put the authService on $scope to access
      // the login method in the view
      var vm = this;

      var lock = new Auth0Lock("2m8hbwYC8UdyjITdKGDptrRvF6BXweY7" ,"royyak.auth0.com");

      // Listening for the authenticated event
      lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getProfile() and save it to localStorage
        lock.getProfile(authResult.idToken, function(error, profile) {
          if (error) {
            console.log(error);
            return;
          }

          localStorage.setItem('token', authResult.idToken);
          localStorage.setItem('profile', JSON.stringify(profile));
        });
      });

      vm.isLoggedIn = function() {
        var token = localStorage.getItem('idToken');
          if (token) {
            showLoggedIn();
          } else {
            return false;
          }
      };

        // Display the user's profile

      vm.showLoggedIn = function() {
          var profile = JSON.parse(localStorage.getItem('profile'));
          return {
            nickname: profile.nickname
          };
          // document.getElementById('nick').textContent = profile.nickname;
      };
        
      vm.onLogin = function() {
        activate();
      };

      vm.activate = function() {
          lock.show();
      };
      
    }

})();