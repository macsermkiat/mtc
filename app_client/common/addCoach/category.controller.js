(function () {

angular
	.module('mtcApp')
	.controller('categoryController', SearchBoxController);

categoryController.$inject = ['$state', 'mtcData', '$timeout', '$http'];


//For IE 8-9
if (window.location.pathname !== '/') {
window.location.href = '/#' + window.location.pathname;
}

	function categoryController () {
		var vm = this;
		vm.addModel = function (select) {
				vm.formData.category = select;
		};


	vm.item = [{
      id: 0,
      name: 'London'
    },{
      id: 1,
      name: 'Paris'
    },{
      id: 2,
      name: 'Milan'
    }];	
}
})();