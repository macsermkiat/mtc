(function () {

angular
	.module('mtcApp')
	.controller('coachDetailCtrl', coachDetailCtrl);

coachDetailCtrl.$inject = ['$stateParams', '$http', 'mtcData', '$log', '$scope', '$uibModal', '$rootScope'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function coachDetailCtrl($stateParams, $http, mtcData, $log, $scope, $uibModal, $rootScope) {
	var vm = this;
	// vm.allCoaches = allCoaches;
	vm.coachid = $stateParams.coachid;
	$scope.playerVars = { autoplay: 0};
	$scope.vdo=null;
	// function getCoachId () {
	// 	vm.coachid = $stateParams.coachid;
	// }
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
				if (data) {
					vm.data = { coach: data};
					$scope.videoid = data.videoid;
					$scope.vdo = true;
				} else {
					$scope.vdo = false;
				}

				
				
			})
			.error(function (e) {
				console.log(e);
			});
	};

	vm.popupRequestForm = function () {
		if ($rootScope.isAuthenticated === true) {
			var uibModalInstance = $uibModal.open({
				templateUrl: '/common/request/requestModal.view.html',
				controller: 'requestModalCtrl',
				controllerAs: 'vm',
				resolve: {
					coachData: function() {
						return { 
						   coachid: vm.coachid,
						   shortDescription: vm.data.coach.shortDescription,
						   createdBy: vm.data.coach.createdBy,
						   price: vm.data.coach.price
						};
					}
				}
			});
			uibModalInstance.result.then(function (data) {
				// vm.data.location.reviews.push(data);
				console.log(data);
			})
		} else {
			alert('Please log in to continue');
			return false;
		}
			
			
	};
	


};

})();