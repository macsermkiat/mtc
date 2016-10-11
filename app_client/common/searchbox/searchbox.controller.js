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
	vm.text = "";
	// vm.message = {};

	vm.onSubmit = function(err) {
		
		if (vm.text !== "") {
			// $http.get('api/coaches/search/?text=' + vm.text)
			$state.go('search', {text: vm.text})
		}
	};

// Search Category Schema
	vm.searching = function(val) {
		return $http.get('api/coaches/searchCat', {params: {text:val}})
		.then(function(response) {
			console.log(response.data);
			return response.data;
		})
	};

	activate();

	function activate() {
		return mtcData.allCats()
			.success(function(data) {
				vm.data = { cat: data }

			})
			.error(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
	};
	

	vm.addModel = function (select) {
		vm.text = select;
	}



		
	};




})();