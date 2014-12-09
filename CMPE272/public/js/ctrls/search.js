cmpe.controller('searchCtrl', function($scope, $stateParams, $rootScope, $http){
	$scope.getApartmentsNear($stateParams.lat, $stateParams.lng, $stateParams.universityName);
	$scope.label = $stateParams.universityName;

	$scope.uniLat = $stateParams.lat; $scope.uniLong = $stateParams.lng;

	$scope.loadMore = function(){
		var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=apartments+near'
			+'+'+$stateParams.universityName+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo&pagetoken='
			+$scope.pageToken;
		$http.post('/api/forwardRequest', { url : url}).success(function(data){
			var pad = $rootScope.markers.length+1;

			$scope.pageToken = data.next_page_token;

			angular.forEach(data.results, function(v, i){
				var dist=distance($scope.uniLat,$scope.uniLong,v.geometry.location.lat,v.geometry.location.lng);
				if(dist<1)
					var image='/assets/images/green.png';
				if(dist>1 && dist<1.5)
					var image='/assets/images/orange.png';
				if(dist>1.5)
					var image='/assets/images/red.png'

						$rootScope.markers.push({
							id : pad+i,	
							latitude: v.geometry.location.lat,
							longitude: v.geometry.location.lng,
							title: name,
							icon: image
						});

			});
			angular.forEach(data.results, function(v, i){
				$rootScope.apartments.push(v);
			});
		});
	};

});