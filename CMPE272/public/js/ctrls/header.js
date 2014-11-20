cmpe.controller('headerCtrl', function($scope, $http, $modal){
	$scope.launchAuth = function(){
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/login.html',
			controller: 'authCtrl',
			size: 'sm'/*,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}*/
		});

		modalInstance.result.then(function (selectedItem) {
			
		}, function () {
			
		});
	};
});

cmpe.controller('authCtrl', function($scope, $http, $modalInstance){
	
});