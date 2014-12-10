cmpe.controller('apartmentCtrl', function($scope, $stateParams, $http, $modal, $filter){


	//$scope.bedroomOpts = [{number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 5}];
	//$scope.bathroomOpts = [{number: "1"}, {number: "2"}, {number: "3"}, {number: "4"}, {number: "5"}];
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
		}, function () {
			//$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	/*
	cmpe.filter('filterCheck', function () {
		console.log("Inside filterCheck");
		  return function (items, bedrooms, bathrooms) {
		    var filtered = [];
		    if(bedrooms==="" || isNaN(bedrooms)){
		    	bedrooms=0;
		    }
		    if(bathrooms==="" || isNaN(bathrooms)){
		    	bathrooms=0;
		    }

		    for (var i = 0; i < items.length; i++) {
		      var item = items[i];
		      if (item.noOfBedrooms>bedrooms && item.noOfBathrooms>bathrooms) {
		        filtered.push(item);
		      }
		    }
		    return filtered;
		  };
		});
	*/
	$scope.getListing = function(){
		$http.get('/api/listings/'+$scope.apartment.place_id).success(function(data){
			$scope.listings = data;
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

	$scope.newApt = {

	};

	$scope.post = function(){
		$http.post('/api/listings', {
			placeId : apartment.place_id,
			noOfBedrooms : $scope.newApt.bedroom.number,
			noOfBathrooms : $scope.newApt.bathroom.number,
			rent : $scope.newApt.rent,
			amenities : $scope.newApt.amenities,
			desc : $scope.newApt.desc,
			contact : $scope.newApt.contact
		}).success(function(data){

			$modalInstance.close();
		});
	};

});