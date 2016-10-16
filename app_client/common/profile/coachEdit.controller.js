(function () {

angular
	.module('mtcApp')
	.controller('coachEditCtrl', coachEditCtrl);

coachEditCtrl.$inject = ['$stateParams', '$http', 'mtcData', 'userService', '$log', '$scope', '$state', '$timeout', 'Upload', 'awsPolicy', 'spinnerService'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function coachEditCtrl($stateParams, $http, mtcData, userService, $log, $scope, $state, $timeout, Upload, awsPolicy, spinnerService) {
	var vm = this;
	// vm.allCoaches = allCoaches;
	vm.coachid = $stateParams.coachid;
	var sign =awsPolicy.getSign();
	console.log(sign);

	// Get profile from localStorage
	var accessData = localStorage.getItem('profile');
	var profile = angular.fromJson(accessData);
	var identity = profile.identities[0].user_id;

	vm.message = {};
	vm.isDisabled = false;

	vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price ||
				!vm.formData.shortDescription || !vm.formData.courseDescription ||
				 !vm.formData.time || !vm.formData.location|| !vm.formData.category) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				var data = vm.formData;
				vm.doEdit(data);
					
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
				$state.go('profile.courses');
					
			}
				
		};	
	
	activate();

	function activate() {
		return idCoaches().then(function() {
			$log.info('View coach by ID');
		});
	}

	function idCoaches() {
		return mtcData.coachById(vm.coachid)
			.success(function(data) {
				if (data) {
					vm.formData = data;
					
				} else {
					console.log("Error: no coachid found")
				}

				
				console.log(vm.data);
			})
			.error(function (e) {
				console.log(e);
			});
	};

	vm.doEdit = function (formData) {

			userService.updateCoach({
				createdDate : createdDate,
				coachid : vm.coachid,
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
			    province: formData.province,
			    category: formData.category,
			    videoid: formData.videoid
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

	vm.resetForm = function() {
		$scope.subscription.$setPristine();
		};

	var now = new Date;
	var createdDate = now.toISOString();
	console.log(createdDate);

	$scope.beforeResizingImages = function(images) {
			spinnerService.show('picturespinner')
	};

	$scope.afterResizingImages = function(images) {
		spinnerService.hide('picturespinner');
	};
	
	$scope.uploadPic = function(file) {
		Promise.resolve(sign).then(function(s3) {	
			return s3;
		}).then(function(s3) {
			file.upload = Upload.upload({
				url: 'https://matchthecoach.s3.amazonaws.com', //S3 upload url including bucket name
			    method: 'POST',
			    data: {
			        key: 'coaches/' + createdDate,// the key to store the file on S3, could be file name or customized
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
				
			}, function (evt) {
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		});
		
	};

	function browsingCat() {
	return mtcData.allCats()
		.success(function(data) {
			vm.data = { cat: data }

		})
		.error(function (e) {
			vm.message = "Sorry, something's gone wrong";
		});
	};
	browsingCat();




};
})();