(function () {

angular
	.module('mtcApp')
	.controller('priceController', priceController);

priceController.$inject = ['$scope', '$translate'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

	function priceController ($scope, $translate) {
		$scope.changeLanguage = function(langKey) {
			$translate.use(langKey);
		}

	};
	

})();