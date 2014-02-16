

angular.module('RebateApp', []);


angular.module('RebateApp').
constant('YIQIFA', {
	UID: 'ishgo'
}).
constant('ALIMAMA', {
	PID: 'mm_16076694_4176899_13692627',		/* 推广单元ID，用于区分不同的推广渠道 */
	APPKEY: '',									/* 通过TOP平台申请的appkey，设置后引导成交会关联appkey */
	UNID: 'ishgo'								/* 自定义统计字段 */
});


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
factory('ReabateService', [
	'$http', '$location',
	'YIQIFA',
	function($http, $location, YIQIFA) {
		function getRebateList(fnCallback) {
			$http.get($location.$$protocol + '://' + $location.$$host + '/assets/storage/rebates.json').
			success(function(oRes) {
				angular.isFunction(fnCallback) && fnCallback(oRes);
			});
		}

		return {
			rebate: function(sURL, oUser, fnCallback) {
				if (! angular.isFunction(fnCallback)) return;

				var httpRegexp = /^(https|http):\/\/.+/,
				oURL, aoUrl, sRURL;

				if (httpRegexp.test(sURL)) {
					oURL = angular.parseUrl(sURL);

					getRebateList(function(oList) {
						aoUrl = oList[oURL.rootDomain];
						if (! angular.isArray(aoUrl)) {
							fnCallback({ rebate: false });
							return;
						}

						for (var i = 0; (row = aoUrl[i]) && i < aoUrl.length; i ++) {
							if (oURL.domain !== row.match) continue;

							var oRebateURL = angular.parseUrl(row.prefix)
							oQuery = angular.parseObject(oRebateURL.query),
							sPrefix = row.prefix;

							if ('string' === typeof oUser.uid && oUser.uid !== '') oQuery.e = oUser.uid || YIQIFA.UID;

							sPrefix = sPrefix.replace(oRebateURL.query, angular.parseString(oQuery));
							if (httpRegexp.test(row.redirect)) sRURL = sPrefix + row.redirect;
							else sRURL = sPrefix + sURL;

							fnCallback({ rebate: true, url: sRURL, prefix: sPrefix, actionId: row.actionId, from: row });
							break;
						}
					});
				}
				else fnCallback({ rebate: false });
			}
		};
	}
]);


angular.module('RebateApp').
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

		$scope.alimama = function(fnCallback) {
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

		var oURL = angular.parseUrl(window.location.href);
		if (oURL.query) {
			var oQuery = angular.parseObject(oURL.query);
			$scope.user.uid = oQuery.u;
			$scope.rebate.mode = oQuery.m;

			if (oQuery.q) {
				if (/(tmall|taobao)/.test(oQuery.q)) {
					$scope.rebate.redirect = oQuery.q;
					$scope.alimama(function() {
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
			}
		}
	}
]);