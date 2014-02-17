

angular.module('EnteranceApp', ['Global']);



angular.module('EnteranceApp').
controller('MainController', [
	'$scope', '$location',
	'LANUAGE',
	function($scope, $location, LANUAGE) {
		$scope.link = $location.$$protocol + '://' + $location.$$host + '/' + LANUAGE[0];

		var key;
		if (-1 !== (key = angular.inArray(navigator.language, LANUAGE))) {
			$scope.link = $location.$$protocol + '://' + $location.$$host + '/' + LANUAGE[key];
		}

		window.location.href = $scope.link;
	}
]);