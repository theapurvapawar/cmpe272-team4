cmpe.controller('headerCtrl', function($scope, $http, $modal){
	$scope.launchAuth = function(){
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/login.html',
			controller: 'authCtrl',
			size: 'sm'
		});

		modalInstance.result.then(function (user) {
			$scope.user = user;
		}, function () {
			
		});
	};
	
	$scope.universities = ['San Jose State University', 'Santa Clara University', 'Stanford University'];
});

cmpe.controller('authCtrl', function($scope, $http, $modalInstance){
	
	$scope.user = {
			username : '',
			password : ''
	};
	
	$scope.login = function(){
		$modalInstance.close($scope.user);
	};
	
});