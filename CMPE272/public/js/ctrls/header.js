cmpe.controller('headerCtrl', function($scope, $http, $modal, $state){
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
			return response.data;
		});
	};

	$scope.onSelect = function(item, model, label){
		//$scope.getApartmentsNear(item.geometry.location.lat, item.geometry.location.lng);
		$state.transitionTo('root.base.search', {lat: item.geometry.location.lat, lng : item.geometry.location.lng, universityName : label});
	};
	
	$http.get('/authApi/getUser').success(function(data){
		if(data._id){
			console.log(data);
			$scope.user = data;
		}
	});
	
	$scope.logout = function(){
		$http.get('/authApi/logout').success(function(data){
			$scope.user = null;
		});
	};

});

cmpe.controller('authCtrl', function($scope, $http, $modalInstance, $window){

	$scope.user = {
			username : '',
			password : ''
	};

	$scope.login = function(){
		/*FB.login(function(response) {
			if (response.status === 'connected') {
				var accessToken = response.authResponse.accessToken;
				FB.api('/me', function(resp) {
					var email = resp.email;
					console.log(resp);
					$http.post('/api/user/auth', {
						email: email,
						accessToken: accessToken,
						fName: resp.first_name,
						lName: resp.last_name,
						fb_picture: 'https://graph.facebook.com/'+resp.id+'/picture?width=640&height=640'
					}).success(function(data){
						$modalInstance.close(data);
					});
				});
			} else if (response.status === 'not_authorized') {
				alert('You will need to authorize us to use your Facebook account')
			} else {
				alert('You are not logged into Facebook');
			}
		}, {scope: 'public_profile,email'});*/
		/*$http.get('/authApi/auth/facebook').success(function(data){
			console.log(data);
		});*/
		$window.location.href = '/authApi/auth/facebook';
	};

});