(function () {

angular
.module('mtcApp')
.filter('addHtmlLineBreaks', addHtmlLineBreaks);

	function addHtmlLineBreaks () {
		return function (text) {
			var output = angular.isDefined(text) ? text.replace(/\n/g, '<br/>') : ''
			return output;
		};
	}
})();