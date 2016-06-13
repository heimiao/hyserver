//查询所有
angular.module("findAllServer", []).factory("findAll",
	function($http) {
		return {
			findAll: function(url) {
				return $http.post(url, {}, {});
			}
		};
	});
//根据条件查询
angular.module("byParamServer", []).factory("findByParam",
	function($http) {
		return {
			findByParam: function(url, data) {
				return $http.post(url, data, {});
			}
		};
	});
//根据条件查询
angular.module("byParamServer_get", []).factory("findByParam_get",
	function($http) {
		return {
			findByParam: function(url, data) { 
				 return $http.get(url, data);
				//return $http({method: 'GET', url:url,data:1})
			}
		};
	});
//删除
angular.module("removeServer", []).factory("removeById",
	function($http) {
		return {
			removeById: function(url, data) {
				return $http.post(url, data, {});
			}
		};
	});
//新增
angular.module("addServer", []).factory("saveData",
	function($http) {
		return {
			saveData: function(url, data) {
				return $http.post(url, data, {});
			}
		};
	});
//更新表单
angular.module("updateServer", []).factory("updateData",
	function($http) {
		return {
			updateData: function(url, data) {
				return $http.post(url, data, {});
			}
		};
	});
	
//过滤器指令
angular.module("timeFilter", []).filter('formatTime', function() {
	return function(format) {
		return new Date(format).format('yyyy-MM-dd');
	};
});
angular.module("interception", []).filter('interception', function() {
	return function(data) {
		return data.substr(0,25,"...");
	};
});