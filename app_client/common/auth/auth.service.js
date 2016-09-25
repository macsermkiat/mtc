(function() {

  'use strict';

  angular
    .module('mtcApp')
    .service('authService', authService);

  authService.$inject = ['$timeout', '$window', '$rootScope', 'lock', 'authManager', '$http', '$location', '$state'];

  function authService($timeout, $window, $rootScope, lock, authManager, $http, $location,  $state) {

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
      $state.go('home');
      // $window.location.reload();
      $rootScope.$broadcast('userProfileSet', null);
      $rootScope.$broadcast('subscriptionSet', null);
    };

    function subscriptionYet() {
        var accessData = localStorage.getItem('profile');
        var profileData = angular.fromJson(accessData);
        var id = profileData.identities[0].user_id;
        userBio(id);
        function userBio(id) {
          return $http.get('/api/users/bio', {params: {id: id}} )
            .then(function(response) {
              if(response.data[0] == undefined){
              localStorage.setItem('subscription', false);
              $rootScope.isSubscribed = false;
              } else {
              localStorage.setItem('subscription', true);
              $rootScope.isSubscribed = true;
            };
            var subscriptionData = localStorage.getItem('subscription');
            setUserSubscription(subscriptionData);
            return;
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
            // $timeout(function() {
            //   $window.location.reload();
            // },1000)
            // $state.go('home');

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