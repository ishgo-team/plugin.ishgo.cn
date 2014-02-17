

angular.module('RebateApp', ['Global']);


angular.module('RebateApp').
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


angular.module('RebateApp').
controller('MainController', [
	'$scope', '$http', '$location',
	'ALIMAMA', 'YIQIFA',
	'ReabateService',
	function($scope, $http, $location, ALIMAMA, YIQIFA, ReabateService) {
		var self = this;

		$scope.rebate = { mode: 'auto', allow: undefined, redirect: undefined, from: '' };
		$scope.user = { uid: YIQIFA.UID };

		this.redirect = function(type) {
			if (type === 'home') window.location.href = $location.$$protocol + '://' + $location.$$host;
			else if (type === 'back' && $scope.rebate.from) window.location.href = $scope.rebate.from;
			else if ($scope.rebate.mode === 'auto') {
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
			if (!oURL.query) return self.redirect('home');

			var oQuery = angular.parseObject(oURL.query);
			if ('undefined' === typeof oQuery.q) return self.redirect('home');

			if (oQuery.u) $scope.user.uid = oQuery.u;
			if (oQuery.m) $scope.rebate.mode = oQuery.m;
			if (oQuery.q) $scope.rebate.from = oQuery.q;

			if (/(tmall|taobao)/.test(oQuery.q)) {
				$scope.rebate.allow = true;
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
					else {
						$scope.rebate.allow = false;
						setTimeout(function() {
							self.redirect('back');
						}, 3000)
					}
				});
			}
		};

		$scope.repay(window.location.href);
	}
]);