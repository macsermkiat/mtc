(function () {

angular
	.module('mtcApp')
	.controller('searchCtrl', searchCtrl);

searchCtrl.$inject = ['metadataService', '$stateParams', '$http', 'mtcData', '$log', '$uibModal'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
};

function searchCtrl(metadataService, $stateParams, $http, mtcData, $log, $uibModal) {
	
	var vm = this;
	// vm.allCoaches = allCoaches;
	// vm.coaches = [];
	vm.text = $stateParams.text;
	
	// vm.key = ;
	activate();

	metadataService.loadMetadata({
	  title: 'รายชื่อครูผู้เชี่ยวชาญ ' + vm.text,
	  description: 'หาครูผู้เชี่ยวชาญในวิชา ' + vm.text + ' ที่มีประสบการณ์มากมาย'
	});

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
			.then(function(data) {
				vm.data = { coach: data.data }
				shuffleArray(vm.data.coach);
			})
			.catch(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
	};

	vm.popupHelp = function () {
          var uibModalInstance = $uibModal.open({
            templateUrl: '/home/helpModal.view.html'
          });
          uibModalInstance.result.then(function (data) {
            // vm.data.location.reviews.push(data);
            console.log("Help");
          })
      };


		// -> Fisher–Yates shuffle algorithm
	

	
			
}


})();