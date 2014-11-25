cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10 };
	
	$scope.marker = {
			id: 0,
			coords: {
				latitude: 37.336,
				longitude: -121.884
			},
			options: { draggable: true },
			events: {
				dragend: function (marker, eventName, args) {
					$log.log('marker dragend');
					var lat = marker.getPosition().lat();
					var lon = marker.getPosition().lng();
					$log.log(lat);
					$log.log(lon);

					$scope.marker.options = {
							draggable: true,
							labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
							labelAnchor: "100 0",
							labelClass: "marker-labels"
					};
				}
			}
	};
	
	$scope.markers = [];
	
	$rootScope.getApartmentsNear = function(lat, long){
		var diff = 0.01;
	    $scope.panTo(lat, long);
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
	
	$scope.panTo = function(lat, lng){
		$rootScope.map.center.latitude = lat;
		$rootScope.map.center.longitude = lng;
		$rootScope.map.zoom = 14;
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