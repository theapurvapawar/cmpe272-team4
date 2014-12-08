cmpe.controller('baseCtrl', function($scope, $rootScope, $http){
	$rootScope.map = { center: { latitude: 37.6, longitude: -122.2 }, zoom: 10,  mapTypeId: google.maps.MapTypeId.ROADMAP };
	
	$scope.markers = [];
	$scope.univmarkers=[];
	var infoWindow = new google.maps.InfoWindow();
	$rootScope.getApartmentsNear = function(lat, long){
		var diff = 0.03;
		$scope.markers = [];
		
		$scope.univmarkers=[];
	    $scope.panTo(lat, long, 14, google.maps.MapTypeId.ROADMAP);
	    var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?location='+lat+','+long+'&radius=5000&types=real_estate_agency&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo';
	    var localUrl = '/api/apartments/geoRange?lat1='+(lat-diff)+'&long1='+(long-diff)+'&lat2='+(lat+diff)+'&long2='+(long+diff);
		$http.get(localUrl/*'/api/forwardRequest', { url : url}*/).success(function(data){
			var pad = $scope.markers.length+1;
			
			
			angular.forEach(data, function(v, i){
				//marker.options = {animation:google.maps.Animation.BOUNCE};
				console.log(distance(lat,long,v.geometry.location.lat,v.geometry.location.lng));
				var dist=distance(lat,long,v.geometry.location.lat,v.geometry.location.lng);
				if(dist<1)
				var image='http://ruralshores.com/assets/marker-icon.png';
				if(dist>1 && dist<1.5)
				var image='http://www.portland5.com/sites/default/files/venue/marker_yellow.png';
				
				$scope.markers.push({
					id : pad+i,	
					latitude: v.geometry.location.lat,
			        longitude: v.geometry.location.lng,
			        title: name,
			        icon: image
				});
				
				var univ_icon="http://www.labtechsoftware.com/images/icon-university-64.png";
				$scope.univmarkers.push({
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
			
				
			 
			$scope.apartments = data;
		});
	}; 
	
	$scope.markersEvents = { mouseover: function (gMarker, eventName, model) {
        model.show = true;
        $scope.$apply();
    }
	};
	
	$scope.markers.onClick = function() {
        console.log("Clicked!");
        $scope.markers.show = !$scope.markers.show;
        $scope.$apply();
    };
	
	$scope.panTo = function(lat, lng, zoom, mapid){
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