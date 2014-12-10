cmpe.controller('apartmentCtrl', function($scope, $stateParams, $http, $modal,$rootScope, $filter){

	$scope.bedroomOpts = [1, 2, 3, 4, 5];
	$scope.bathroomOpts = [1, 2, 3, 4, 5];
	
	var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+$stateParams.placeID+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo'

	$http.post('/api/forwardRequest', { url : url}).success(function(data){
		$scope.apartment = data.result;
		$scope.getListing();
		$scope.setMarkers([data.result], $stateParams.uniLat, $stateParams.uniLong);
		
		$scope.panTo(data.result.geometry.location.lat, data.result.geometry.location.lng, 15);
		
		var addressurl = 'http://api.walkscore.com/score?format=json&address='
				+encodeURIComponent(data.result.formatted_address)
				+'&lat='+$stateParams.uniLat
				+'&lon='+$stateParams.uniLong
				+'&wsapikey=9a9b91a7d801a2285cfe0bc5394459ed';
		
		$http.post('/api/forwardRequest', { url : addressurl}).success(function(data){
			$scope.apartmentadd = data;
		});
		

		var lat1 = $scope.apartment.geometry.location.lat - 0.002;
		var lng1 = $scope.apartment.geometry.location.lng - 0.002;
		var lat2 = $scope.apartment.geometry.location.lat + 0.002;
		var lng2 = $scope.apartment.geometry.location.lng + 0.002;
		
		var transitUrl = '/api/stops/geoRange?long1='+lng1+'&long2='+lng2+'&lat1='+lat1+'&lat2='+lat2;
		$http.get(transitUrl).success(function(data){
			$rootScope.transitmarker=[];
			var pad=$rootScope.markers.length+1;
			var transimage='http://inclusivemobility.net/assets/leaflet-maps-marker-icons/busstop.png'
			angular.forEach(data, function(v, i){
				//console.log(v);
			
				
			$rootScope.transitmarker.push({
				id : pad+i,	
				latitude: v.LAT,
		        longitude: v.LONG_,
		        title: name,
		        icon: transimage
			});
			});
		});
	});

	$scope.postListing = function(){
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/postlisting.html',
			controller: 'postListingCtrl',
			//size: 'sm',
			resolve: {
				apartment: function () {
					return $scope.apartment;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.getListing();
			$scope.state = 'listings';
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.getListing = function(){
		$http.get('/api/listings/'+$scope.apartment.place_id).success(function(data){
			$scope.listings = [];
			$scope.stickyListings = [];
			angular.forEach(data, function(v, i){
				if(v.stickyUntil > new Date().getTime()){
					$scope.stickyListings.push(v);
					console.log('sticky');
				}
				else{
					$scope.listings.push(v);
					console.log('not sticky');
				}
			});
			$scope.allListings = data;
		});
	};

	$scope.deleteListing = function(listing){
		$http({
			method: "post",
			url: "api/listings/delete/"+listing._id
		}).success(function(data){
			$scope.getListing();
		});
	};

	$scope.state = 'info';

});

cmpe.controller('postListingCtrl', function($scope, $http, $modalInstance, apartment){

	$scope.bedroomOpts = [{number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 5}];
	$scope.bathroomOpts = [{number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 5}];
	
	$scope.stickyOpts = [{number: 1}, {number: 3}, {number: 7}];

	$scope.newApt = {

	};
	
	$scope.stickyDays = {
			number : null
	};
	
	$scope.makeSticky = function(){
		$scope.stickySelected = $scope.stickyDays;
		console.log($scope.stickyDays);
	};
	
	var ms = 24 * 60 * 60 * 1000;

	$scope.post = function(){
		$http.post('/api/listings', {
			placeId : apartment.place_id,
			noOfBedrooms : $scope.newApt.bedroom.number,
			noOfBathrooms : $scope.newApt.bathroom.number,
			rent : $scope.newApt.rent,
			amenities : $scope.newApt.amenities,
			desc : $scope.newApt.desc,
			contact : $scope.newApt.contact,
			stickyUntil : $scope.stickySelected ? new Date().getTime() + $scope.stickySelected.number.number * ms : new Date().getTime()
		}).success(function(data){
			$modalInstance.close();
		});
	};

});