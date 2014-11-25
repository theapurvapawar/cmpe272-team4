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

	$scope.getLocation = function(val) {
		return $http.get('/api/universities?q='+val).then(function(response){
			var unis = [];
			angular.forEach(response.data, function(v, i){
				unis.push(v.name);
			});
			return unis;
		});
	};

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