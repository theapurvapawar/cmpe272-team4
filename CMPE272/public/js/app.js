var cmpe = angular.module('cmpe', ['ui.router', 'uiGmapgoogle-maps', 'ui.bootstrap']);

cmpe.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('root',{
			url: '',
			abstract: true,
			views: {
				'header': {
					templateUrl: 'views/header.html',
					controller: 'headerCtrl'
				}
			}
		})
		.state('root.base', {
			url: '/',
			views: {
				'container@': {
					templateUrl: 'views/base.html',
					controller: 'baseCtrl'
				}
			}
		})
		.state('root.base.search', {
			url: '/search/:lat/:lng',
			templateUrl : 'views/search.html',
			controller : 'searchCtrl'
		});
	
});