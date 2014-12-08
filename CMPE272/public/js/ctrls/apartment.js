cmpe.controller('apartmentCtrl', function($scope, $stateParams, $http){
	var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+$stateParams.placeID+'&key=AIzaSyAUwMUP0T2KT_aZaJK5ukT6VZoX6rOpUgo'
	$http.post('/api/forwardRequest', { url : url}).success(function(data){
		$scope.apartment = data.result;
	});
});