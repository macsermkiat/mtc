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

	// Get profile from localStorage
	var accessData = localStorage.getItem('profile');
	var profile = angular.fromJson(accessData);
	var identity = profile.identities[0].user_id;
	var imageUrl;

	vm.message = {};
	vm.isDisabled = false;

	vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price ||
				!vm.formData.shortDescription || !vm.formData.courseDescription ||
				 !vm.formData.time || !vm.formData.province || !vm.formData.location|| 
				 !vm.formData.category || !vm.formData.courseLength) { 
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
							vm.formError = "Your edit has not been saved, try again";
							
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
					vm.imageUrl = data.imageUrl;
					imageUrl = data.imageUrl;
					oldCategory = data.category;
				} else {
					console.log("Error: no coachid found")
				}

				
				console.log('coachid found');
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
			    imageUrl: imageUrl,
			    videoid: formData.videoid,
			    oldCategory: oldCategory
			});

			
			
		return false;
		};

	vm.resetForm = function() {
		$scope.subscription.$setPristine();
		};

	var now = new Date;
	var createdDate = now.toISOString();
	// var initialimage = vm.formData;
	// console.log(initialimage);

	$scope.beforeResizingImages = function(images) {
			spinnerService.show('picturespinner')
	};

	$scope.afterResizingImages = function(images) {
		spinnerService.hide('picturespinner');
	};
	$scope.uploadPic = function(file) {
			
			// var blob = Upload.dataUrltoBlob(dataUrl, name);
			// var png = new File([blob], createdDate);
			// file = png;
			alert("เมื่อ upload หรือเปลี่ยนรูปใหม่เสร็จ ต้องทำการ submit แบบฟอร์มทั้งหมดที่ปุ่ม Submit ด้านล่างสุดบรรทัดสุดท้ายด้วยทุกครั้ง\nEverytime you finish upload or change the new picture. Please submit the whole form via the button beneath last line");
			Promise.resolve(sign).then(function(s3) {	
				return s3;
			}).then(function(s3) {
				Upload.upload({
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
				
				}).then(function(response) {
					$timeout(function() {
						$scope.result = response.data;
					});
				}, function(response) {
					if (response.status > 0)
						$scope.errorMsg = response.status + ':' + response.data;
					
				}, function (evt) {
					$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
					imageUrl = "https://s3-ap-southeast-1.amazonaws.com/matchthecoach/coaches/" + createdDate;
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