cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10 };
	
	$scope.markers = [];
	
	$rootScope.getApartmentsNear = function(lat, long){
		var diff = 0.03;
	    $scope.panTo(lat, long, 14);
	    var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location='+lat+','+long+'&radius=5000&types=real_estate_agency&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo';
	    var localUrl = '/api/apartments/geoRange?lat1='+(lat-diff)+'&long1='+(long-diff)+'&lat2='+(lat+diff)+'&long2='+(long+diff);
		$http.get(localUrl/*'/api/forwardRequest', { url : url}*/).success(function(data){
			var pad = $scope.markers.length+1;
			
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
			$('.angular-google-map-container').height((newValue.h-50));
		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});