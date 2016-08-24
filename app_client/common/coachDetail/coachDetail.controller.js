(function () {

angular
	.module('mtcApp')
	.controller('coachDetailCtrl', coachDetailCtrl);

coachDetailCtrl.$inject = ['$stateParams', '$http', 'mtcData', '$log', '$uibModal'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function coachDetailCtrl($stateParams, $http, mtcData, $log) {
	var vm = this;
	// vm.allCoaches = allCoaches;
	vm.coachid = $stateParams.coachid;
	// vm.coaches = {};
	activate();

	function activate() {
		return idCoaches().then(function() {
			$log.info('View coach by ID');
		});
	}

	function idCoaches() {
		return mtcData.coachById(vm.coachid)
			.success(function(data) {
				vm.data = { coach: data};
			});
			};
};

})();