var app = angular.module('user',['userService']);

app.controller('userController', ['$scope', '$http', '$window', '$state', '$timeout', 'user', function($scope, $http, $window, $state, $timeout, user) {
	
	/** Initial load **/
	$scope.user = user;
	$scope.changePassword = {};
	$scope.warning = false;
	$scope.error = false;
	$scope.errorPass = 0;
	$scope.warningPass = false;	

	if(!$scope.user.name)
	{		
		$scope.user.initialLoad();
	}	

	/** Initial load **/

	$scope.logout = function() {
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.beaconSelected;
		$window.location.href = '/';
	};

	$scope.logUserInfo = function() {
		console.log("Log Beacon Info: " + JSON.stringify($scope.user.info));
	};

	$scope.userProfile = function(){
		$state.go('userProfile');
	};

	$scope.done = function(){
		console.log("Llega a Done");
		$scope.user.saveChanges(function(error, updated){
			if(error)
			{
				$scope.error = true;	
			}
			else
			{
				if(updated)
				{
					$scope.warning = true;
					$timeout(function(){
						$scope.warning = false;	
						$state.go('home');
					}, 3000);
					
				}
				else $state.go('home');
				
			}				
		});
		
	};

	$scope.changePassword = function() {
		console.log("entra: ");
		if($scope.changePassword.newPassword != $scope.changePassword.repeatNewPassword)
		{	
			$scope.errorPass = 1;
		}
		else if($scope.changePassword.newPassword < 8)
		{
			$scope.errorPass = 2;
		}
		else
		{
			if($scope.changePassword.newPassword != $scope.user.backup.password)
			{
				$scope.user.savePassword($scope.changePassword.newPassword, function(error, updated){
					if(error)
					{
						$scope.errorPass = 3;	
					}
					else
					{
						if(updated)
						{
							$scope.warningPass = true;
							$timeout(function(){
								$scope.warningPass = false;	
								$scope.errorPass = 0;	
								$('#changePassword').modal('toggle');		    
							}, 3000);							
						}
						else 
						{
							$scope.errorPass = 3;
						}
					}				
				});
			}
			else
			{
				$scope.errorPass = 0;	
				$('#changePassword').modal('toggle');
			}
		}
	}

}]);

var compareTo = function() {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.compareTo;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
          	//console.log('ERROR Values: ' + elem.val() + " - " + $(firstPassword).val());
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('compareTo', v);
          });
        });
      }
    }
};

app.directive("compareTo", compareTo);

