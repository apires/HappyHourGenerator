var app = angular.module('hh', []);

app.service('TasteMade', ['$http', function($http){
	var baseURL = './api/v1';
	return {
		auth: function(user, pass){
			return $http.post(baseURL+'/auth', {user: user, pass: pass});
		},
		getHH : function(lat, long){
			return $http.get(baseURL+'/hh', {
				params: {
					lat: lat,
					long: long
				}
			});
		},
		confirmPresence: function(uid, hhid){
			return $http.put(baseURL+'/hh/'+hhid+'/confirmation/'+uid, {})
		},
		cancelPresence: function(uid, hhid){
			return $http.delete(baseURL+'/hh/'+hhid+'/confirmation/'+uid, {})
		}

	}

}]);
app.service('user', ['TasteMade', '$q', '$http', function(TM, $q, $http){
	return{
		getOrCreate: function(user, pass){
			var rsp = $q.defer();

			TM.auth(user, pass).success(function(body){
				var id = body.id;

				$http.put('./api/v1/user/'+id, {})
					.success(function(data){
						rsp.resolve(data);
					})
					.error(function(err){
						$q.reject(err);
					});

			}).error(function(err){
				$q.reject(err);
			});

			return rsp.promise;
		}
	}
}]);
app.service('geo', ['$q', function($q){
	var position = null;

	return {
		whereAmI : function(){

			var rsp = $q.defer();

			if(position){ rsp.resolve(position); return }

			navigator.geolocation.getCurrentPosition(function(p){
				position = {
					lat: p.coords.latitude,
					long: p.coords.longitude
				};

				rsp.resolve(position);

				setTimeout(function(){ position = null}, 5000);

			}, function(){
				rsp.reject({err: 'error-getting-geo', info: arguments});
			});

			return rsp.promise;

		}
	}
}]);

app.controller('ctrl', ['user', '$scope', 'geo', 'TasteMade', function(user, $scope, geo, TM){
	$scope.step = 0;
	$scope.confirmationStatus = 0;

	$scope.user = "Your TasteMade ID!";
	$scope.password = "PASSWORD";

	$scope.geoData = null;

	$scope.login = function(){
		user.getOrCreate($scope.user, $scope.password).then(function(data){
			$scope.step = 1;
			$scope.authResponse = data[0];
		});
	};

	$scope.confirmPresence = function(){
		TM.confirmPresence($scope.authResponse.id, $scope.hh.id).then(function(){
			if($scope.confirmationStatus != 1){
				$scope.confirmationStatus = 1;
				$scope.hh.confirmed++;
			}
		})
	};

	$scope.cancelPresence = function(){
		TM.cancelPresence($scope.authResponse.id, $scope.hh.id).then(function(){
			if($scope.confirmationStatus != -1){
				$scope.confirmationStatus = -1;
				$scope.hh.confirmed--;
			}
		})
	};

	$scope.$watch('step', function(step){
		if(step == 1){

			geo.whereAmI().then(function(data){
				$scope.geoData = data;

				TM.getHH(data.lat, data.long).success(function(hh){
					$scope.hh = hh
				});

			});

		}

	});

	$scope.geoData = function(){
	}
}]);