(function () {

angular
	.module('mtcApp')
	.factory('metadataService', metadataService);

metadataService.$inject = ['$http', '$rootScope', '$window'];

function metadataService ($http, $rootScope, $window) {
    var self = this;

    var meta = document.getElementsByTagName("meta"); 
	// Set custom options or use provided fallback (default) options
	var loadMetadata = function(metadata) {
	   self.title = document.title = angular.isDefined(metadata.title) ? metadata.title || 'Match The Coach' : '' ;
	   self.description = meta.description.content =  angular.isDefined(metadata.description) ? metadata.description || 'Match The Coach' : '' ;
	};
	 
	
   return {
   	loadMetadata: loadMetadata,
	restrict: 'A',
    scope: {
      metaproperty: '@'
    },
    link: function postLink(scope, element, attrs) {
      scope.default = element.attr('content');
      scope.metadata = metadataService;
   
      // Watch for metadata changes and set content
      scope.$watch('metadata', function (newVal, oldVal) {
        setContent(newVal);
      }, true);
   
      // Set the content attribute with new metadataService value or back to the default
      function setContent(metadata) {
        var content = metadata[scope.metaproperty] || scope.default;
        element.attr('content', content);
      };
   
      setContent(scope.metadata);
     }
    };
};  

})();