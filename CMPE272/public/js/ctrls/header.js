cmpe.controller('headerCtrl', function($scope, $http, $modal, $state, $rootScope){
	$scope.launchAuth = function(){
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/login.html',
			controller: 'authCtrl',
			size: 'sm'
		});

		modalInstance.result.then(function (user) {
			$rootScope.user = user;
			$scope.user = user;
		}, function () {

		});
	};
	
	$scope.launchReg = function(){
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/register.html',
			controller: 'regCtrl',
			size: 'sm'
		});

		modalInstance.result.then(function (user) {
			$rootScope.user = user;
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
			return response.data;
		});
	};

	$scope.onSelect = function(item, model, label){
		//$scope.getApartmentsNear(item.geometry.location.lat, item.geometry.location.lng);
		$state.transitionTo('root.base.search', {lat: item.geometry.location.lat, lng : item.geometry.location.lng, universityName : label});
	};
	
	
	
	$scope.syncUser = function(){
		$http.get('/authApi/getUser').success(function(data){
			if(data._id){
				$rootScope.user = data;
				$scope.user = data;
			}
		});
	};
	
	$scope.syncUser();
	
	$scope.logout = function(){
		$http.get('/authApi/logout').success(function(data){
			$rootScope.user = null;
			$scope.user = null;
		});
	};

});

cmpe.controller('authCtrl', function($scope, $http, $modalInstance, $window){

	$scope.user = {
			username : '',
			password : ''
	};
	
	$scope.logging = false;
	$scope.doLogin = function(){
		$http.post('/authApi/auth/local', {email: $scope.user.username, password : $scope.user.password}).success(function(data){
			$modalInstance.close(data.user);
		});
	};

	$scope.login = function(){
		$window.location.href = '/authApi/auth/facebook';
	};

});

cmpe.controller('regCtrl', function($scope, $http, $modalInstance, $window){

	$scope.user = {
			username : '',
			password : ''
	};
	
	$scope.logging = false;
	$scope.doLogin = function(){
		$http.post('/authApi/signup', {email: $scope.user.username, 
				password : $scope.user.password,
				name : $scope.user.name
			}
		).success(function(data){
			if(data.error)
				alert(data.error);
			else
				$modalInstance.close(data);
		});
	};

	$scope.login = function(){
		$window.location.href = '/authApi/auth/facebook';
	};

});