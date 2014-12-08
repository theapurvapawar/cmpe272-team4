cmpe.controller('searchCtrl', function($scope, $stateParams){
	$scope.getApartmentsNear($stateParams.lat, $stateParams.lng, $stateParams.universityName);
	$scope.label = $stateParams.universityName;
});