(function () {

angular
	.module('mtcApp')
	.controller('SearchBoxController', SearchBoxController);

SearchBoxController.$inject = ['$state', 'mtcData', '$timeout', '$http'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function SearchBoxController ($state, mtcData, $timeout, $http) {
	
	
	var vm = this;
	// vm.text = "";
	// vm.message = {};

	vm.onSubmit = function(err) {
		
		if (vm.text !== "") {
			// $http.get('api/coaches/search/?text=' + vm.text)
			$state.go('search', {text: vm.text})
		}
	};

	
	vm.searching = function(val) {
		return $http.get('http://localhost:3000/api/coaches/search', {params: {text:val}})
		.then(function(response) {
			return response.data;
		
		});
		

		
	};


};

})();