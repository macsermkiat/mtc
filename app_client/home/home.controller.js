(function () {

angular
	.module('mtcApp')
	.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$stateParams', '$state', '$http', 'mtcData', '$log', '$location'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function homeCtrl ($stateParams, $state, mtcData, $http, $location) {
	
	
	var vm = this;
	// vm.text = "";
	
	vm.onSubmit = function(err) {
		if (vm.text !== "") {
			// $http.get('api/coaches/search/?text=' + vm.text)
			$state.go('search', {text: vm.text})

			// $location.search('textSearch', vm.textSearch);
			// mtcData.SearchCategoryService(vm.textSearch)
			// .success(function(data, status, headers, config) {
			// 		alert("search results found!");
			// 		// SearchCategoryservice.searchCategory.arrSearchResults = data;
			// 	})
			// .error(function(data, status, headers, config) {
			// 		alert("Something failed!");
			// 		// SearchCategoryservice.searchCategory.arrSearchResults = [];
				// });
		}
	}
}


})();