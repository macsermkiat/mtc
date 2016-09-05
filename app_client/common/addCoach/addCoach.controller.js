(function () {

angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData', '$state', '$timeout','Upload','$scope', 'awsPolicy'];

	function addCoachCtrl (mtcData, $state, $timeout, Upload, $scope, awsPolicy) {
		var vm = this;
		
		var sign =awsPolicy.getSign();
		console.log(sign);

		
		
		// vm.coachData = coachData;
		
		vm.message = {};
		vm.isDisabled = false;


		vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				
				vm.doAddCoach(vm.formData);
				vm.isDisabled = true;
				vm.message.success = true;
				$timeout(function () {
			    	vm.message.success = false;
						}, 1000)
				.then(function(err) {
						if (err) {
							console.log(error);
							vm.formError = "Your review has not been saved, try again";
						} else {
							console.log("YES!")
						}
						
								
				})
				$state.go('home');	
			}	
		};	

		var createdDate = new Date;

		vm.doAddCoach = function (formData) {

			console.log(formData);
			mtcData.createCoach({
				createdDate : createdDate,
				name : formData.name,
				price : formData.price,
				subject : formData.subject,
				shortDescription : formData.shortDescription,
				courseDescription : formData.courseDescription,
				preparation : formData.preparation,
				group: formData.group,
			    time: formData.time,
			    courseLength: formData.courseLength,
			    level: formData.level,
			    location: formData.location,
			    category: formData.category,
			    videoid: formData.videoid
			    
			    
			});

			
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
			vm.addCoach.$setPristine();
		};

		
		
		
		$scope.uploadPic = function(file) {
			Promise.resolve(sign).then(function(s3) {	
				return s3;
			}).then(function(s3) {
				file.upload = Upload.upload({
					url: 'https://matchthecoach.s3.amazonaws.com/', //S3 upload url including bucket name
				    method: 'POST',
				    data: {
				        key: createdDate, // the key to store the file on S3, could be file name or customized
				        AWSAccessKeyId: s3.s3AccessKeyId,
				        acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
				        policy: s3.s3Policy, // base64-encoded json policy (see article below)
				        signature: s3.s3Signature, // base64-encoded signature based on policy string (see article below)
				        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
				        filename: file.name, // this is needed for Flash polyfill IE8-9
				        file: file
	    			}
				});
			}).then(function() {
				file.upload.then(function(response) {
					$timeout(function() {
						file.result = response.data;
					});
				}, function(response) {
					if (response.status > 0)
						vm.errorMsg = response.status + ':' + response.data;
				},function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		};
		
	
		
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