(function () {
angular
	.module('mtcApp')
	.component('ngInitial',{
			restrict: 'A',
			controller: ['$scope', '$element', '$attr', '$parse', function($scope, $element, $attr, $parse) {
				var getter, setter, val;
				val = $attr.ngInitial || $attr.value || $element.text();
				getter = $parse($attr.ngModel);
				setter = getter.assign;
				setter($scope, val);
				}
			]
		}	
	);

})();