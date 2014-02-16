

angular.module('IndexApp', ['Global']);


angular.module('IndexApp').
controller('MainController', [
	'$scope',
	function($scope) {
		$scope.browser = angular.broswer;
	}
]);