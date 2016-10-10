(function() {

  'use strict';

  angular
    .module('mtcApp')
    .service('authService', authService);

  authService.$inject = ['$timeout', '$rootScope', 'lock', 'authManager', '$http', '$location', '$state', '$window'];

  function authService($timeout, $rootScope, lock, authManager, $http, $location,  $state, $window) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};
    var userSubscription = JSON.parse(localStorage.getItem('subscription')) || {};
    
    function getUserProfile() {
      return userProfile;
    };

    function setUserProfile(profile) {
      userProfile = profile;
    };
    function getUserSubscription() {
      return userSubscription;
    };

    function setUserSubscription(subscription) {
      userSubscription = subscription;
    };
    function login() {  
        lock.show()
    };
    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      localStorage.removeItem('subscription');
      authManager.unauthenticate();
      userProfile = {};
      $state.go('/');
      $window.location.reload();
      // $rootScope.$broadcast('userProfileSet', null);
      // $rootScope.$broadcast('subscriptionSet', null);
    };


    function subscriptionYet() {
        var accessData = localStorage.getItem('profile');
        var profileData = angular.fromJson(accessData);
        var id = profileData.identities[0].user_id;
        console.log(id);
        
        userBio(id);
        
        function userBio(id) {
          return $http.get('/api/user/' + id)
            .then(function(response) {
              var val = response.data[0];
              console.log(val);
              if(val == undefined){            
              localStorage.setItem('subscription', false);
              $rootScope.isSubscribed = false;
              } else {
              localStorage.setItem('subscription', true);
              $rootScope.isSubscribed = true;
            };
            // var subscriptionData = localStorage.getItem('subscription');
            // setUserSubscription(subscriptionData);
            // return;
           }, function(error) {
            if (err) {
              console.log(error);
            }
           });
         };
    };
        
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
            subscriptionYet();
            
            // localStorage.setItem('subscription', JSON.stringify(subscription));
            // setUserSubscription(subscription);
            $timeout(function() {
              $state.go('/');
              // $window.location.reload();
            },100)
            // $state.go('/');
            // $window.location.reload();

            $rootScope.$broadcast('userProfileSet', profile);
            $rootScope.$broadcast('subscriptionSet', userSubscription);
          }
          
        });
      });
    }

    return {
      getUserProfile: getUserProfile,
      userProfile: userProfile,
      userSubscription: userSubscription,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
    }
  }


})();