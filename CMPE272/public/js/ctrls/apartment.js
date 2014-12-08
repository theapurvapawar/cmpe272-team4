cmpe.controller('apartmentCtrl', function($scope, $stateParams, $http, $modal){

	var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+$stateParams.placeID+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo'

	$http.post('/api/forwardRequest', { url : url}).success(function(data){
		$scope.apartment = data.result;
		$scope.getListing();
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

	$scope.getListing = function(){
		$http.get('/api/listings/'+$scope.apartment.place_id).success(function(data){
			$scope.listings = data;
		});
	};
	
	$scope.deleteListing = function(listing){
		$http({
            method: "delete",
            url: "api/listings/"+listing._id
        }).success(function(data){
        	$scope.getListing();
        });
	};
	
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
			console.log(data);
		});
	};
	
});