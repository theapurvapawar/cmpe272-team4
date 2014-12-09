cmpe.controller('apartmentCtrl', function($scope, $stateParams, $http, $modal){

	var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+$stateParams.placeID+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo'

	$http.post('/api/forwardRequest', { url : url}).success(function(data){
		$scope.apartment = data.result;
		$scope.getListing();
		$scope.getWalkScore(data.result.formatted_address);
		
		var addressurl = 'http://api.walkscore.com/score?format=json&address=Sunset%20District%20San%20Francisco%20CA&lat=37.75&lon=-122.49&wsapikey=9a9b91a7d801a2285cfe0bc5394459ed'
	
			$http.post('/api/forwardRequest', { url : addressurl}).success(function(data){
				$scope.apartmentadd = data;
				console.log(data);
				
			});
	});
	
	
	


	
	$scope.getWalkScore = function(address){
		var ws_wsid = 'f7837f8b91f64744a26ad5be3dcf697b';
		var ws_address = address;
		//document.getElementById("demo").innerHTML = ws_address;//'1060 Lombard Street, San Francisco, CA';
		var ws_width = '600';
		var ws_height = '444';
		var ws_layout = 'horizontal';
		var ws_commute = 'true';
		var ws_transit_score = 'true';
		var ws_map_modules = 'all';
		
		$.getScript('http://www.walkscore.com/tile/show-walkscore-tile.php',function(){
			
			console.log("Script loaded");
		});
	}

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