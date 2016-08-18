angular
	.module('mtcApp')
	.controller('addCoachCtrl', addCoachCtrl);

	addCoachCtrl.$inject = ['mtcData'];

	function addCoachCtrl (mtcData) {
		var vm = this;
		// vm.coachData = coachData;
	

	vm.onSubmit = function () {
		vm.formError = "";
		if(!vm.formData.name || !vm.formData.subject || !vm.formData.price) { 
			vm.formError = "All fields required, please try again";
			return false;
		} else {
			vm.doAddCoach(vm.formData);
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
		    category: formData.category
		})
		// .success(function (data) {
		// 	console.log(data);
		// })
		// .error(function (data) {
		// 	vm.formError = "Your coach has not been created, try again";
		// });
		// return false;
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