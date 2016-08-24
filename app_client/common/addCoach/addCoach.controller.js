(function () {

angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData', '$state'];

	function addCoachCtrl (mtcData, $state) {
		var vm = this;
		// vm.coachData = coachData;
		

		vm.onSubmit = function () {
			vm.formError = "";
			if(!vm.formData.name || !vm.formData.subject || !vm.formData.price) { 
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.doAddCoach(vm.formData)
			}
			$state.go('home');
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
			    category: formData.category
			})
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