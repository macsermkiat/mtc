(function () {

angular
	.module('mtcApp')
	.controller('profileEditController', profileEditController);

	profileEditController.$inject = ['$scope', 'userService', '$state', '$timeout', 'awsPolicy', '$http'];

	function profileEditController ($scope, userService, $state, $timeout, awsPolicy, $http) {
		// var$scope = this;
		this.$onInit = function() {
		var sign =awsPolicy.getSign();

		var accessData = localStorage.getItem('profile');
		var profile = angular.fromJson(accessData);
		var identity = profile.identities[0].user_id;
		var id = profile.identities[0].user_id;
		$scope.message = {};

		
		$scope.onSubmit = function () {
			$scope.formError = "";
				if(!$scope.user.result.name || !$scope.user.result.surname || !$scope.user.result.email ||
					!$scope.user.result.idnumber || !$scope.user.result.telephone) { 
				$scope.formError = "All fields required, please try again";
					return false;
				} else {
					var data =$scope.user.result;
					$scope.doEdit(data);			
				}	
		};	

		var createdDate = new Date;

		$scope.doEdit = function (result) {
				userService.updateUser({
					memberSince : createdDate,
					identity: identity,
					name : result.name,
					surname : result.surname,
					email : result.email,
					picture : profile.picture,
					address: result.address,
					experience : result.experience,
					telephone : result.telephone,
					lineid : result.lineid,
					idnumber : result.idnumber,
					education: result.education,
				    term: result.term
				}).then(function(success){
					$scope.message.success = true;
					$timeout(function () {
				    	$scope.message.success = false;
							}, 2000);
					localStorage.setItem('subscription', true);
					$timeout (function(){
						$state.go('profile.bio')},2000);
					
				})
				.catch(function(error) {
					var vals = Object.keys(error).map(function (key) {
    					return error[key];	
					});					
					$scope.formError = "Your edit has not been saved, try again. Possible from duplicate data.";
				});
			return false;
		};

		$scope.resetForm = function() {
			$scope.subscription.$setPristine();
			};

	}
};
})();