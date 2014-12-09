cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10,  mapTypeId: google.maps.MapTypeId.ROADMAP };
	
	$rootScope.markers = [];
	$rootScope.univmarkers=[];
	$rootScope.getApartmentsNear = function(lat, long, universityName){
		var diff = 0.03;
		$rootScope.markers = [];
		
		$rootScope.univmarkers=[];
		$rootScope.panTo(lat, long, 14, google.maps.MapTypeId.ROADMAP);
	    var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=apartments+near'
	    		+'+'+universityName+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo';
		$http.post('/api/forwardRequest', { url : url}).success(function(data){
			var pad = $rootScope.markers.length+1;
			
			$rootScope.pageToken = data.next_page_token;
			
			angular.forEach(data.results, function(v, i){
				var dist=distance(lat,long,v.geometry.location.lat,v.geometry.location.lng);
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
				
				var univ_icon="/assets/images/univicon.png";
				$rootScope.univmarkers.push({
					id: pad+i,
					latitude: lat,
					longitude: long,
					icon:univ_icon,
					animation: google.maps.Animation.DROP
				});
				
			});
			
				
			 
			$rootScope.apartments = data.results;
		});
	}; 
	

	$rootScope.setMarkers = function(apartments, lat, long){
		var pad = $rootScope.markers.length+1;
		
		$rootScope.markers = [];
		angular.forEach(apartments, function(v, i){
			var dist=distance(lat,long,v.geometry.location.lat,v.geometry.location.lng);
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
	};
	
	$rootScope.markersEvents = { mouseover: function (gMarker, eventName, model) {
        model.show = true;
        $scope.$apply();
    }
	};
	
	$rootScope.markers.onClick = function() {
        console.log("Clicked!");
        $rootScope.markers.show = !$rootScope.markers.show;
        $rootScope.$apply();
    };
	
	$rootScope.panTo = function(lat, lng, zoom, mapid){
		$rootScope.map.center.latitude = lat-0.005;
		$rootScope.map.center.longitude = lng;
		$rootScope.map.zoom = zoom;
		console.log("zoom");
	};
	
});

function distance(lat, long, lat2, lon2) {
	var radlat1 = Math.PI * lat/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * long/180
	var radlon2 = Math.PI * lon2/180
	var theta = long-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	//if (unit=="K") { dist = dist * 1.609344 }
	//if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

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
			$('.angular-google-map-container').height((newValue.h-50));
		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});