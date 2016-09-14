(function () {

angular
	.module('mtcApp')
	.controller('profileEditController', profileEditController);

	profileEditController.$inject = ['$window', '$scope', 'userService', '$state', '$timeout', 'awsPolicy', '$http'];

	function profileEditController ($window, $scope, userService, $state, $timeout, awsPolicy, $http) {
		// var$scope = this;

		
		var sign =awsPolicy.getSign();
		console.log(sign);

		// Get profile from localStorage
		var accessData = localStorage.getItem('profile');
		var profile = angular.fromJson(accessData);
		var identity = profile.identities[0].user_id;
		var id = profile.identities[0].user_id;
		//$scope.coachData = coachData;
		


	$scope.message = {};
	$scope.isDisabled = false;


	$scope.onSubmit = function () {
		$scope.formError = "";
			if(!$scope.result.name || !$scope.result.surname || !$scope.result.email ||
				!$scope.result.idnumber || !$scope.result.telephone) { 
			$scope.formError = "All fields required, please try again";
				return false;
			} else {
				var data =$scope.result
			$scope.doEdit(data);
					
			$scope.isDisabled = true;
			$scope.message.success = true;
				$timeout(function () {
			    $scope.message.success = false;
						}, 1000)
				.then(function(err) {
						if (err) {
							console.log(error);
						$scope.formError = "Your subscription has not been saved, try again";
						} else {
							console.log("YES!")
						}
						
								
				})
					
			}	
		};	

		var createdDate = new Date;

	$scope.doEdit = function (result) {

			console.log(result);
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
			});

			
			// .then(function (error, coach) {
			// 	if (error) {					
			// 	$scope.formError = "Your review has not been saved, try again";			
			// 	}else {
			// 		console.log("huh")						
			// 	};	
			// });
		return false;
		};

	$scope.resetForm = function() {
		$scope.subscription.$setPristine();
		};

		
		
		
		console.log($scope.result);
		
		
		// $scope.uploadPic = function(file) {
		// 	Promise.resolve(sign).then(function(s3) {	
		// 		return s3;
		// 	}).then(function(s3) {
		// 		file.upload = Upload.upload({
		// 			url: 'https://matchthecoach.s3.amazonaws.com/', //S3 upload url including bucket name
		// 		    method: 'POST',
		// 		    data: {
		// 		        key: createdDate, // the key to store the file on S3, could be file name or customized
		// 		        AWSAccessKeyId: s3.s3AccessKeyId,
		// 		        acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
		// 		        policy: s3.s3Policy, // base64-encoded json policy (see article below)
		// 		        signature: s3.s3Signature, // base64-encoded signature based on policy string (see article below)
		// 		        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
		// 		        filename: file.name, // this is needed for Flash polyfill IE8-9
		// 		        file: file
	 //    			}
		// 		});
		// 	}).then(function() {
		// 		file.upload.then(function(response) {
		// 			$timeout(function() {
		// 				file.result = response.data;
		// 			});
		// 		}, function(response) {
		// 			if (response.status > 0)
		// 			$scope.errorMsg = response.status + ':' + response.data;
		// 		},function (evt) {
		// 			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		// 		});
		// 	});
		// };
		
	
		
	//$scope.uibModal = {
	// 	close : function (result) {
	// 		$uibModalInstance.close(result);
	// 	},
	// 	cancel : function () {
	// 		$uibModalInstance.dismiss('cancel');
	// 	}
	// };
	
	};

})();