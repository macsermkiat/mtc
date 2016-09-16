(function() {

  'use strict';

  angular
    .module('mtcApp')
    .service('authService', authService);

  authService.$inject = ['$timeout', '$window', '$rootScope', 'lock', 'authManager', '$location', '$state'];

  function authService($timeout, $window, $rootScope, lock, authManager, $location,  $state) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

    function getUserProfile() {
      return userProfile;
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function login() {  
        lock.show()
    };
    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
      $state.go('home');
      $window.location.reload();
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function(authResult) {
        
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();

        lock.getProfile(authResult.idToken, function(error, profile) {
          if (error) {
            console.log(error);
          }  else {
            localStorage.setItem('profile', JSON.stringify(profile));
            setUserProfile(profile);
            $timeout(function() {
              $window.location.reload();
            },1000)
            $state.go('home');
            $rootScope.$broadcast('userProfileSet', profile);
            
          }
        });
      });
    }

    return {
      userProfile: userProfile,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
    }
  }


})();