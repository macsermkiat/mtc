(function () {

angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData', '$state', '$timeout','Upload'];

	function addCoachCtrl (mtcData, $state, $timeout, Upload) {
	
		var vm = this;
		// vm.coachData = coachData;
		
		vm.message = {};
		vm.isDisabled = false;

		vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.uploadPic(vm.formdata.picture);
				vm.doAddCoach(vm.formData);
				vm.isDisabled = true;
				vm.message.success = true;
				$timeout(function () {

		    	vm.message.success = false;
					}, 1000).then(function() {
		
						$state.go('home');			
				})
			}	
		};	

		

		vm.doAddCoach = function (formData) {
			console.log(formData);
			mtcData.createCoach({
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
			    location: formData.loaction,
			    category: formData.category,
			    videoid: formData.videoid,
			    picture: formData.picture
			})
			.then(function (error) {
				if (error) {					
					vm.formError = "Your review has not been saved, try again";
					
				}else {
					console.log("YES!")
									
				};
		
			});
		return false;
		};

		vm.resetForm = function() {
			vm.addCoach.$setPristine();
		};

		vm.uploadPic = function(file) {
			file.upload = Upload.upload({
				url: 'http://localhost:3000/coaches',
				data: {file: file}
			});
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

			};
	
	// vm.uibModal = {
	// 	close : function (result) {
	// 		$uibModalInstance.close(result);
	// 	},
	// 	cancel : function () {
	// 		$uibModalInstance.dismiss('cancel');
	// 	}
	// };
	}
	

})();