angular
	.module('mtcApp')
	.factory('mtcData', mtcData);

mtcData.$inject = ['$http', '$log'];

function mtcData ($http, $log) {
	

	function allCoaches() {
		return $http.get('api/coaches')
		.then(allCoachesComplete)
		.catch(allCoachesFailed);

		function allCoachesComplete(response) {
			return response.data;
		}
		function allCoachesFailed(error) {
			$log.error('XHR Failed for allCoaches.' + error.data)
		}
	};

	function coachesParent() {
		return $http.get('api/coachesParent')
		.then(coachesParentComplete)
		.catch(coachesParentFailed);

		function coachesParentComplete(response) {
			return response.data;
		}
		function coachesParentFailed(error) {
			$log.error('XHR Failed for coachesParent.' + error.data)
		}
	};

	function createCoach(data) {
		return $http.post('/api/coaches', data)
		.then(createCoachComplete)
		.catch(createCoachFailed);

		function createCoachComplete(response) {
			return response.data;
		}
		function createCoachFailed(error) {
			$log.error('XHR Failed for allCoaches.' + error.data)
		}
	};



	return {
		allCoaches: allCoaches,
		createCoach: createCoach
	};
	

}






    