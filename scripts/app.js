

angular.module('RebatesApp', []);


angular.module('RebatesApp').
constant('LANUAGE', ['zh-CN', 'zh-TW']);


angular.module('RebatesApp').
controller('IndexController', [
	'$scope',
	function($scope) {
		$scope.browser = angular.broswer;
	}
]);


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
	'$scope',
	function($scope) {

	}
]);


angular.module('RebatesApp').
controller('FAQController', [
	'$scope',
	function($scope) {

	}
]);


angular.module('RebatesApp').
controller('PrivacyController', [
	'$scope',
	function($scope) {

	}
]);


angular.module('RebatesApp').
controller('TOSController', [
	'$scope',
	function($scope) {

	}
]);


angular.module('RebatesApp').
controller('RepayController', [
	'$scope',
	function($scope) {
		$scope.redirect = '';

		var oURL = angular.parseUrl(window.location.href);
		if (oURL.query) {
			var oQuery = angular.parseObject(oURL.query);
			if (oQuery.url) $scope.redirect = decodeURIComponent(oQuery.url);
		}

		$scope.alimama = function() {
			var s = document.createElement('script'),
			h = document.getElementsByTagName('head')[0];
			if (! window.alimamatk_show) {
				s.onload = function() {
					console.log(234);
				}

				s.charset = 'utf-8';
				s.async = true;
				s.src = "http://a.alimama.cn/tkapi.js";
				h.insertBefore(s, h.firstChild);
			}
			
			window.alimamatk_onload = window.alimamatk_onload || [];
			window.alimamatk_onload.push({
				pid: 'mm_16076694_4176899_13692627',/*推广单元ID，用于区分不同的推广渠道*/
				appkey: '',/*通过TOP平台申请的appkey，设置后引导成交会关联appkey*/
				unid: 'barbery'/*自定义统计字段*/
			});
		};

		$scope.alimama();
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