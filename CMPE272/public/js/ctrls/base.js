cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10,  mapTypeId: google.maps.MapTypeId.ROADMAP };
	
	$rootScope.markers = [];
	$rootScope.univmarkers=[];
	var infoWindow = new google.maps.InfoWindow();
	$rootScope.getApartmentsNear = function(lat, long, universityName){
		console.log(universityName)
		var diff = 0.03;
		$rootScope.markers = [];
		
		$rootScope.univmarkers=[];
		$rootScope.panTo(lat, long, 14, google.maps.MapTypeId.ROADMAP);
	    var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=apartments+near'
	    		+'+'+universityName+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo';
		$http.post('/api/forwardRequest', { url : url}).success(function(data){
			var pad = $rootScope.markers.length+1;
			
			
			angular.forEach(data.results, function(v, i){
				//marker.options = {animation:google.maps.Animation.BOUNCE};
				console.log(distance(lat,long,v.geometry.location.lat,v.geometry.location.lng));
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
			
				
			 
			$rootScope.apartments = data.results;
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
		$rootScope.map.center.latitude = lat;
		$rootScope.map.center.longitude = lng;
		$rootScope.map.zoom = zoom;
		//$rootScope.position.show();
		//$rootScope.map.mapTypeId=mapid;
		console.log("zoom");
	};
	
	
	
	/* $rootScope.google.maps.event.addListener(markers, 'click', function () {
		 	console.log("marker");
      // close window if not undefined
      if (infoWindow !== void 0) {
          infoWindow.close();
      }
      // create new window
      var infoWindowOptions = {
          content: name
      };
      infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      infoWindow.open(map, markers);
  });*/
	
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