angular
	.module('mtcApp')
	.controller('searchCtrl', searchCtrl);

searchCtrl.$inject = ['$http', 'mtcData', '$log', '$uibModal'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function searchCtrl($http, mtcData, $log, $uibModal) {
	var vm = this;
	// vm.allCoaches = allCoaches;
	vm.coaches = [];
	activate();

	function activate() {
		return allCoaches().then(function() {
			$log.info('All coaches View');
		});
	}

	function allCoaches() {
		return mtcData.allCoaches()
			.then(function(data) {
				console.log(data);

				vm.coaches = data;
				return vm.coaches;
			});
			
	}
	console.log(vm.coaches);

	vm.popupCreateCoachForm = function () {
			var uibModalInstance = $uibModal.open({
				templateUrl: '/addCoach/addCoach.view.html',
				controller: 'addCoachCtrl',
				controllerAs: 'vm',
				resolve : {
					coachData : function () {
						return {
							coachid : vm.coachid,
							coachName : vm.data.coach.name
						};
					}
				}
			});

			uibModalInstance.result.then(function (data) {
				vm.data.location.reviews.push(data);
			});
		};
}
