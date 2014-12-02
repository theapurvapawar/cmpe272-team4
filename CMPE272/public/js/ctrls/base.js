cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10 };
	
	$scope.markers = [];
	
	$rootScope.getApartmentsNear = function(lat, long){
		var diff = 0.01;
	    $scope.panTo(lat, long, 14);
		$http.get('/api/apartments/geoRange?lat1='+(lat-diff)+'&long1='+(long-diff)+'&lat2='+(lat+diff)+'&long2='+(long+diff)).success(function(data){
			var pad = $scope.markers.length+1;
			$scope.markers = [];
			angular.forEach(data, function(v, i){
				$scope.markers.push({
					id : pad+i,
					latitude: v.geometry.location.lat,
			        longitude: v.geometry.location.lng,
			        title: name
				});
			});
			$scope.apartments = data;
		});
	};  
	
	$scope.panTo = function(lat, lng, zoom){
		$rootScope.map.center.latitude = lat;
		$rootScope.map.center.longitude = lng;
		$rootScope.map.zoom = zoom;
	};
	
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
			$('.angular-google-map-container').height((newValue.h-50)/2);
		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});