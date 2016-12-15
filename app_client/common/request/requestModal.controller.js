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
	var identity;
	var checkIdentity = function() {
		if (profile) {
			identity = profile.identities[0].user_id;
		} else {
			identity = null;
		}
	};
	checkIdentity();
	// var nameOfStudent = profile.name;
	// var requestid = identity + ':' + now.toISOString();
	vm.success = false;
	vm.isDisabled = false;

	var studentMatchingFee;
	var matchingCalc = function () {
		if (coachData.rating === 5) {
				studentMatchingFee = 490
		} else {
				studentMatchingFee = 290
		}
	};
	matchingCalc();

	var coachMatchingFee;
	var matchingCoachCalc = function () {
		if (coachData.price <= 5000) {
				coachMatchingFee = 490
		} else {
				coachMatchingFee = coachData.price / 10
		}
	};	
	matchingCoachCalc();

	vm.onSubmit = function () {
		vm.formError = "";
		if(!vm.formData.time || !vm.formData.place || 
			!vm.formData.phone || !vm.formData.email || !vm.formData.sex) { 
			vm.formError = "All fields required, please try again";
			return false;
		} else {
			var data = vm.formData;
			alert("คุณได้ทำการขอแมทช์โค้ช " + coachData.name +'\nค่าธรรมเนียมการแมทช์ ' 
				+ studentMatchingFee + ' บาท\n\n'+
				"You choosing to match Coach " + coachData.name +'\nThe matching fee is ' 
				+ studentMatchingFee + ' Baht.')
			vm.doRequest(data);
		}
	};

	vm.doRequest = function (formData) {
		vm.success = true;
		vm.isDisabled = true;
		mtcData.requestCoach({
			// author : formData.name,
			requestid: now.toISOString(),
			shortDescription: coachData.shortDescription,
			coachid: coachData.coachid,
			createdBy: coachData.createdBy,
			price: coachData.price,
			coachMatchingFee : coachMatchingFee,
			studentMatchingFee : studentMatchingFee,
			identity: identity,
			// 
			name : formData.name,
			level : formData.level,
			goal : formData.goal,
			time : formData.time,
			place : formData.place,
			phone : formData.phone,
			email : formData.email,
			sex : formData.sex
		})
		.then(function(success) {
			vm.success = true;
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