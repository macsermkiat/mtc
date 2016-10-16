(function () {

angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData', '$state', '$timeout','Upload','$scope', 'awsPolicy', 'spinnerService'];

	function addCoachCtrl (mtcData, $state, $timeout, Upload, $scope, awsPolicy, spinnerService) {
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
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price ||
				!vm.formData.shortDescription || !vm.formData.courseDescription ||
				 !vm.formData.time || !vm.formData.province || !vm.formData.location|| 
				 !vm.formData.category) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				var data = vm.formData;
				vm.doAddCoach(data);					
			}
		};	

		var now = new Date;
		var createdDate = now.toISOString();
		console.log(createdDate);
		

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
			    province: formData.province,
			    category: formData.category,
			    videoid: formData.videoid,
			    createdBy: identity
			}).then(function(success){
					vm.isDisabled = true;
					vm.message.success = true;
					$timeout(function () {
				    	vm.message.success = false;
							}, 2000);
					$timeout (function(){
						$state.go('/')},2000);
					

				}, function(error) {
					var vals = Object.keys(error).map(function (key) {
					return error[key];	
					});					
					console.log(vals[0].message);
					$scope.formError = "Your course has not been added, try again. Possible from duplicate data.";
				});
		return false;
		};

		vm.resetForm = function() {
			vm.addCoach.$setPristine();
		};

		
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