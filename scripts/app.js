

angular.module('RebatesApp', []);


angular.module('RebatesApp', []).
constant('LANUAGE', ['zh-CN', 'zh-TW']);


angular.module('RebatesApp').
controller('EnteranceController', [
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


angular.module('RebatesApp').
controller('DownloadsController', [
	'$scope', '$location',
	function($scope, $location) {

	}
]);


angular.module('RebatesApp').
controller('FAQController', [
	'$scope', '$location',
	function($scope, $location) {

	}
]);


angular.module('RebatesApp').
controller('IndexController', [
	'$scope', '$location',
	function($scope, $location) {
		$scope.browser = angular.broswer;
	}
]);


angular.module('RebatesApp').
controller('PrivacyController', [
	'$scope', '$location',
	function($scope, $location) {

	}
]);


angular.module('RebatesApp').
controller('TOSController', [
	'$scope', '$location',
	function($scope, $location) {

	}
]);


angular.module('RebatesApp').
controller('FooterController', [
	'$scope', '$location',
	'LANUAGE',
	function($scope, $location, LANUAGE) {		
		$scope.locale = $location.$$absUrl.
		replace($location.$$protocol + '://' + $location.$$host, '').
		replace(/^\//, '').
		replace(/\/[^\/]*$/, '');

		$scope.$watch('locale', function(locale, old) {
			if ('string' === typeof locale && old && locale !== '' && locale !== old) {
				window.location.href = $location.$$protocol + '://' + $location.$$host + '/' + $scope.locale + '/' + $location.$$path.replace(/^.*\//, '');
			}
		});
	}
]);