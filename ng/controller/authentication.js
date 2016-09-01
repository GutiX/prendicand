var app = angular.module('auth',['tokenInterceptor']);

app.controller('authController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {

	var vm = this;

	$scope.registerDisplay = false;
	$scope.response = {};
	$scope.userData = {};
	$scope.restore = {};
	$scope.sessionError = false;
	$scope.error = false;
	$scope.error_register_email = false;
	$scope.emailSent = false;
	$scope.errorEmailNoExist = false;
	$scope.errorEmailSent = false;
	$scope.passRestored = false;
	$scope.errorTokenNoExist = false;
	$scope.errorSystem = false;

	//console.log("ramdom: " + Math.floor(Math.random() * (10000 - 100) + 100));
	
	if($location.path() === "/recoverPass")
	{
		var recoverToken = {"token": $location.search().token};

		$http.post('/usercontrol/checkRestoreId', recoverToken).success( function(response) {
	  		console.log("login response: " + JSON.stringify(response));
	  		if(!response.valid)
	  		{
	  			if(response.error === 'no_exist_restoreId') $scope.errorTokenNoExist = true;
	  		}
	       
		});
		
	}

	if($window.sessionStorage.error && $window.sessionStorage.error == 'session')
	{
		$scope.sessionError = true;
		delete $window.sessionStorage.error;
	}

	$scope.login = function(email, password){
	  	//console.log("$scope.login: " + email + " - " + password)
	  	var credentials = {"email": email, "password": password};
	  	vm.lform.$setSubmitted();	  	
	  	$http.post('/usercontrol/login', credentials).success( function(response) {
	  		console.log("login response: " + JSON.stringify(response));
		  	$scope.response = response;
	  		if(response.valid)
	  		{
	  			$window.sessionStorage.token = response.token;
	  			$window.location.href = 'home';
	  		}
	  		else
	  		{
	  			$scope.error = true;
	  			delete $window.sessionStorage.token;
	  		}
	       
		});
  	}

  	$scope.register = function(register){
  		console.log("name: " + register.email);
  		vm.rform.$setSubmitted();
  		$scope.userData = {
  			"name": register.username,
  			"password": register.password,
  			"cpassword": register.cpassword,
  			"email": register.email
  		};
	  	$http.post('/usercontrol/register', $scope.userData)
		  	.success( function(response) {
		  		//console.log("register response: " + JSON.stringify(response));
		  		$scope.response = response;
		  		if(response.valid)
		  		{
		  			//console.log("is valid!!");
		  			$window.sessionStorage.token = response.token;
		  			$window.location.href = 'home';
		  		}
		  		else
		  		{
		  			delete $window.sessionStorage.token;
		  			if(response.error === 'exist_email') $scope.error_register_email = true;
		  		}	       
			})
	        .error(function(error) {
	            console.log(error);
	        });
  	}

  	$scope.showRegister = function(){
  		console.log("hecho");
  		$scope.error = false;
  		vm.lform.$setPristine();
  		vm.lform.$setUntouched();
  		vm.rform.$setPristine();
  		vm.rform.$setUntouched();
  		$scope.registerDisplay = !$scope.registerDisplay;
  	}

  	$scope.sendEmail = function(){
  		console.log("name: " + $scope.restore.email);
  		var emailRestore = {
  			"email": $scope.restore.email
  		};
	  	$http.post('/usercontrol/sendEmailRestorePass', emailRestore)
		  	.success( function(response) {
		  		//console.log("register response: " + JSON.stringify(response));
		  		$scope.response = response;
		  		if(response.valid)
		  		{
		  			$scope.emailSent = true;
		  			$scope.errorEmailNoExist = false;
		  			$scope.errorEmailSent = false;
		  		}
		  		else
		  		{
		  			console.log("no: " + JSON.stringify(response));
		  			if(response.error === 'no_exist_email') $scope.errorEmailNoExist = true;
		  			else if(response.error === 'send_email_error') $scope.errorEmailSent = true;
		  		}	       
			})
	        .error(function(error) {
	            console.log(error);
	        });
  	}

	$scope.restorePass = function(){		
		if($location.path() === "/recoverPass" && $scope.restore.password === $scope.restore.cpassword)
		{
			var recoverToken = $location.search().token;
			console.log("Param: " + recoverToken);
			var info = {"token": recoverToken, "password": $scope.restore.password};
		  	$http.post('/usercontrol/restorePassword', info).success( function(response) {
		  		console.log("login response: " + JSON.stringify(response));
		  		if(response.restored)
		  		{
		  			$scope.passRestored = true;
		  		}
		  		else
		  		{
		  			if(response.error === 'no_exist_restoreId') $scope.errorTokenNoExist = true;
		  			else if(response.error === 'error_system') $scope.errorSystem = true;
		  		}
		       
			});
		}
	}  	

  	$scope.goBackLogin = function(){
  		console.log("goBackLogin");
  		$scope.restore.email = "";
  		$scope.emailSent = false;
  		$scope.passRestored = false;
		$scope.errorEmailNoExist = false;
		$scope.errorEmailSent = false;
		$scope.errorTokenNoExist = false;
		$scope.errorSystem = false;
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