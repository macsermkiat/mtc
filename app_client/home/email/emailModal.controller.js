(function () {

angular
.module('mtcApp')
.controller('emailModalController', emailModalController);

emailModalController.$inject = ['$uibModalInstance', 'mtcData', '$timeout'];

function emailModalController ($uibModalInstance, mtcData, $timeout) {
	
	var vm = this;


	vm.onSubmit = function () {
		vm.formError = "";
		vm.forSuccess = "";
		if(!vm.formLetter.role || !vm.formLetter.email) { 
			vm.formError = "All fields required, please try again";
			return false;
		} else {
			var data = vm.formLetter;
			vm.doRequest(data);
			vm.sendFreeCoupon(data);
		}
	};

	vm.sendFreeCoupon = function (formLetter) {
		mtcData.sendFirstLetter({
			email: formLetter.email
		}).then(function(success) {
			console.log("Your coupon was deliverec to" + email);
		}, function(error) {
			console.log("Something went wrong: " + error)
		})
	};

	vm.doRequest = function (formLetter) {
		mtcData
		.addNewsLetter({
			role : formLetter.role,
			email : formLetter.email
		})
		.then(function(success) {
			vm.formSuccess = "Thank you. We will send you a discount code via Email soon";
			$timeout(function() {
				vm.uibModal.close(success);
			},3000);
		}, function(error) {
			vm.formError = "Your request has not been sent, possible from duplicate Email";
		})
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