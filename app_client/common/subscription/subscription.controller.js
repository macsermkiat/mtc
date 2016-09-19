(function () {

angular
	.module('mtcApp')
	.controller('subscriptionCtrl', subscriptionCtrl);

	subscriptionCtrl.$inject = ['userService', '$state', '$timeout','Upload','$scope', 'awsPolicy'];

	function subscriptionCtrl (userService, $state, $timeout, Upload, $scope, awsPolicy) {
		var vm = this;
		
		var sign =awsPolicy.getSign();
		console.log(sign);

		// Get profile from localStorage
		var accessData = localStorage.getItem('profile');
		var profile = angular.fromJson(accessData);
		var identity = profile.identities[0].user_id;
		
		// vm.coachData = coachData;
		
		vm.message = {};
		vm.isDisabled = false;


		vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.surname || !vm.formData.email ||
				!vm.formData.idnumber || !vm.formData.telephone) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				var data = vm.formData
				vm.doSubscription(data);
				vm.doAddNewsLetter(data);	
				vm.isDisabled = true;
				vm.message.success = true;
				$timeout(function () {
			    	vm.message.success = false;
						}, 3000)
				.then(function(err) {
						if (err) {
							console.log(error);
							vm.formError = "Your subscription has not been saved, try again";
						} else {
							console.log("YES!")
						}
														
				})
				localStorage.setItem('subscription', true);
				$state.go('home');	
			}	
		};	

		var createdDate = new Date;

		vm.doSubscription = function (formData) {

			console.log(formData);
			userService.registerUser({
				memberSince : createdDate,
				identity: identity,
				name : formData.name,
				surname : formData.surname,
				email : formData.email,
				picture : profile.picture,
				address: formData.address,
				experience : formData.experience,
				telephone : formData.telephone,
				lineid : formData.lineid,
				idnumber : formData.idnumber,
				education: formData.education,
			    term: formData.term
			})

			
			// .then(function (error, coach) {
			// 	if (error) {					
			// 		vm.formError = "Your review has not been saved, try again";			
			// 	}else {
			// 		console.log("huh")						
			// 	};	
			// });
		return false;
		};

		vm.resetForm = function() {
			vm.subscription.$setPristine();
		};

		vm.doAddNewsLetter = function (formData) {
			console.log(formLetter);
			mtcData.addNewsLetter({
				name : formData.name,
				email : formData.email
			})
		};
		
		
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
		// 				vm.errorMsg = response.status + ':' + response.data;
		// 		},function (evt) {
		// 			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		// 		});
		// 	});
		// };
		
	
		
	// vm.uibModal = {
	// 	close : function (result) {
	// 		$uibModalInstance.close(result);
	// 	},
	// 	cancel : function () {
	// 		$uibModalInstance.dismiss('cancel');
	// 	}
	// };
	
	};

})();