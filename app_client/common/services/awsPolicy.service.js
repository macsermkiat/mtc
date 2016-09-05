(function () {

angular
	.module('mtcApp')
	.factory('awsPolicy', awsPolicy);

awsPolicy.$inject = ['$http', '$log'];

function awsPolicy ($http, $log) {
	
	var getSign = function() {
 		return $http.get('/api/awsPolicy')
 		 .then(function(response) {
               return response.data;
                
			})
			
	
};
return {getSign: getSign}
}

})();