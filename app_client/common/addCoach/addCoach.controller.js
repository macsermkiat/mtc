(function () {

angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData', '$scope', '$state', '$timeout', '$window', 'Upload', 'awsPolicy', 'spinnerService'];

	function addCoachCtrl (mtcData, $scope, $state, $timeout, $window, Upload, awsPolicy, spinnerService) {
		this.$onInit = function() {
			var vm = this;
			
			var sign =awsPolicy.getSign();

			// Get profile from localStorage
			var accessData = localStorage.getItem('profile');
			var profile = angular.fromJson(accessData);
			var identity = profile.identities[0].user_id;
			
			// vm.coachData = coachData;
			
			// vm.formData.sale = 0;

		
		// $scope.$watch('vm.formData.sale', function() {
		// 	vm.presale = vm.formData.price * (100 / (100 - vm.formData.sale))
		// });

		vm.message = {};
		vm.isDisabled = false;
		$timeout(function() {
			alert("Please noted that it is prohibited to give out your contact (Telephone number ,LINE ID, email, or facebook contact, etc.) Your account will be banned if you break the rules.\n\nทางเราไม่อนุญาตให้ครูทุกท่านโพสเบอร์ติดต่อ LINE ID, facebook, Email หรือการติดต่อทุกชนิดในช่องที่ไม่ได้สำหรับให้กรอกสิ่งเหล่านี้ ถ้าฝ่าฝืนจะถูกแบนแอคเคานท์ทันที ขออภัยในความไม่สะดวก");
		} ,2000);

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
				vm.doAddCoach(data);
			}
		};	

		var now = new Date;
		var createdDate = now.toISOString();
		

		vm.doAddCoach = function (formData) {
		mtcData.createCoach({
				createdDate : createdDate,
				name : formData.name,
				price : formData.price,
				// sale : formData.sale,
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
			}).then(function(success) {
					vm.isDisabled = true;
					vm.message.success = true;
					$timeout(function () {
				    	vm.message.success = false;
							}, 2000);
					$timeout (function(){
						$state.go('/')},2000);
					$timeout (function(){
						$window.location.reload()},2500);
				})
			   .catch(function(error) {
					var vals = Object.keys(error).map(function (key) {
					return error[key];	
					});					
					vm.formError = "Your course has not been added, try again. Possible from duplicate data.";
				})
		return false;
		};

		vm.resetForm = function() {
			vm.addCoach.$setPristine();
		};

		
		$scope.beforeResizingImages = function(images) {
				spinnerService.show('picturespinner')
		};

		$scope.afterResizingImages = function(images) {
			spinnerService.hide('picturespinner')
		};

		
		$scope.uploadPic = function(file) {
			
			// var blob = Upload.dataUrltoBlob(dataUrl, name);
			// var png = new File([blob], createdDate);
			// file = png;
			alert("เมื่อ upload หรือเปลี่ยนรูปใหม่เสร็จ ต้องทำการ submit แบบฟอร์มทั้งหมดที่ปุ่ม Submit ด้านล่างสุดบรรทัดสุดท้ายด้วยทุกครั้ง\nEverytime you finish upload or change the new picture. Please submit the whole form via the button beneath last line");
			Promise.resolve(sign).
			then(function(s3) {	
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
				}) 
				.catch(function(e) {
					console.log(e);
				});
			})
			.catch(function(e) {
					console.log(e);
			});
		};
	}
}
})();