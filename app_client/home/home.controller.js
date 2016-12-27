(function () {

angular
	.module('mtcApp')
	.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['metadataService', '$state', '$translate', 'mtcData','$timeout', '$uibModal', '$rootScope'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function homeCtrl (metadataService, $state, $translate, mtcData, $timeout, $uibModal, $rootScope) {
	
	var vm = this;
	// vm.text = "";
	vm.message = {};

	
	vm.isAuthenticated = $rootScope.isAuthenticated;

	vm.onNewsLetter = function() {
		vm.Error = "";
			if(!vm.formLetter.email) { 
				vm.Error = "Email required, please try again";
				return false;
			} else {
				vm.doAddNewsLetter(vm.formLetter)
			}

			vm.message.success = true;
			$timeout(function () {
			    vm.message.success = false;
			}, 3000);
				
	};	

	vm.changeLanguage = function(langKey) {
            $translate.use(langKey);
      };

	vm.doAddNewsLetter = function (formLetter) {
		mtcData.addNewsLetter({
			name : formLetter.name,
			email : formLetter.email
		})
	};

	vm.popupEmailForm = function () {
		var uibModalInstance = $uibModal.open({
			templateUrl: '/home/email/emailModal.view.html',
			controller: 'emailModalController',
			controllerAs: 'vm'
			// resolve: {
			// 	coachData: function() {
			// 		return { 
			// 		   coachid: vm.coachid,
			// 		   shortDescription: vm.data.coach.shortDescription,
			// 		   createdBy: vm.data.coach.createdBy,
			// 		   price: vm.data.coach.price
			// 		};
			// 	}
			// }
		});
		uibModalInstance.result.then(function (data) {
			// vm.data.location.reviews.push(data);
			console.log(data);
		})	
	};

		
};

	




})();