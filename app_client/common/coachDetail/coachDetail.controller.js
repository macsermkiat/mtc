(function () {

angular
	.module('mtcApp')
	.controller('coachDetailCtrl', coachDetailCtrl);

coachDetailCtrl.$inject = ['$stateParams', 'metadataService', 'mtcData', '$log', '$scope', '$uibModal', '$rootScope', '$state'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

function coachDetailCtrl($stateParams, metadataService, mtcData, $log, $scope, $uibModal, $rootScope, $state) {
	this.$onInit = function() {
	var vm = this;
	vm.coachid = $stateParams.coachid;
	metadataService.loadMetadata({
	  title: 'รายละเอียดโค้ช ' + vm.coachid,
	  description: 'ดูรายละเอียดตามรายวิชา'
	});

	vm.playerVars = { autoplay: 0};
	vm.vdo=null;
	activate();

	function copy() {
		var copyTextareaBtn = document.querySelector('.js-textareacopybtn');
		copyTextareaBtn.addEventListener('click', function(event) {
		  var copyTextarea = document.querySelector('.js-copytextarea');
		  copyTextarea.select();
		  try {
		    var successful = document.execCommand('copy');
		    var msg = successful ? 'successful' : 'unsuccessful';
		    console.log('Copying text command was ' + msg);
		  } catch (err) {
		    console.log('Oops, unable to copy');
		  }
		});
	};
	copy();

	function activate() {
		idCoaches();
		$log.info('View coach by ID');
	};

	function idCoaches() {
		mtcData.coachById(vm.coachid)
			.then(function(data) {
				if (data) {
					vm.data = { coach: data };
					vm.videoid = data.videoid;
					vm.vdo = true;
				} else {
					vm.vdo = false;
				}			
			})
			.catch(function (e) {
				console.log(e);
			});
	};

	vm.popupRequestForm = function () {
		// if ($rootScope.isAuthenticated === true) {
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
						   price: vm.data.coach.price,
						   length: vm.data.coach.courseLength,
						   name: vm.data.coach.name,
						   rating: vm.data.coach.rating
						};
					}
				}
			});
			uibModalInstance.result.then(function (data) {
				// vm.data.location.reviews.push(data);
				console.log(data);
			})
		// } else {
		// 	alert('Please log in to continue');
		// 	return false;
		// }
			
			
	};
	

	}
};

})();