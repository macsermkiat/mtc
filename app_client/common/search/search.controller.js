(function () {

angular
	.module('mtcApp')
	.controller('searchCtrl', searchCtrl);

searchCtrl.$inject = ['$stateParams', '$http', 'mtcData', '$log'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};

function searchCtrl($stateParams, $http, mtcData, $log) {
	var vm = this;
	// vm.allCoaches = allCoaches;
	// vm.coaches = [];
	vm.text = $stateParams.text;
	
	activate();

	function activate() {
		return searchingCoaches().then(function() {
			$log.info('Search coaches by keyword.');
		});
	}

	function searchingCoaches() {
		return mtcData.searchCategoryService(vm.text)
			.success(function(data) {
				vm.data = { coach: data }
			});
	};

	
			
}


})();