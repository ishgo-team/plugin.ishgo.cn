

angular.module('Global', []);


angular.module('Global').
constant('LANUAGE', ['zh-CN', 'zh-TW']).
constant('YIQIFA', {
	UID: 'ishgo'
}).
constant('ALIMAMA', {
	PID: 'mm_16076694_4176899_13692627',		/* 推广单元ID，用于区分不同的推广渠道 */
	APPKEY: '',									/* 通过TOP平台申请的appkey，设置后引导成交会关联appkey */
	UNID: 'ishgo'								/* 自定义统计字段 */
}).
constant('FILE_PATH', {
	REBATE_LIST: '/assets/storage/rebates.json'
});


angular.module('Global').
factory('ReabateService', [
	'$http', '$location',
	'YIQIFA', 'FILE_PATH',
	function($http, $location, YIQIFA, FILE_PATH) {
		function getRebateList(fnCallback) {
			$http.get($location.$$protocol + '://' + $location.$$host + FILE_PATH.REBATE_LIST).
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


angular.module('Global').
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