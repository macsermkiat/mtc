(function () {

angular
.module('mtcApp')
.controller('requestModalCtrl', requestModalCtrl);

requestModalCtrl.$inject = ['$uibModalInstance', 'mtcData', 'coachData', '$timeout'];

function requestModalCtrl ($uibModalInstance, mtcData, coachData, $timeout) {
	
	var vm = this;
	vm.coachData = coachData;
	var now = new Date;
	var accessData = localStorage.getItem('profile');
	var profile = angular.fromJson(accessData);
	var identity = profile.identities[0].user_id;
	var nameOfStudent = profile.name;
	var requestid = identity + ':' + now.toISOString();
	vm.success = false;
	vm.isDisabled = false;

	vm.onSubmit = function () {
		vm.formError = "";
		if(!vm.formData.time || !vm.formData.place || 
			!vm.formData.phone || !vm.formData.email || !vm.formData.sex) { 
			vm.formError = "All fields required, please try again";
			return false;
		} else {
			var data = vm.formData;
			vm.doRequest(data);
		}
	};

	vm.doRequest = function (formData) {
		vm.success = true;
		vm.isDisabled = true;
		mtcData.requestCoach({
			// author : formData.name,
			requestid: requestid,
			shortDescription: coachData.shortDescription,
			coachid: coachData.coachid,
			createdBy: coachData.createdBy,
			price: coachData.price,
			identity: identity,
			nameOfStudent: nameOfStudent,
			time : formData.time,
			place : formData.place,
			phone : formData.phone,
			email : formData.email,
			sex : formData.sex
		})
		.then(function(success) {
			vm.uibModal.close(success);
		}, function(error) {
			vm.formError = "Your request has not been sent, try again";
		})
		// .success(function (data) {
		// 	vm.uibModal.close(data);
		// })
		// .error(function (data) {
		// 	vm.formError = "Your request has not been sent, try again";
		// });
		// return false;
	};

	vm.uibModal = {
		close : function (result) {
			$uibModalInstance.close(result);
		},
		cancel : function () {
			$uibModalInstance.dismiss('cancel');
		}
	};

}

})();