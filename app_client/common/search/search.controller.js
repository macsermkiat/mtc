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
	// vm.key = ;
	activate();


	function activate() {
		return searchingCoaches().then(function() {
			$log.info('Search coaches by keyword.');
		});
	};

	var shuffleArray = function(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle
	  while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	};

	function searchingCoaches() {
		return mtcData.searchCategoryService(vm.text)
			.success(function(data) {
				vm.data = { coach: data }
				shuffleArray(vm.data.coach);
			})
			.error(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
	};

	

		// -> Fisher–Yates shuffle algorithm
	

	
			
}


})();