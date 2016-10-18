(function () {

angular
	.module('mtcApp')
	.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$state', 'mtcData','$timeout'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function homeCtrl ($state, mtcData, $timeout) {
	
	
	var vm = this;
	// vm.text = "";
	vm.message = {};

	


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

	vm.doAddNewsLetter = function (formLetter) {
		mtcData.addNewsLetter({
			name : formLetter.name,
			email : formLetter.email
		})
	};

		
};

	




})();