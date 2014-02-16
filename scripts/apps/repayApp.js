

angular.module('RepayApp', ['Global']);


angular.module('RepayApp').
directive('repayLink', [
	function() {
		return {
			link: function($scope, $element, $attrs) {
				$scope.redirect = function() {
					$element[0].click();
				};
			}
		}
	}
]);


angular.module('RepayApp').
controller('MainController', [
	'$scope', '$http',
	'ALIMAMA',
	'ReabateService',
	function($scope, $http, ALIMAMA, ReabateService) {
		var self = this;

		$scope.rebate = { mode: undefined, allow: undefined, redirect: undefined };
		$scope.user = {};

		this.redirect = function() {
			if ($scope.rebate.mode === 'auto') {
				angular.isFunction($scope.redirect) && $scope.redirect();
			}
		};

		this.alimama = function(fnCallback) {
			var s = document.createElement('script'),
			h = document.getElementsByTagName('head')[0];
			if (! window.alimamatk_show) {
				angular.isFunction(fnCallback) && angular.element(s).on('load', fnCallback);

				s.charset = 'gbk';
				s.async = true;
				s.src = "http://a.alimama.cn/tkapi.js";
				h.insertBefore(s, h.firstChild);
			}
			
			window.alimamatk_onload = window.alimamatk_onload || [];
			window.alimamatk_onload.push({
				pid: ALIMAMA.PID,
				appkey: ALIMAMA.APPKEY,
				unid: $scope.user.uid || ALIMAMA.UNID
			});
		};

		$scope.repay = function(url) {
			var oURL = angular.parseUrl(url);
			if (! oURL.query) return;

			var oQuery = angular.parseObject(oURL.query);
			$scope.user.uid = oQuery.u;
			$scope.rebate.mode = oQuery.m;

			if (! oQuery.q) return;

			if (/(tmall|taobao)/.test(oQuery.q)) {
				$scope.rebate.redirect = oQuery.q;
				self.alimama(function() {
					setTimeout(self.redirect, 300);
				});
			}
			else {
				ReabateService.rebate(oQuery.q, $scope.user, function(oRes) {
					if (oRes.rebate === true) {
						$scope.rebate.allow = true;
						$scope.rebate.redirect = oRes.url || oRes.from.redirect;
						setTimeout(self.redirect, 300);
					}
					else $scope.rebate.allow = false;
				});
			}
		};

		$scope.repay(window.location.href);
	}
]);