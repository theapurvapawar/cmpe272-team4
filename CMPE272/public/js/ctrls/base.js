cmpe.controller('baseCtrl', function($scope, $rootScope){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10 };
	$scope.apartments = [
	                     {
	                    	 name: "101 San Fernando",
	                    	 address: "101 E San Fernando St, San Jose, CA"
	                     },
	                     {
	                    	 name: "33rd South Third",
	                    	 address: "33 South 3rd Street, San Jose, CA"
	                     }
	                     ];
});

cmpe.directive('scaleHeight', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		scope.getWindowDimensions = function () {
			return {
				'h': $window.innerHeight,
				'w': $window.innerWidth
			};
		};
		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
			//$(element).height(newValue.h-50);
			$('.angular-google-map-container').height(newValue.h-50);
		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});