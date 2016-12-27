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
	 vm.onSelect = function ($item, $model, $label) {
    	vm.$item = $item;
   	    vm.$model = $model;
        vm.$label = $label;
    };

	vm.onSubmit = function(err) {
		
		if (vm.text !== "") {
			// $http.get('api/coaches/search/?text=' + vm.text)
			$state.go('search', {text: vm.text})
		}
	};

	// vm.limit= 10;

	// // loadMore function
	// vm.loadMore = function() {
	//   vm.limit +=10;
	// }

// Search Category Schema
	vm.searching = function(val) {
		return $http.get('api/coaches/searchCat', {params: {text:val}})
		.then(function(response) {
			return response.data;
		})
	};

	activate();

	function activate() {
		return mtcData.allCats()
			.then(function(data) {			
				vm.data = { cat: data.data }
			})
			.catch(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
	};
	

	vm.addModel = function (select) {
		vm.text = select;
		$state.go('search', {text: vm.text});
	}



		
	};




})();