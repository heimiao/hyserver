//声明模块
var myApp = angular.module("myApp", ['ui.router', 'findAllServer', 'byParamServer', 'timeFilter', 'addServer', 'byParamServer_get', 'ngFileUpload','interception']);

//配置路由
myApp.config(function($stateProvider, $urlRouterProvider) {
	//设置默认的加载模块
	$urlRouterProvider.otherwise('/home');
	$stateProvider.state('home', {
		url: '/home',
		controller: "home",
		templateUrl: 'js/tpl/home.html'
	}).state('collection', {
		url: '/collection?collection',
		controller: "home",
		templateUrl: 'js/tpl/home.html'
	}).state('home_detail', {
		url: '/home_detail?articleId&isAnchor',
		controller: "home_detail",
		templateUrl: 'js/tpl/home_detail.html'
	}).state('store', {
		url: '/store',
		controller: "store",
		templateUrl: 'js/tpl/store_list.html'
	}).state('store_detail', {
		url: '/store_detail?productId',
		controller: "store_detail",
		templateUrl: 'js/tpl/store_detail.html'
	}).state('store_cart', {
		url: '/store_cart?productId',
		controller: "store_cart",
		templateUrl: 'js/tpl/store_cart.html'
	}).state('store_accountlist', {
		url: '/store_accountlist',
		controller: "store_accountlist",
		templateUrl: 'js/tpl/store_accountlist.html'
	}).state('store_account', {
		url: '/store_account?accountId',
		controller: "store_account",
		templateUrl: 'js/tpl/store_account.html'
	}).state('store_adslist', {
		url: '/store_adslist?orderId',
		controller: "store_adslist",
		templateUrl: 'js/tpl/store_adslist.html'
	}).state('store_editsite', {
		url: '/store_editsite?addressId&orderId',
		controller: "store_editsite",
		templateUrl: 'js/tpl/store_editsite.html'
	}).state('user', {
		url: '/user',
		controller: "user",
		templateUrl: 'js/tpl/user.html'
	}).state('user_set', {
		url: '/user_set',
		controller: "user_set",
		templateUrl: 'js/tpl/user_set.html'
	})
});